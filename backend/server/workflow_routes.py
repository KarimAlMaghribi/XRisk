"""
xrisk - Workflow API Routes
Author: Manuel Schott

REST API endpoints for async workflow orchestration
"""

from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_login import current_user
from datetime import datetime, date
from models import RiskAssessment, db, User
from agents import ValidationAgent
from performance_logger import perf_timer
from workflow_task import DEFAULT_ANONYMOUS_USER_UUID
import logging
import json

logger = logging.getLogger('application')

workflow_bp = Blueprint('workflow', __name__, url_prefix='/workflow')


@workflow_bp.route('/start', methods=['POST'])
def start_workflow():
    """
    Start risk assessment workflow asynchronously
    ---
    tags:
      - Workflow
    summary: Startet einen asynchronen Workflow zur Risikobewertung
    description: Erstellt eine neue Risikobewertung und startet den asynchronen Verarbeitungsprozess
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - initial_prompt
            - start_date
            - end_date
            - insurance_value
          properties:
            user_uuid:
              type: string
              description: Benutzer-UUID (optional, wird automatisch verwendet wenn eingeloggt)
              example: "abcdef01-2345-4678-9abc-def012345678"
            initial_prompt:
              type: string
              description: Beschreibung des zu bewertenden Risikos
              example: "Ein Autofahrer fährt gegen mein geparktes Auto."
            start_date:
              type: string
              format: date
              description: Startdatum der Versicherung (YYYY-MM-DD)
              example: "2025-01-01"
            end_date:
              type: string
              format: date
              description: Enddatum der Versicherung (YYYY-MM-DD)
              example: "2025-12-31"
            insurance_value:
              type: number
              format: float
              description: Versicherungswert in EUR
              example: 50000.00
    responses:
      202:
        description: Workflow erfolgreich gestartet
        schema:
          type: object
          properties:
            task_id:
              type: string
              example: "workflow_abcdef01-2345-4678-9abc-def012345678"
            risk_uuid:
              type: string
              example: "abcdef01-2345-4678-9abc-def012345678"
            user_uuid:
              type: string
              example: "abcdef01-0000-4678-9abc-def012345678"
      400:
        description: Validierungsfehler oder Risiko wurde abgelehnt
        schema:
          type: object
          properties:
            error:
              type: string
              example: "risk_validation_failed"
            reason:
              type: string
              example: "Risk description not accepted"
            retryable:
              type: boolean
              example: false
            risk_uuid:
              type: string
            status:
              type: string
              example: "rejected"
      500:
        description: Server-Fehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: "workflow_start_failed"
            error_message:
              type: string
            retryable:
              type: boolean
    """
    try:
        data = request.get_json()
        
        if current_user.is_authenticated:
            user_uuid = current_user.user_uuid
            logger.info(f"Using logged-in user UUID: {user_uuid}")
        else:
            if 'user_uuid' not in data or not data['user_uuid']:
                user_uuid = DEFAULT_ANONYMOUS_USER_UUID
                logger.info(f"No user logged in and no user_uuid provided - using unassigned user: {user_uuid}")
            else:
                user_uuid = data['user_uuid']
                logger.info(f"Using provided user_uuid: {user_uuid}")
        
        required_fields = ['initial_prompt', 'start_date', 'end_date', 'insurance_value']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Field required: {field}'}), 400
        
        try:
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            insurance_value = float(data['insurance_value'])
        except ValueError as e:
            return jsonify({'error': f'Invalid format: {str(e)}'}), 400
        
        with perf_timer("Workflow Start - Create Risk"):
            risk = RiskAssessment(
                user_uuid=user_uuid,
                initial_prompt=data['initial_prompt'],
                start_date=start_date,
                end_date=end_date,
                insurance_value=insurance_value
            )
            db.session.add(risk)
            db.session.commit()

        from app import app
        with perf_timer("Workflow Start - Validation"):
            validation_agent = ValidationAgent(app.config['OPENAI_API_KEY'])
            risk_description_with_value = f"{data['initial_prompt']}\n\nVersicherungswert: {insurance_value:,.2f} EUR"
            validation_result = validation_agent.validate_risk(risk_description_with_value)
            if not validation_result.get('valid', False):
                risk.update_status('rejected')
                logger.info(f"Risk assessment rejected: {risk.risk_uuid}")
                return jsonify({
                    'error': 'risk_validation_failed',
                    'reason': validation_result.get('reason', 'Risk description not accepted'),
                    'retryable': False,
                    'risk_uuid': risk.risk_uuid,
                    'status': 'rejected'
                }), 400
            else:
                risk.update_status('validated')
            
            logger.info(f"Risk assessment created: {risk.risk_uuid}")
            
            from workflow_task import execute_risk_workflow
            import os
            
            flask_env = os.environ.get('FLASK_ENV')
            queue_name = 'celery_local' if flask_env == 'development' else 'celery'
            
            logger.info(f"Starting workflow task - FLASK_ENV={flask_env}, queue={queue_name}")
            
            task = execute_risk_workflow.apply_async(
                args=[risk.risk_uuid, risk.user_uuid],
                task_id=f"workflow_{risk.risk_uuid}",
                queue=queue_name
            )
            
            logger.info(f"Workflow task started: {task.id} on queue {queue_name}")
        
        return jsonify({
            'task_id': task.id,
            'risk_uuid': risk.risk_uuid,
            'user_uuid': risk.user_uuid
        }), 202  # 202 Accepted
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Workflow start failed: {str(e)}")
        return jsonify({
            'error': 'workflow_start_failed',
            'error_message': str(e),
            'retryable': True
        }), 500


@workflow_bp.route('/state/risk/<risk_uuid>', methods=['GET'])
def get_workflow_status_by_risk(risk_uuid):
    """
    Get workflow status by risk UUID
    ---
    tags:
      - Workflow
    summary: Ruft den Status eines Workflows anhand der Risk UUID ab
    description: Gibt den aktuellen Status und die Inquiry-Fragen einer Risikobewertung zurück. Die user_uuid wird automatisch aus der Session/Login verwendet.
    produces:
      - application/json
    parameters:
      - in: path
        name: risk_uuid
        type: string
        required: true
        description: UUID der Risikobewertung
        example: "abcdef01-2345-4678-9abc-def012345678"
    responses:
      200:
        description: Status erfolgreich abgerufen
        schema:
          type: object
          properties:
            status:
              type: string
              example: "inquiry_awaiting_response"
            inquiry:
              type: array
              items:
                type: string
              example: ["Frage 1", "Frage 2"]
            risk_uuid:
              type: string
            user_uuid:
              type: string
            failed_reason:
              type: string
              nullable: true
      400:
        description: Fehlende Parameter
      404:
        description: Risikobewertung nicht gefunden
      500:
        description: Server-Fehler
    """
    try:
        if current_user.is_authenticated:
            user_uuid = current_user.user_uuid
        else:
            user_uuid = DEFAULT_ANONYMOUS_USER_UUID
        
        risk = None
        if current_user.is_authenticated:
            risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with logged-in user UUID {current_user.user_uuid}")
        
        if not risk:
            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with DEFAULT_ANONYMOUS_USER_UUID")
        
        if not risk:
            return jsonify({'error': 'Risk assessment not found'}), 404
        
        if current_user.is_authenticated:
            if risk.user_uuid != current_user.user_uuid and risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
                logger.warning(f"Status check attempt by wrong user: {current_user.user_uuid} tried to access risk {risk.risk_uuid} owned by {risk.user_uuid}")
                return jsonify({
                    'error': 'not_found',
                    'message': 'Risikoeintrag nicht gefunden.',
                    'suggest_logout': True
                }), 404
        elif risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
            logger.info(f"Status check attempt for non-anonymous risk {risk.risk_uuid} without login")
            return jsonify({
                'error': 'login_required',
                'message': 'Bitte loggen Sie sich ein, um den Status abzurufen.',
                'requires_login': True,
                'user_uuid': risk.user_uuid
            }), 401
        
        return jsonify({
            'status': risk.status,
            'inquiry': risk.inquiry,
            'risk_uuid': risk_uuid,
            'user_uuid': risk.user_uuid,
            'failed_reason': risk.failed_reason
        })
        
    except Exception as e:
        logger.error(f"Status check failed: {str(e)}")
        return jsonify({
            'error': 'status_check_failed',
            'error_message': str(e)
        }), 500


@workflow_bp.route('/state/task/<task_id>', methods=['GET'])
def get_workflow_status(task_id):
    """
    Get workflow status by task ID
    ---
    tags:
      - Workflow
    summary: Ruft den Status eines Workflows anhand der Task ID ab
    description: Gibt den aktuellen Status und Fortschritt eines Celery-Tasks zurück
    produces:
      - application/json
    parameters:
      - in: path
        name: task_id
        type: string
        required: true
        description: Celery Task ID
        example: "workflow_abc123..."
    responses:
      200:
        description: Status erfolgreich abgerufen
        schema:
          type: object
          properties:
            task_id:
              type: string
            status:
              type: string
              enum: [pending, progress, inquiry_awaiting_response, login_required, validated, classified, inquired, researched, analyzed, completed, failed, unknown]
              example: "progress"
            meta:
              type: object
              properties:
                status:
                  type: string
                  description: Status (Quelle der Wahrheit)
                  example: "progress"
                message:
                  type: string
                  example: "Risiko wird klassifiziert..."
                inquiries:
                  type: array
                  description: Inquiry-Fragen (nur bei status=inquiry_awaiting_response)
                risk_uuid:
                  type: string
                user_uuid:
                  type: string
            result:
              type: object
              description: Ergebnis (nur bei completed)
      500:
        description: Server-Fehler
    """
    try:
        from celery_app import celery_app
        from celery.result import AsyncResult
        
        task = AsyncResult(task_id, app=celery_app)
        
        meta = task.info if isinstance(task.info, dict) else {}
        status = meta.get('status')
        
        if not status and isinstance(task.result, dict):
            status = task.result.get('status')
        
        if not status:
            status = 'progress'
            if not meta:
                meta = {}
            meta['status'] = status
        
        if status in ('inquired', 'researched', 'analyzed') and not current_user.is_authenticated:
            user_uuid = meta.get('user_uuid')
            if user_uuid == DEFAULT_ANONYMOUS_USER_UUID or not user_uuid:
                status = 'login_required'
                meta['status'] = 'login_required'
                logger.info(f"Status {status} requires login but user is not authenticated - returning login_required")
        
        if status == 'login_required' and current_user.is_authenticated:
            risk_uuid = meta.get('risk_uuid') or (task.result.get('risk_uuid') if isinstance(task.result, dict) else None)
            if risk_uuid:
                try:
                    risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
                    if not risk:
                        risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
                    
                    if risk:
                        logger.info(f"Task {task_id} has login_required but user is now logged in. Using risk status: {risk.status}")
                        
                        meta = {
                            'risk_uuid': risk_uuid,
                            'user_uuid': risk.user_uuid,
                            'status': risk.status
                        }
                        
                        if risk.status == 'inquiry_awaiting_response' and risk.inquiry:
                            meta['inquiries'] = risk.inquiry
                        
                        status = meta['status']
                except Exception as e:
                    logger.error(f"Error checking risk status for login_required task: {str(e)}")
        
        if 'status' in meta:
            status = meta['status']
        
        response = {
            'task_id': task_id,
            'status': status,
            'meta': meta
        }
        
        if status == 'completed' and isinstance(task.result, dict):
            response['result'] = task.result
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Status check failed: {str(e)}")
        return jsonify({
            'error': 'status_check_failed',
            'error_message': str(e)
        }), 500


@workflow_bp.route('/inquiry-response', methods=['POST'])
def submit_inquiry_response():
    """
    Submit inquiry responses and resume workflow
    ---
    tags:
      - Workflow
    summary: Sendet Antworten auf Inquiry-Fragen und setzt den Workflow fort
    description: |
      Antworten werden nach Index den Fragen zugeordnet.
      Die erste Antwort entspricht der ersten Frage, die zweite der zweiten, etc.
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - task_id
            - risk_uuid
            - user_uuid
            - responses
          properties:
            task_id:
              type: string
              description: Celery Task ID
              example: "workflow_abcdef01-2345-4678-9abc-def012345678"
            risk_uuid:
              type: string
              description: UUID der Risikobewertung
              example: "abcdef01-2345-4678-9abc-def012345678"
            user_uuid:
              type: string
              description: UUID des Benutzers
              example: "abcdef01-0000-4678-9abc-def012345678"
            responses:
              type: array
              items:
                type: string
              description: Array von Antworten (Index Antwort = Index Frage)
              example: ["Antwort 1", "Antwort 2"]
    responses:
      202:
        description: Antworten erfolgreich übermittelt, Workflow wird fortgesetzt
        schema:
          type: object
          properties:
            task_id:
              type: string
            risk_uuid:
              type: string
      400:
        description: Validierungsfehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: "inquiry_response_count_mismatch"
            expected:
              type: integer
            received:
              type: integer
      404:
        description: Risikobewertung nicht gefunden
      500:
        description: Server-Fehler
    """
    try:
        data = request.get_json()
        
        required_fields = ['task_id', 'risk_uuid', 'responses']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Field required: {field}'}), 400
        
        for i, response in enumerate(data['responses']):
            if not isinstance(response, str):
                return jsonify({'error': f'Invalid response format at index {i}: expected string'}), 400
            if not response.strip():
                return jsonify({'error': 'All questions must be answered'}), 400
        
        risk_uuid = data['risk_uuid']
        
        if current_user.is_authenticated:
            user_uuid = current_user.user_uuid
        else:
            user_uuid = DEFAULT_ANONYMOUS_USER_UUID
        
        risk = None
        if current_user.is_authenticated:
            risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with logged-in user UUID {current_user.user_uuid}")
        
        if not risk:
            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with DEFAULT_ANONYMOUS_USER_UUID")
        
        if not risk:
            return jsonify({'error': 'Risk assessment not found'}), 404
        
        if current_user.is_authenticated:
            if risk.user_uuid != current_user.user_uuid and risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
                logger.warning(f"Inquiry response attempt by wrong user: {current_user.user_uuid} tried to respond to risk {risk.risk_uuid} owned by {risk.user_uuid}")
                return jsonify({
                    'error': 'not_found',
                    'message': 'Risikoeintrag nicht gefunden.',
                    'suggest_logout': True
                }), 404
        elif risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
            logger.info(f"Inquiry response attempt for non-anonymous risk {risk.risk_uuid} without login")
            return jsonify({
                'error': 'login_required',
                'message': 'Bitte loggen Sie sich ein, um die Rückfragen zu beantworten.',
                'requires_login': True,
                'user_uuid': risk.user_uuid
            }), 401
        
        if risk.status != 'inquiry_awaiting_response':
            return jsonify({'error': f'Invalid status {risk.status}, expected inquiry_awaiting_response'}), 400
        expected_count = len(risk.inquiry or [])
        received_count = len(data['responses'] or [])
        if received_count != expected_count:
            logger.error(f"Inquiry response count mismatch for {risk.risk_uuid}: expected {expected_count}, received {received_count}")
            return jsonify({'error': 'inquiry_response_count_mismatch', 'expected': expected_count, 'received': received_count}), 400

        with perf_timer(f"Inquiry Response - Resume Workflow [{data['risk_uuid']}]"):
            from workflow_task import resume_workflow_after_inquiry
            import os
            
            from celery_app import celery_app
            from celery.result import AsyncResult
            old_task = AsyncResult(data['task_id'], app=celery_app)
            old_task.revoke()
            
            flask_env = os.environ.get('FLASK_ENV')
            queue_name = 'celery_local' if flask_env == 'development' else 'celery'
            
            logger.info(f"Resuming workflow - FLASK_ENV={flask_env}, queue={queue_name}")
            
            task = resume_workflow_after_inquiry.apply_async(
                args=[risk_uuid, user_uuid, data['responses']],
                task_id=f"workflow_resume_{risk_uuid}",
                queue=queue_name
            )
            
            logger.info(f"Workflow resumed: {task.id} on queue {queue_name}")
        
        return jsonify({
            'task_id': task.id,
            'risk_uuid': risk_uuid
        }), 202  # 202 Accepted
        
    except Exception as e:
        logger.error(f"Inquiry response failed: {str(e)}")
        return jsonify({
            'error': 'inquiry_response_failed',
            'error_message': str(e),
            'retryable': True
        }), 500


@workflow_bp.route('/resume/<risk_uuid>', methods=['GET'])
def resume_workflow_get(risk_uuid):
    """
    Resume a workflow via GET request - returns current status from database
    
    URL: /workflow/resume/{risk_uuid}
    
    Response: JSON with current workflow status from database (for API requests)
    Redirects to frontend for browser requests.
    The user_uuid is automatically determined from the session/login.
    """
    is_api_request = request.headers.get('Accept', '').startswith('application/json') or \
                     request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if not is_api_request:
        from config import Config
        frontend_url = Config.FRONTEND_URL
        frontend_resume_route = getattr(Config, 'FRONTEND_RESUME_ROUTE', '/')
        redirect_url = f"{frontend_url}{frontend_resume_route}?resume={risk_uuid}"
        return redirect(redirect_url)
    
    try:
        if current_user.is_authenticated:
            user_uuid = current_user.user_uuid
        else:
            user_uuid = DEFAULT_ANONYMOUS_USER_UUID
        
        risk = None
        if current_user.is_authenticated:
            risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with logged-in user UUID {current_user.user_uuid}")
        
        if not risk:
            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with DEFAULT_ANONYMOUS_USER_UUID")
        
        if not risk:
            if not current_user.is_authenticated:
                return jsonify({
                    'error': 'login_required',
                    'message': 'Bitte loggen Sie sich ein, um diesen Risikoeintrag fortzusetzen.',
                    'requires_login': True
                }), 401
            return jsonify({'error': 'Risk assessment not found'}), 404
        
        if current_user.is_authenticated:
            if risk.user_uuid != current_user.user_uuid and risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
                logger.warning(f"Resume attempt by wrong user: {current_user.user_uuid} tried to resume risk {risk.risk_uuid} owned by {risk.user_uuid}")
                return jsonify({
                    'error': 'not_found',
                    'message': 'Risikoeintrag nicht gefunden.',
                    'suggest_logout': True
                }), 404
            
            if risk.user_uuid == DEFAULT_ANONYMOUS_USER_UUID:
                old_user_uuid = risk.user_uuid
                risk.user_uuid = current_user.user_uuid
                
                if risk.status == 'inquiry_awaiting_response':
                    from workflow_task import are_all_inquiries_answered
                    if are_all_inquiries_answered(risk):
                        risk.update_status('inquired')
                        logger.info(f"Updated status from 'inquiry_awaiting_response' to 'inquired' for risk {risk.risk_uuid} (all inquiries answered)")
                
                db.session.commit()
                logger.info(f"Auto-assigned risk {risk.risk_uuid} from anonymous user to logged-in user {current_user.user_uuid}")
        
        elif risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
            logger.info(f"Resume attempt for non-anonymous risk {risk.risk_uuid} without login")
            return jsonify({
                'error': 'login_required',
                'message': 'Bitte loggen Sie sich ein, um diesen Risikoeintrag fortzusetzen.',
                'requires_login': True,
                'user_uuid': risk.user_uuid
            }), 401
        
        logger.info(f"Resume GET request for risk {risk_uuid}, returning current DB status: {risk.status}")
        
        response_data = {
            'status': risk.status,
            'risk_uuid': risk.risk_uuid,
            'user_uuid': risk.user_uuid
        }
        
        # Zusätzliche Informationen je nach Status hinzufügen
        if risk.processing_since:
            elapsed = risk.get_processing_elapsed_seconds()
            task_id = f"workflow_{risk.risk_uuid}"
            if risk.retry_count > 0:
                task_id = f"workflow_retry_{risk.risk_uuid}_{risk.retry_count}"
            response_data['processing_since'] = risk.processing_since.isoformat()
            response_data['elapsed_seconds'] = elapsed
            response_data['task_id'] = task_id
        
        if risk.status == 'inquiry_awaiting_response' and risk.inquiry:
            response_data['inquiries'] = risk.inquiry
        
        if risk.failed_at:
            response_data['failed_at'] = risk.failed_at.isoformat()
            response_data['failed_reason'] = risk.failed_reason
            response_data['retry_count'] = risk.retry_count
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Resume workflow GET failed: {str(e)}")
        return jsonify({
            'error': 'resume_failed',
            'error_message': str(e)
        }), 500


@workflow_bp.route('/resume', methods=['POST'])
def resume_workflow():
    """
    Resume a workflow - handles all cases intelligently
    ---
    tags:
      - Workflow
    summary: Setzt einen Workflow fort oder verbindet sich neu
    description: |
      Behandelt verschiedene Fälle intelligent:
      - Wenn fehlgeschlagen: Startet Retry
      - Wenn läuft: Gibt task_id für SSE-Reconnect zurück
      - Wenn auf Inquiry wartet: Gibt Inquiry-Fragen zurück
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - risk_uuid
          properties:
            risk_uuid:
              type: string
              description: UUID der Risikobewertung. Die user_uuid wird automatisch aus der Session/Login verwendet.
              example: "abcdef01-2345-4678-9abc-def012345678"
    responses:
      200:
        description: Workflow-Status zurückgegeben
        schema:
          type: object
          properties:
            action:
              type: string
              enum: [retry, reconnect, inquiry, completed, rejected]
            task_id:
              type: string
            inquiries:
              type: array
              items:
                type: string
              description: Inquiry-Fragen (nur bei action=inquiry)
            processing_since:
              type: string
              format: date-time
              description: Zeitpunkt seit dem verarbeitet wird (nur bei reconnect)
            elapsed_seconds:
              type: integer
              description: Verstrichene Sekunden (nur bei reconnect)
      202:
        description: Workflow wird fortgesetzt
      400:
        description: Ungültiger Status oder abgelehnt
      404:
        description: Risikobewertung nicht gefunden
      500:
        description: Server-Fehler
    """
    try:
        data = request.get_json()
        
        if 'risk_uuid' not in data:
            return jsonify({'error': 'risk_uuid required'}), 400
        
        risk_uuid = data['risk_uuid']
        
        # Determine user_uuid from session/login or use anonymous
        if current_user.is_authenticated:
            user_uuid = current_user.user_uuid
        else:
            user_uuid = DEFAULT_ANONYMOUS_USER_UUID
        
        # Try to find risk with logged-in user's UUID first, then with anonymous UUID
        risk = None
        if current_user.is_authenticated:
            risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with logged-in user UUID {current_user.user_uuid}")
        
        # If not found and user is logged in, try with anonymous UUID (for risks that were created anonymously)
        if not risk:
            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with DEFAULT_ANONYMOUS_USER_UUID")
        
        if not risk:
            return jsonify({'error': 'Risk assessment not found'}), 404
        
        # Security check: If user is logged in, verify they own this risk assessment
        # Exception: logged-in users can access risks with DEFAULT_ANONYMOUS_USER_UUID
        if current_user.is_authenticated:
            if risk.user_uuid != current_user.user_uuid and risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
                logger.warning(f"Resume attempt by wrong user: {current_user.user_uuid} tried to resume risk {risk.risk_uuid} owned by {risk.user_uuid}")
                return jsonify({
                    'error': 'not_found',
                    'message': 'Risikoeintrag nicht gefunden.',
                    'suggest_logout': True
                }), 404
            
            if risk.user_uuid == DEFAULT_ANONYMOUS_USER_UUID:
                old_user_uuid = risk.user_uuid
                risk.user_uuid = current_user.user_uuid
                
                if risk.status == 'inquiry_awaiting_response':
                    from workflow_task import are_all_inquiries_answered
                    if are_all_inquiries_answered(risk):
                        risk.update_status('inquired')
                        logger.info(f"Updated status from 'inquiry_awaiting_response' to 'inquired' for risk {risk.risk_uuid} (all inquiries answered)")
                
                db.session.commit()
                logger.info(f"Auto-assigned risk {risk.risk_uuid} from anonymous user to logged-in user {current_user.user_uuid}")
                
                from celery_app import celery_app
                from celery.result import AsyncResult
                
                old_task_ids = [
                    f"workflow_{risk.risk_uuid}",
                    f"workflow_resume_{risk.risk_uuid}"
                ]
                
                for old_task_id in old_task_ids:
                    try:
                        old_task = AsyncResult(old_task_id, app=celery_app)
                        old_task_meta = old_task.info if isinstance(old_task.info, dict) else {}
                        old_task_status = old_task_meta.get('status')
                        if not old_task_status and isinstance(old_task.result, dict):
                            old_task_status = old_task.result.get('status')
                        
                        if old_task_status == 'login_required':
                            logger.info(f"Revoking old task {old_task_id} with login_required status (user is now logged in)")
                            old_task.revoke(terminate=True)
                    except Exception as e:
                        logger.debug(f"Could not revoke old task {old_task_id}: {str(e)}")
        # If not logged in but risk belongs to a registered user (not anonymous), require login
        elif risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
            logger.info(f"Resume attempt for non-anonymous risk {risk.risk_uuid} without login")
            return jsonify({
                'error': 'login_required',
                'message': 'Bitte loggen Sie sich ein, um diesen Risikoeintrag fortzusetzen.',
                'requires_login': True,
                'user_uuid': risk.user_uuid
            }), 401
        
        logger.info(f"Resume request for risk {risk_uuid}, returning current DB status: {risk.status}")
        
        response_data = {
            'status': risk.status,
            'risk_uuid': risk.risk_uuid,
            'user_uuid': risk.user_uuid
        }
        
        if risk.processing_since:
            elapsed = risk.get_processing_elapsed_seconds()
            task_id = f"workflow_{risk.risk_uuid}"
            if risk.retry_count > 0:
                task_id = f"workflow_retry_{risk.risk_uuid}_{risk.retry_count}"
            response_data['processing_since'] = risk.processing_since.isoformat()
            response_data['elapsed_seconds'] = elapsed
            response_data['task_id'] = task_id
        
        if risk.status == 'inquiry_awaiting_response' and risk.inquiry:
            response_data['inquiries'] = risk.inquiry
        
        if risk.failed_at:
            response_data['failed_at'] = risk.failed_at.isoformat()
            response_data['failed_reason'] = risk.failed_reason
            response_data['retry_count'] = risk.retry_count
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Resume workflow failed: {str(e)}")
        return jsonify({
            'error': 'resume_failed',
            'error_message': str(e)
        }), 500


@workflow_bp.route('/cancel/<task_id>', methods=['POST'])
def cancel_workflow(task_id):
    """
    Cancel a running workflow
    ---
    tags:
      - Workflow
    summary: Bricht einen laufenden Workflow ab
    description: Bricht einen Celery-Task ab und beendet die Verarbeitung
    produces:
      - application/json
    parameters:
      - in: path
        name: task_id
        type: string
        required: true
        description: Celery Task ID
        example: "workflow_abcdef01-2345-4678-9abc-def012345678"
    responses:
      200:
        description: Workflow erfolgreich abgebrochen
        schema:
          type: object
          properties:
            task_id:
              type: string
      500:
        description: Server-Fehler
    """
    try:
        from celery_app import celery_app
        from celery.result import AsyncResult
        
        task = AsyncResult(task_id, app=celery_app)
        task.revoke(terminate=True)
        
        logger.info(f"Workflow cancelled: {task_id}")
        
        return jsonify({
            'task_id': task_id,
        })
        
    except Exception as e:
        logger.error(f"Workflow cancel failed: {str(e)}")
        return jsonify({
            'error': 'cancel_failed',
            'error_message': str(e)
        }), 500


@workflow_bp.route('/result/<risk_uuid>', methods=['GET'])
def get_workflow_result(risk_uuid):
    """
    Get final workflow result by risk UUID
    ---
    tags:
      - Workflow
    summary: Ruft das finale Ergebnis einer Risikobewertung ab
    description: Gibt alle Daten einer abgeschlossenen Risikobewertung zurück
    produces:
      - application/json
    parameters:
      - in: path
        name: risk_uuid
        type: string
        required: true
        description: UUID der Risikobewertung
        example: "abcdef01-2345-4678-9abc-def012345678"
      - in: query
        name: user_uuid
        type: string
        required: true
        description: UUID des Benutzers
        example: "abcdef01-0000-4678-9abc-def012345678"
    responses:
      200:
        description: Ergebnis erfolgreich abgerufen
        schema:
          type: object
          properties:
            risk_uuid:
              type: string
            status:
              type: string
              example: "completed"
            report:
              type: object
              description: Vollständiger Bewertungsbericht
      401:
        description: Login erforderlich
      403:
        description: Nicht autorisiert - Risikoeintrag gehört einem anderen Benutzer
        schema:
          type: object
          properties:
            error:
              type: string
            message:
              type: string
      400:
        description: Fehlende Parameter
      404:
        description: Risikobewertung nicht gefunden
      500:
        description: Server-Fehler
    """
    try:
        # Determine user_uuid from session/login or use anonymous
        if current_user.is_authenticated:
            user_uuid = current_user.user_uuid
        else:
            user_uuid = DEFAULT_ANONYMOUS_USER_UUID
        
        # Try to find risk with logged-in user's UUID first, then with anonymous UUID
        risk = None
        if current_user.is_authenticated:
            risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with logged-in user UUID {current_user.user_uuid}")
        
        # If not found and user is logged in, try with anonymous UUID (for risks that were created anonymously)
        if not risk:
            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with DEFAULT_ANONYMOUS_USER_UUID")
        
        if not risk:
            return jsonify({'error': 'Risk assessment not found'}), 404
        
        if current_user.is_authenticated:
            if risk.user_uuid != current_user.user_uuid and risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
                logger.warning(f"Result retrieval attempt by wrong user: {current_user.user_uuid} tried to access risk {risk.risk_uuid} owned by {risk.user_uuid}")
                return jsonify({
                    'error': 'not_found',
                    'message': 'Risikoeintrag nicht gefunden.',
                    'suggest_logout': True
                }), 404
        elif risk.user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
            logger.info(f"Result retrieval attempt for non-anonymous risk {risk.risk_uuid} without login")
            return jsonify({
                'error': 'login_required',
                'message': 'Bitte loggen Sie sich ein, um das Ergebnis abzurufen.',
                'requires_login': True,
                'user_uuid': risk.user_uuid
            }), 401
        
        return jsonify(risk.to_dict())
        
    except Exception as e:
        logger.error(f"Result retrieval failed: {str(e)}")
        return jsonify({
            'error': 'result_retrieval_failed',
            'error_message': str(e)
        }), 500


@workflow_bp.route('/risk-user', methods=['POST'])
def update_risk_user():
    """
    Update user_uuid of a risk assessment after login/registration
    ---
    tags:
      - Workflow
    summary: Aktualisiert die user_uuid einer Risikobewertung nach Login/Registrierung
    description: Verknüpft eine anonyme Risikobewertung mit einem Benutzerkonto
    consumes:
      - application/json
    produces:
      - application/json
    security:
      - sessionAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - risk_uuid
          properties:
            risk_uuid:
              type: string
              description: UUID der Risikobewertung
              example: "abcdef01-2345-4678-9abc-def012345678"
            old_user_uuid:
              type: string
              description: Alte user_uuid (optional, zur Verifizierung)
              example: "00000000-0000-4000-0000-000000000000"  # DEFAULT_ANONYMOUS_USER_UUID
    responses:
      200:
        description: user_uuid erfolgreich aktualisiert
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            risk_uuid:
              type: string
            new_user_uuid:
              type: string
      401:
        description: Nicht authentifiziert
      404:
        description: Risikobewertung nicht gefunden
      500:
        description: Server-Fehler
    """
    try:
        if not current_user.is_authenticated:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        if not data or 'risk_uuid' not in data:
            return jsonify({'error': 'risk_uuid required'}), 400
        
        risk_uuid = data['risk_uuid']
        old_user_uuid = data.get('old_user_uuid')
        new_user_uuid = current_user.user_uuid
        
        # Try to find risk assessment with old_user_uuid first
        if old_user_uuid:
            risk = RiskAssessment.get_by_uuids(old_user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with old_user_uuid: {old_user_uuid}")
        
        # If not found, try with logged-in user's UUID (in case it was already updated)
        if not risk:
            risk = RiskAssessment.get_by_uuids(new_user_uuid, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with new_user_uuid: {new_user_uuid}")
        
        # If still not found and old_user_uuid is not DEFAULT_ANONYMOUS_USER_UUID, try with DEFAULT_ANONYMOUS_USER_UUID
        # This handles the case where old_user_uuid was not provided but risk belongs to anonymous user
        if not risk and old_user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
            if risk:
                logger.info(f"Found risk {risk_uuid} with DEFAULT_ANONYMOUS_USER_UUID")
        
        if not risk:
            logger.warning(f"Risk assessment not found: {risk_uuid}")
            return jsonify({'error': 'Risk assessment not found'}), 404
        
        was_anonymous = risk.user_uuid == DEFAULT_ANONYMOUS_USER_UUID
        is_already_assigned = risk.user_uuid == new_user_uuid
        
        if not is_already_assigned:
            risk.user_uuid = new_user_uuid
            db.session.commit()
            logger.info(f"Updated user_uuid for risk {risk_uuid} from {old_user_uuid} to {new_user_uuid}")
        else:
            logger.info(f"Risk {risk_uuid} already assigned to user {new_user_uuid}, no update needed")
        
        if not is_already_assigned:
            next_url = session.get('_next') or session.get('next')
            if next_url and old_user_uuid and old_user_uuid == DEFAULT_ANONYMOUS_USER_UUID:
                if 'resume=' in next_url and f'user_uuid={old_user_uuid}' in next_url:
                    updated_next_url = next_url.replace(f'user_uuid={old_user_uuid}', f'user_uuid={new_user_uuid}')
                    session['_next'] = updated_next_url
                    logger.info(f"Updated next URL in session: {next_url} -> {updated_next_url}")
        
        resumable_statuses = ('inquired', 'inquiry_awaiting_response', 'researched', 'analyzed', 'classified')
        if risk.status in resumable_statuses:
            try:
                from workflow_task import resume_from_current_status
                from celery.result import AsyncResult
                from celery_app import celery_app
                import os
                
                flask_env = os.environ.get('FLASK_ENV')
                queue_name = 'celery_local' if flask_env == 'development' else 'celery'
                
                old_task_ids = [
                    f"workflow_{risk_uuid}",
                    f"workflow_resume_{risk_uuid}"
                ]
                
                for old_task_id in old_task_ids:
                    try:
                        old_task = AsyncResult(old_task_id, app=celery_app)
                        old_task_meta = old_task.info if isinstance(old_task.info, dict) else {}
                        old_task_status = old_task_meta.get('status')
                        if not old_task_status and isinstance(old_task.result, dict):
                            old_task_status = old_task.result.get('status')
                        
                        # Revoke if task is running (not completed/failed) or has login_required status
                        if old_task_status and old_task_status not in ('completed', 'failed', 'unknown'):
                            # Task is still running or in intermediate state - revoke it
                            old_task.revoke(terminate=True)
                            logger.info(f"Revoked old task {old_task_id} (status: {old_task_status}) before starting new one")
                        elif old_task_status == 'login_required':
                            logger.info(f"Revoking old task {old_task_id} with login_required status (user is now logged in)")
                            old_task.revoke(terminate=True)
                    except Exception as e:
                        logger.debug(f"Could not revoke old task {old_task_id}: {str(e)}")
                
                logger.info(f"Resuming workflow for risk {risk_uuid} after user login (status: {risk.status})")
                
                # Use workflow_resume task_id for the new resume task
                new_task_id = f"workflow_resume_{risk_uuid}"
                task = resume_from_current_status.apply_async(
                    args=[risk_uuid, new_user_uuid],
                    task_id=new_task_id,
                    queue=queue_name
                )
                
                logger.info(f"Workflow resume task started: {task.id} for risk {risk_uuid}")
                
                return jsonify({
                    'success': True,
                    'risk_uuid': risk_uuid,
                    'new_user_uuid': new_user_uuid,
                    'workflow_resumed': True,
                    'task_id': task.id
                })
            except Exception as e:
                logger.error(f"Failed to resume workflow after user update: {str(e)}")
                # Still return success for the user update, but log the workflow resume failure
                return jsonify({
                    'success': True,
                    'risk_uuid': risk_uuid,
                    'new_user_uuid': new_user_uuid,
                    'workflow_resumed': False,
                    'workflow_error': str(e)
                })
        
        return jsonify({
            'success': True,
            'risk_uuid': risk_uuid,
            'new_user_uuid': new_user_uuid
        })
        
    except Exception as e:
        logger.error(f"Update user failed: {str(e)}")
        db.session.rollback()
        return jsonify({
            'error': 'update_failed',
            'error_message': str(e)
        }), 500

