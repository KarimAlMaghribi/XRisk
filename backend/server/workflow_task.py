"""
xrisk - Workflow Celery Task
Author: Manuel Schott

Async workflow orchestration task for risk assessment
"""

from celery_app import celery_app
from datetime import datetime, timezone
from config import Config
from performance_logger import perf_timer
from models import db
import redis
import ssl
import logging
import json

logger = logging.getLogger('celery')

# Default anonymous user UUID - used when user is not logged in - risk input started anonymously
DEFAULT_ANONYMOUS_USER_UUID = '00000000-0000-4000-0000-000000000000'


def is_anonymous_user(user_uuid):
    """
    Check if user_uuid is the default anonymous user UUID
    
    Args:
        user_uuid: User UUID to check
        
    Returns:
        bool: True if user_uuid is the default anonymous UUID
    """
    return user_uuid == DEFAULT_ANONYMOUS_USER_UUID


def get_answered_inquiries(risk):
    """
    Get list of answered inquiries from a risk assessment
    
    Args:
        risk: RiskAssessment instance
        
    Returns:
        list: List of inquiry dictionaries that have responses
    """
    if not risk.inquiry:
        return []
    return [q for q in risk.inquiry if q.get('response')]


def are_all_inquiries_answered(risk):
    """
    Check if all inquiries have been answered
    
    Args:
        risk: RiskAssessment instance
        
    Returns:
        bool: True if all inquiries have responses, False otherwise
    """
    if not risk.inquiry:
        return False
    answered_inquiries = get_answered_inquiries(risk)
    return len(answered_inquiries) == len(risk.inquiry) and len(answered_inquiries) > 0


def publish_workflow_event(task_id, meta):
    """
    Publish workflow event to Redis Pub/Sub for real-time updates
    
    Args:
        task_id: Celery task ID
        meta: Metadata dict with step info (MUST contain 'status' field - this is the source of truth)
    """
    try:
        if Config.REDIS_URL.startswith('rediss://'):
            redis_client = redis.from_url(
                Config.REDIS_URL,
                ssl_cert_reqs=ssl.CERT_NONE,
                decode_responses=True
            )
        else:
            redis_client = redis.from_url(
                Config.REDIS_URL,
                decode_responses=True
            )
        
        # meta.status is the source of truth - must always be set
        status = meta.get('status')
        if not status:
            logger.warning(f"[Redis Pub/Sub] meta.status not set for task {task_id}, defaulting to 'progress'")
            status = 'progress'
            meta['status'] = status
        
        event_data = {
            'task_id': task_id,
            'status': status,
            'meta': meta
        }
        
        channel = f"workflow:{task_id}"
        redis_client.publish(channel, json.dumps(event_data))
        redis_client.close()
        
        logger.debug(f"[Redis Pub/Sub] Published event to {channel}: {status}")
        
    except Exception as e:
        logger.error(f"[Redis Pub/Sub] Failed to publish event: {e}")


def update_and_publish(task_self, meta):
    """
    Update Celery task state AND publish to Redis Pub/Sub
    
    Wrapper function that combines:
    1. self.update_state() - Updates Celery result backend
    2. publish_workflow_event() - Publishes to Redis Pub/Sub for SSE
    
    Args:
        task_self: Celery task instance (self)
        meta: Metadata dict (MUST contain 'status' field - this is the source of truth)
    
    Note:
        Celery state is determined automatically:
        - If meta.status == 'completed' → Celery state = 'SUCCESS'
        - If meta.status == 'failed' → Celery state = 'FAILURE'
        - Otherwise → Celery state = 'PROGRESS'
        The actual workflow status comes from meta.status, which is the single source of truth.
    """
    if not isinstance(meta, dict):
        meta = {}
    
    if 'status' not in meta:
        logger.warning(f"[Workflow] meta.status not set, defaulting to 'processing'")
        meta['status'] = 'processing'
    
    if meta['status'] in ('inquired', 'researched', 'analyzed'):
        user_uuid = meta.get('user_uuid')
        if is_anonymous_user(user_uuid):
            meta['status'] = 'login_required'
            logger.info(f"[Workflow {meta.get('risk_uuid', 'unknown')}] Status requires login but user is anonymous - setting login_required")
    
    celery_state = 'PROGRESS'
    if meta['status'] == 'completed':
        celery_state = 'SUCCESS'
    elif meta['status'] == 'failed':
        celery_state = 'FAILURE'
    
    task_self.update_state(state=celery_state, meta=meta)
    publish_workflow_event(task_self.request.id, meta)


 


@celery_app.task(bind=True, name='workflow.execute_risk_workflow')
def execute_risk_workflow(self, risk_uuid, user_uuid):
    """
    Execute complete risk assessment workflow asynchronously
    
    Args:
        self: Celery task instance (bound)
        risk_uuid: UUID of the risk assessment
        user_uuid: UUID of the user
        
    Returns:
        dict: Final workflow result
    """
    from models import RiskAssessment, db
    try:
        from agents import (
            ClassificationAgent, InquiryAgent, ResearchAgent,
            AnalysisAgent, ReportAgent
        )
    except ImportError as e:
        logger.error(f"[Workflow {risk_uuid}] Failed to import agents: {e}")
        raise Exception(f"Agent import failed: {str(e)}")
    
    from app import app
    from config import Config
    
    logger.info(f"[Workflow {risk_uuid}] Starting workflow execution")
    
    update_and_publish(
        self,
        meta={
            'step': 'started',
            'status': 'processing',  # Workflow is processing, DB status is still 'validated'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid
        }
    )
    
    try:
        with app.app_context():
            risk = RiskAssessment.get_by_uuids(user_uuid, risk_uuid)
            if not risk:
                raise Exception('Risk assessment not found')
            
            logger.info(f"[Workflow {risk_uuid}] Step 1: Classification")
            
            if risk.status != 'validated':
                raise Exception(f"Ungültiger Status für Klassifizierung: {risk.status} (erwartet: validated)")
            update_and_publish(
                self,
                meta={
                    'step': 'classification',
                    'status': 'processing',
                    'risk_uuid': risk_uuid,
                    'user_uuid': user_uuid,
                    'current_agent': 'classification'
                }
            )
            
            try:
                with perf_timer(f"Classification Step [{risk_uuid}]"):
                    classification_agent = ClassificationAgent(Config.OPENAI_API_KEY)
                    risk_description = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR"
                    risk_type = classification_agent.classify_risk(risk_description)
                
                risk.risk_type = risk_type
                risk.update_status('classified')
                update_and_publish(
                    self,
                    meta={
                    'step': 'classified',
                    'status': 'classified',
                    'risk_uuid': risk_uuid,
                        'user_uuid': user_uuid,
                        'current_agent': 'classification',
                        'risk_type': risk_type
                    }
                )
                
                if risk.retry_count > 0 or risk.failed_at:
                    risk.reset_retry_state()
                    logger.info(f"[Workflow {risk_uuid}] Retry successful - retry state reset")
                
                logger.info(f"[Workflow {risk_uuid}] Classification complete: {risk_type}")
            except Exception as e:
                logger.error(f"[Workflow {risk_uuid}] Classification failed: {str(e)}")
                try:
                    risk.mark_as_failed(str(e))
                except Exception:
                    pass
                raise Exception(f"Klassifizierung fehlgeschlagen: {str(e)}")
            
            logger.info(f"[Workflow {risk_uuid}] Step 2: Inquiry")
            
            if risk.status != 'classified':
                raise Exception(f"Ungültiger Status für Rückfragen: {risk.status} (erwartet: classified)")
            
            update_and_publish(
                self,
                meta={
                    'step': 'inquiry',
                    'status': 'processing',
                    'risk_uuid': risk_uuid,
                    'user_uuid': user_uuid,
                    'current_agent': 'inquiry'
                }
            )
            
            try:
                with perf_timer(f"Inquiry Step [{risk_uuid}]"):
                    inquiry_agent = InquiryAgent(Config.OPENAI_API_KEY)
                    inquiries = inquiry_agent.generate_inquiries(risk_description)
                
                if inquiries and len(inquiries) > 0:
                    if risk.inquiry and any(q.get('response') for q in (risk.inquiry or [])):
                        logger.info(f"[Workflow {risk_uuid}] Existing inquiry responses detected, skipping regeneration")
                    else:
                        inquiry_data = [{'question': q, 'response': None} for q in inquiries]
                        risk.inquiry = inquiry_data
                        db.session.commit()
                        risk.update_status('inquiry_awaiting_response')
                    
                    logger.info(f"[Workflow {risk_uuid}] Inquiry generated: {len(inquiries)} questions")
                    
                    try:
                        from models import User
                        from app import app
                        from email_service import email_service
                        user = User.get_by_uuid(user_uuid)
                        if user and user.email:
                            email_service.init_app(app)
                            email_sent = email_service.send_inquiry_notification(
                                user.email,
                                user.name or '',
                                risk_uuid,
                                user_uuid
                            )
                            if email_sent:
                                logger.info(f"[Workflow {risk_uuid}] Inquiry notification email sent to {user.email}")
                            else:
                                logger.warning(f"[Workflow {risk_uuid}] Failed to send inquiry notification email to {user.email}")
                        else:
                            logger.warning(f"[Workflow {risk_uuid}] User not found or no email for user_uuid {user_uuid}")
                    except Exception as e:
                        logger.error(f"[Workflow {risk_uuid}] Error sending inquiry notification email: {str(e)}")
                    
                    update_and_publish(
                        self,
                        meta={
                            'step': 'inquiry_awaiting_response',
                            'status': 'inquiry_awaiting_response',
                            'inquiries': inquiry_data,
                            'risk_uuid': risk_uuid,
                            'user_uuid': user_uuid,
                            'current_agent': 'inquiry'
                        }
                    )
                    
                    # Task pauses here - will be resumed by workflow_resume task
                    # CRITICAL: Do not continue workflow execution - wait for user responses!
                    logger.info(f"[Workflow {risk_uuid}] Workflow paused - waiting for inquiry responses")
                    return {
                        'status': 'inquiry_required',
                        'inquiries': inquiry_data,
                        'risk_uuid': risk_uuid,
                        'user_uuid': user_uuid
                    }
                else:
                    # No inquiries - continue directly
                    risk.inquiry = []
                    # Kleinrisiko: Nur Recherche überspringen
                    try:
                        is_small_risk = risk.insurance_value is not None and float(risk.insurance_value) <= Config.SMALL_RISK_THRESHOLD_EUR
                    except Exception:
                        is_small_risk = False

                    # Check if user is logged in before proceeding with analysis
                    if is_anonymous_user(user_uuid):
                        logger.warning(f"[Workflow {risk_uuid}] Cannot proceed with analysis - user not logged in (user_uuid: {user_uuid})")
                        risk.update_status('inquired')
                        update_and_publish(
                            self,
                            meta={
                                'step': 'inquired',
                                'status': 'login_required',
                                'risk_uuid': risk_uuid,
                                'user_uuid': user_uuid,
                                'current_agent': 'inquiry',
                                'login_required': True,
                                'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Analyse fortzufahren.'
                            }
                        )
                        return {
                            'status': 'login_required',
                            'risk_uuid': risk_uuid,
                            'user_uuid': user_uuid,
                            'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Analyse fortzufahren.'
                        }
                    
                    try:
                        is_small_risk = risk.insurance_value is not None and float(risk.insurance_value) <= Config.SMALL_RISK_THRESHOLD_EUR
                    except Exception:
                        is_small_risk = False

                    if is_small_risk:
                        # Skip research and inquiry, use combined analysis and report agent
                        risk.update_status('inquired')
                        update_and_publish(
                            self,
                            meta={
                                'step': 'inquired',
                                'status': risk.status,  # Use risk.status as source of truth
                                'risk_uuid': risk_uuid,
                                'user_uuid': user_uuid,
                                'current_agent': 'inquiry',
                                'kleinrisiko': True
                            }
                        )
                        logger.info(f"[Workflow {risk_uuid}] No inquiries - Kleinrisiko: using combined agent")
                        return _continue_from_inquiry_with_combined_agent(self, risk, risk_uuid, user_uuid)
                    else:
                        risk.update_status('inquired')
                        # Reflect DB transition to Celery result backend
                        update_and_publish(
                            self,
                            meta={
                                'step': 'inquired',
                                'status': risk.status,  # Use risk.status as source of truth
                                'risk_uuid': risk_uuid,
                                'user_uuid': user_uuid
                            }
                        )
                        logger.info(f"[Workflow {risk_uuid}] No inquiries needed, continuing to research")
                        return _continue_workflow_after_inquiry(self, risk, risk_uuid, user_uuid)
                    
            except Exception as e:
                logger.error(f"[Workflow {risk_uuid}] Inquiry failed: {str(e)}")
                try:
                    risk.mark_as_failed(str(e))
                except Exception:
                    pass
                raise Exception(f"Rückfragen fehlgeschlagen: {str(e)}")
            
    except Exception as e:
        # Ensure error message is JSON serializable
        error_message = str(e)
        if hasattr(e, '__class__'):
            error_type = e.__class__.__name__
            logger.error(f"[Workflow {risk_uuid}] Workflow failed: {error_type}: {error_message}")
        else:
            logger.error(f"[Workflow {risk_uuid}] Workflow failed: {error_message}")
        # Mark as failed if risk is available
        try:
            if 'risk' in locals() and risk:
                risk.mark_as_failed(error_message)
        except Exception:
            pass
            
        update_and_publish(
            self,
            meta={
                'step': 'error',
                'status': 'processing',  # Still processing despite error
                'error': True,
                'error_type': type(e).__name__ if e is not None else 'Unknown',
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid
            }
        )
        raise


def _continue_workflow_after_inquiry(self, risk, risk_uuid, user_uuid):
    """
    Continue workflow after inquiry step (with or without user responses)
    
    Args:
        self: Celery task instance
        risk: RiskAssessment instance
        risk_uuid: UUID of risk
        user_uuid: UUID of user
        
    Returns:
        dict: Workflow result
    """
    # Check if user is logged in before proceeding with research/analysis
    if is_anonymous_user(user_uuid):
        logger.warning(f"[Workflow {risk_uuid}] Cannot proceed with research/analysis - user not logged in (user_uuid: {user_uuid})")
        update_and_publish(
            self,
            meta={
                'step': 'inquired',
                'status': 'login_required',
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid,
                'current_agent': 'inquiry',
                'login_required': True,
                'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Recherche und Analyse fortzufahren.'
            }
        )
        return {
            'status': 'login_required',
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Recherche und Analyse fortzufahren.'
        }
    
    try:
        from agents import ResearchAgent, AnalysisAgent, ReportAgent
    except ImportError as e:
        logger.error(f"[Workflow {risk_uuid}] Failed to import agents for continuation: {e}")
        raise Exception(f"Agent import failed: {str(e)}")
    
    from config import Config
    
    # Step 3: Research
    logger.info(f"[Workflow {risk_uuid}] Step 3: Research")
    
    if risk.status != 'inquired':
        raise Exception(f"Ungültiger Status für Recherche: {risk.status} (erwartet: inquired)")
    
    # Check if user exists (is logged in)
    from models import User
    user_exists = User.get_by_uuid(user_uuid) is not None
    
    update_and_publish(
        self,
        meta={
            'step': 'research',
            'status': 'processing',  # Workflow is processing, DB status is still 'inquired'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'research',
            'user_not_logged_in': not user_exists,  # Flag to show login prompt in frontend
            'message': 'Die Recherche kann einige Minuten dauern. Bitte loggen Sie sich in der Zwischenzeit ein oder registrieren Sie sich, damit Ihr Risikobeschrieb Ihrem Konto zugeordnet werden kann.' if not user_exists else None
        }
    )
    
    try:
        research_agent = ResearchAgent(Config.OPENAI_API_KEY)
        
        research_prompt = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR"
        answered_inquiries = get_answered_inquiries(risk)
        if answered_inquiries:
            inquiry_text = " ".join([f"Q: {q.get('question', '')} A: {q.get('response', '')}" 
                                   for q in answered_inquiries])
            research_prompt += f"\n\nZusätzliche Informationen: {inquiry_text}"
        
        with perf_timer(f"Research Step [{risk_uuid}]"):
            research_results = research_agent.conduct_comprehensive_research(
                research_prompt,
                risk_type=risk.risk_type or "allgemein"
            )
        
        risk.research_current = research_results.get('current', {})
        risk.research_historical = research_results.get('historical', {})
        risk.research_regulatory = research_results.get('regulatory', {})
        # Persist research blocks immediately to avoid losing progress
        db.session.commit()
        risk.update_status('researched')
        # Immediately reflect DB transition in Celery result backend to avoid stale 'research' on reconnects
        update_and_publish(
            self,
            meta={
                'step': 'researched',
                'status': risk.status,  # Use risk.status as source of truth
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid,
                'current_agent': 'research'
            }
        )
        
        logger.info(f"[Workflow {risk_uuid}] Research complete")
    except Exception as e:
        logger.error(f"[Workflow {risk_uuid}] Research failed: {str(e)}")
        # Mark as failed for retry mechanism
        risk.mark_as_failed(str(e))
        raise Exception(f"Research fehlgeschlagen: {str(e)}")
    
    # Step 4: Analysis
    logger.info(f"[Workflow {risk_uuid}] Step 4: Analysis")
    
    if risk.status != 'researched':
        raise Exception(f"Ungültiger Status für Analyse: {risk.status} (erwartet: researched)")
    
    update_and_publish(
        self,
        meta={
            'step': 'analysis',
            'status': 'processing',  # Workflow is processing, DB status is still 'researched'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'analysis'
        }
    )
    
    try:
        analysis_agent = AnalysisAgent(Config.OPENAI_API_KEY)
        risk_description = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR\nVersicherungszeitraum: {risk.start_date} bis {risk.end_date}"
        
        research_data = {
            'current': risk.research_current,
            'historical': risk.research_historical,
            'regulatory': risk.research_regulatory,
            'risk_type': risk.risk_type,
            'initial_prompt': risk_description,
            'start_date': str(risk.start_date),
            'end_date': str(risk.end_date),
            'insurance_value': risk.insurance_value
        }
        
        with perf_timer(f"Analysis Step [{risk_uuid}]"):
            analysis_result = analysis_agent.analyze_risk(risk_description, research_data)
            risk.analysis = analysis_result
            risk.update_status('analyzed')
            # Reflect DB transition to Celery result backend
            update_and_publish(
                self,
                meta={
                    'step': 'analyzed',
                    'status': risk.status,  # Use risk.status as source of truth
                    'risk_uuid': risk_uuid,
                    'user_uuid': user_uuid,
                    'current_agent': 'analysis'
                }
            )
            
            try:
                from models import User
                from app import app
                from email_service import email_service
                user = User.get_by_uuid(user_uuid)
                if user and user.email:
                    email_service.init_app(app)
                    email_sent = email_service.send_analysis_complete_notification(
                        user.email,
                        user.name or '',
                        risk_uuid,
                        user_uuid
                    )
                    if email_sent:
                        logger.info(f"[Workflow {risk_uuid}] Analysis complete notification email sent to {user.email}")
                    else:
                        logger.warning(f"[Workflow {risk_uuid}] Failed to send analysis complete notification email to {user.email}")
                else:
                    logger.warning(f"[Workflow {risk_uuid}] User not found or no email for user_uuid {user_uuid}")
            except Exception as e:
                logger.error(f"[Workflow {risk_uuid}] Error sending analysis complete notification email: {str(e)}")
        
        logger.info(f"[Workflow {risk_uuid}] Analysis complete")
    except Exception as e:
        logger.error(f"[Workflow {risk_uuid}] Analysis failed: {str(e)}")
        try:
            risk.mark_as_failed(str(e))
        except Exception:
            pass
        raise Exception(f"Analyse fehlgeschlagen: {str(e)}")
    
    # Step 5: Report Generation
    logger.info(f"[Workflow {risk_uuid}] Step 5: Report")
    
    if risk.status != 'analyzed':
        raise Exception(f"Ungültiger Status für Berichtserstellung: {risk.status} (erwartet: analyzed)")
    
    update_and_publish(
        self,
        meta={
            'step': 'report',
            'status': 'processing',  # Workflow is processing, DB status is still 'analyzed'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'report'
        }
    )
    
    try:
        with perf_timer(f"Report Step [{risk_uuid}]"):
            report_agent = ReportAgent(Config.OPENAI_API_KEY)
            
            report_data = risk.to_dict()
            report_data['initial_prompt'] = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR"
            
            report = report_agent.generate_report(report_data)
            risk.report = report
            risk.update_status('completed')
            
            risk.clear_processing_lock()
            if risk.retry_count > 0 or risk.failed_at:
                risk.reset_retry_state()
                logger.info(f"[Workflow {risk_uuid}] Workflow completed after {risk.retry_count} retries - retry state reset")
        
        logger.info(f"[Workflow {risk_uuid}] Report complete")
    except Exception as e:
        logger.error(f"[Workflow {risk_uuid}] Report failed: {str(e)}")
        try:
            risk.mark_as_failed(str(e))
        except Exception:
            pass
        raise Exception(f"Berichtserstellung fehlgeschlagen: {str(e)}")
    
    # Workflow complete - send final SUCCESS event
    logger.info(f"[Workflow {risk_uuid}] Workflow complete")
    
    update_and_publish(
        self,
        meta={
            'step': 'completed',
            'status': 'completed',
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid
        }
    )
    
    return {
        'status': 'completed',
        'risk_uuid': risk_uuid,
        'report': report
    }


@celery_app.task(bind=True, name='workflow.resume_after_inquiry')
def resume_workflow_after_inquiry(self, risk_uuid, user_uuid, inquiry_responses):
    """
    Resume workflow after user has answered inquiries
    
    Args:
        self: Celery task instance
        risk_uuid: UUID of risk
        user_uuid: UUID of user
        inquiry_responses: List of inquiry responses
        
    Returns:
        dict: Workflow result
    """
    from models import RiskAssessment, db
    from app import app
    from config import Config
    
    logger.info(f"[Workflow {risk_uuid}] Resuming workflow after inquiry responses")
    
    # Send initial event immediately to show that we're processing the responses
    update_and_publish(
        self,
        meta={
            'step': 'inquired',
            'status': 'inquired',
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'inquiry',
            'message': 'Antworten werden verarbeitet...'
        }
    )
    
    try:
        with app.app_context():
            risk = RiskAssessment.get_by_uuids(user_uuid, risk_uuid)
            if not risk:
                raise Exception('Risk assessment not found')
            
            if risk.status != 'inquiry_awaiting_response':
                raise Exception(f"Ungültiger Status für Workflow-Fortsetzung: {risk.status} (erwartet: inquiry_awaiting_response)")
            
            with perf_timer(f"Save Inquiry Responses [{risk_uuid}]"):
                if not risk.inquiry:
                    raise Exception('No inquiries found to update')
                
                logger.info(f"[Workflow {risk_uuid}] Stored inquiries count: {len(risk.inquiry)}")
                
                logger.info(f"[Workflow {risk_uuid}] Processing inquiry responses - Type: {type(inquiry_responses)}, Length: {len(inquiry_responses) if isinstance(inquiry_responses, list) else 'N/A'}")
                if isinstance(inquiry_responses, list) and len(inquiry_responses) > 0:
                    logger.info(f"[Workflow {risk_uuid}] First response type: {type(inquiry_responses[0])}, Value preview: {str(inquiry_responses[0])[:100]}")
                
                if isinstance(inquiry_responses, list) and len(inquiry_responses) > 0:
                    for i, answer in enumerate(inquiry_responses):
                        if i < len(risk.inquiry):
                            risk.inquiry[i]['response'] = answer.strip() if isinstance(answer, str) else answer
                    if len(inquiry_responses) != len(risk.inquiry):
                        logger.warning(f"[Workflow {risk_uuid}] Inquiry response count mismatch: expected {len(risk.inquiry)}, received {len(inquiry_responses)} - mapping what we received")
                logger.info(f"[Workflow {risk_uuid}] Received responses count: {len(inquiry_responses) if isinstance(inquiry_responses, list) else 'N/A'}")
                # Preview first few mapped Q/A
                try:
                    preview_pairs = []
                    for i, q in enumerate(risk.inquiry[:5]):
                        preview_pairs.append({
                            'i': i,
                            'q': q.get('question', '')[:80],
                            'a': (q.get('response', '') if not isinstance(q.get('response'), str) else q.get('response', '').strip())[:80]
                        })
                    logger.info(f"[Workflow {risk_uuid}] Mapped Q/A preview: {preview_pairs}")
                except Exception as _e:
                    logger.warning(f"[Workflow {risk_uuid}] Failed to build Q/A preview: {_e}")
                
                from sqlalchemy.orm.attributes import flag_modified
                flag_modified(risk, 'inquiry')
                
                db.session.commit()
                risk.update_status('inquired')
                
                # Check if user is logged in before proceeding with analysis
                if is_anonymous_user(user_uuid):
                    logger.warning(f"[Workflow {risk_uuid}] Cannot proceed with analysis - user not logged in (user_uuid: {user_uuid})")
                    update_and_publish(
                        self,
                        meta={
                            'step': 'inquiry_awaiting_response',
                            'status': 'login_required',
                            'risk_uuid': risk_uuid,
                            'user_uuid': user_uuid,
                            'current_agent': 'inquiry',
                            'login_required': True,
                            'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Analyse fortzufahren.'
                        }
                    )
                    return {
                        'status': 'login_required',
                        'risk_uuid': risk_uuid,
                        'user_uuid': user_uuid,
                        'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Analyse fortzufahren.'
                    }
                
                try:
                    is_small_risk = risk.insurance_value is not None and float(risk.insurance_value) <= Config.SMALL_RISK_THRESHOLD_EUR
                except Exception:
                    is_small_risk = False

                if is_small_risk:
                    # Skip research, use combined analysis and report agent
                    logger.info(f"[Workflow {risk_uuid}] Inquiry responses saved - Kleinrisiko: using combined agent")
                    return _continue_from_inquiry_with_combined_agent(self, risk, risk_uuid, user_uuid)
                else:
                    update_and_publish(
                        self,
                        meta={
                            'step': 'inquired',
                            'status': 'inquired',
                            'risk_uuid': risk_uuid,
                            'user_uuid': user_uuid,
                            'current_agent': 'inquiry'
                        }
                    )
                    logger.info(f"[Workflow {risk_uuid}] Inquiry responses saved, continuing workflow")
                    return _continue_workflow_after_inquiry(self, risk, risk_uuid, user_uuid)
            
    except Exception as e:
        error_message = str(e)
        if hasattr(e, '__class__'):
            error_type = e.__class__.__name__
            logger.error(f"[Workflow {risk_uuid}] Resume failed: {error_type}: {error_message}")
        else:
            logger.error(f"[Workflow {risk_uuid}] Resume failed: {error_message}")
            
        update_and_publish(
            self,
            meta={
                'step': 'error',
                'status': 'processing',  # Still processing despite error
                'error': True,
                'error_type': type(e).__name__ if e is not None else 'Unknown',
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid
            }
        )
        raise



@celery_app.task(bind=True, name='workflow.resume_from_current_status')
def resume_from_current_status(self, risk_uuid, user_uuid):
    """
    Resume workflow from the current DB status without requiring inquiry responses.
    Supports continuing from 'researched' (runs analysis+report) and 'analyzed' (runs report).
    """
    from models import RiskAssessment, db
    from app import app
    logger.info(f"[Workflow {risk_uuid}] Resume from current status requested (user_uuid: {user_uuid})")
    try:
        with app.app_context():
            # Try to find risk with provided user_uuid first
            risk = RiskAssessment.get_by_uuids(user_uuid, risk_uuid)
            
            # If not found and user_uuid is not DEFAULT_ANONYMOUS_USER_UUID, try with DEFAULT_ANONYMOUS_USER_UUID
            # This handles the case where risk-user updated the risk but the task was started with old user_uuid
            # We only search with DEFAULT_ANONYMOUS_USER_UUID to avoid accessing risks of other users
            if not risk and user_uuid != DEFAULT_ANONYMOUS_USER_UUID:
                logger.info(f"[Workflow {risk_uuid}] Risk not found with user_uuid {user_uuid}, trying with DEFAULT_ANONYMOUS_USER_UUID")
                risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
                if risk:
                    logger.info(f"[Workflow {risk_uuid}] Found risk with DEFAULT_ANONYMOUS_USER_UUID (was updated from anonymous to {user_uuid})")
            
            if not risk:
                raise Exception('Risk assessment not found')

            # Use the user_uuid from the risk assessment (which may have been updated)
            # This ensures we use the correct user_uuid after risk-user
            actual_user_uuid = risk.user_uuid
            
            # Use the user_uuid from the risk assessment (which may have been updated)
            # This ensures we use the correct user_uuid after risk-user
            actual_user_uuid = risk.user_uuid

            # Branch by current status - the continuation functions will set the correct step
            if risk.status == 'classified':
                return _continue_from_classified(self, risk, risk_uuid, actual_user_uuid)
            elif risk.status == 'inquiry_awaiting_response':
                # Check if inquiries are already answered - if so, treat as 'inquired'
                if are_all_inquiries_answered(risk):
                    # All inquiries answered, update status and continue
                    risk.update_status('inquired')
                    db.session.commit()
                    return _continue_workflow_after_inquiry(self, risk, risk_uuid, actual_user_uuid)
                else:
                    # Still waiting for responses, return inquiry required
                    update_and_publish(
                        self,
                        meta={
                            'step': 'inquiry_awaiting_response',
                            'status': 'inquiry_awaiting_response',
                            'inquiries': risk.inquiry,
                            'risk_uuid': risk_uuid,
                            'user_uuid': actual_user_uuid,
                            'current_agent': 'inquiry'
                        }
                    )
                    return {
                        'status': 'inquiry_required',
                        'inquiries': risk.inquiry,
                        'risk_uuid': risk_uuid,
                        'user_uuid': actual_user_uuid
                    }
            elif risk.status == 'inquired':
                return _continue_workflow_after_inquiry(self, risk, risk_uuid, actual_user_uuid)
            elif risk.status == 'researched':
                return _continue_from_researched(self, risk, risk_uuid, actual_user_uuid)
            elif risk.status == 'analyzed':
                return _continue_from_analyzed(self, risk, risk_uuid, actual_user_uuid)
            elif risk.status == 'completed':
                update_and_publish(
                    self,
                    meta={
                        'step': 'completed',
                        'status': 'completed',
                        'risk_uuid': risk_uuid,
                        'user_uuid': actual_user_uuid
                    }
                )
                return {'status': 'completed', 'risk_uuid': risk_uuid}
            else:
                raise Exception(f"Fortsetzung aus Status {risk.status} nicht unterstützt")
    except Exception as e:
        update_and_publish(
            self,
            meta={
                'step': 'error',
                'status': 'failed',
                'error': True,
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid
            }
        )
        raise


def _continue_from_researched(self, risk, risk_uuid, user_uuid):
    """Continue with analysis and report when status is 'researched'."""
    from agents import AnalysisAgent, ReportAgent
    from config import Config
    if risk.status != 'researched':
        raise Exception(f"Ungültiger Status für Analyse: {risk.status} (erwartet: researched)")

    update_and_publish(
        self,
        meta={
            'step': 'analysis',
            'status': 'processing',  # Workflow is processing, DB status is still 'researched'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'analysis'
        }
    )

    # Analysis
    analysis_agent = AnalysisAgent(Config.OPENAI_API_KEY)
    risk_description = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR\nVersicherungszeitraum: {risk.start_date} bis {risk.end_date}"
    research_data = {
        'current': risk.research_current,
        'historical': risk.research_historical,
        'regulatory': risk.research_regulatory,
        'risk_type': risk.risk_type,
        'initial_prompt': risk_description,
        'start_date': str(risk.start_date),
        'end_date': str(risk.end_date),
        'insurance_value': risk.insurance_value
    }
    with perf_timer(f"Analysis Step [{risk_uuid}]"):
        analysis_result = analysis_agent.analyze_risk(risk_description, research_data)
        risk.analysis = analysis_result
        risk.update_status('analyzed')
        update_and_publish(
            self,
            meta={
                'step': 'analyzed',
                'status': risk.status,  # Use risk.status as source of truth
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid,
                'current_agent': 'analysis'
            }
        )

    return _continue_from_analyzed(self, risk, risk_uuid, user_uuid)


def _continue_from_analyzed(self, risk, risk_uuid, user_uuid):
    """Continue with report when status is 'analyzed'."""
    from agents import ReportAgent
    from config import Config
    if risk.status != 'analyzed':
        raise Exception(f"Ungültiger Status für Berichtserstellung: {risk.status} (erwartet: analyzed)")

    update_and_publish(
        self,
        meta={
            'step': 'report',
            'status': 'processing',  # Workflow is processing, DB status is still 'analyzed'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'report'
        }
    )

    with perf_timer(f"Report Step [{risk_uuid}]"):
        report_agent = ReportAgent(Config.OPENAI_API_KEY)
        report_data = risk.to_dict()
        report_data['initial_prompt'] = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR"
        report = report_agent.generate_report(report_data)
        risk.report = report
        risk.update_status('completed')

    update_and_publish(
        self,
        meta={
            'step': 'completed',
            'status': 'completed',
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid
        }
    )
    return {'status': 'completed', 'risk_uuid': risk_uuid, 'report': report}


def _continue_from_inquiry_with_combined_agent(self, risk, risk_uuid, user_uuid):
    """Continue with combined analysis and report for small risks (threshold configurable via Config.SMALL_RISK_THRESHOLD_EUR) after inquiry."""
    # Check if user is logged in before proceeding with combined analysis
    if is_anonymous_user(user_uuid):
        logger.warning(f"[Workflow {risk_uuid}] Cannot proceed with combined analysis - user not logged in (user_uuid: {user_uuid})")
        update_and_publish(
            self,
            meta={
                'step': 'inquired',
                'status': 'login_required',
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid,
                'current_agent': 'inquiry',
                'login_required': True,
                'kleinrisiko': True,
                'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Analyse fortzufahren.'
            }
        )
        return {
            'status': 'login_required',
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'message': 'Bitte loggen Sie sich ein oder registrieren Sie sich, um mit der Analyse fortzufahren.'
        }
    
    from agents import CombinedAnalysisReportAgent
    from config import Config
    
    if risk.status not in ('inquired', 'researched'):
        raise Exception(f"Ungültiger Status für kombinierte Analyse/Bericht: {risk.status} (erwartet: inquired oder researched)")
    
    logger.info(f"[Workflow {risk_uuid}] Using combined analysis and report agent for small risk")
    
    update_and_publish(
        self,
        meta={
            'step': 'combined_analysis_report',
            'status': 'processing',  # Workflow is processing, DB status is still 'inquired'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'combined_analysis_report',
            'kleinrisiko': True
        }
    )
    
    try:
        combined_agent = CombinedAnalysisReportAgent(Config.OPENAI_API_KEY)
        risk_description = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR\nVersicherungszeitraum: {risk.start_date} bis {risk.end_date}"
        
        risk_data = {
            'risk_type': risk.risk_type,
            'initial_prompt': risk_description,
            'insurance_value': risk.insurance_value,
            'start_date': str(risk.start_date) if risk.start_date else None,
            'end_date': str(risk.end_date) if risk.end_date else None
        }
        
        answered_inquiries = get_answered_inquiries(risk)
        if answered_inquiries:
            inquiry_text = " ".join([f"Q: {q.get('question', '')} A: {q.get('response', '')}" 
                                   for q in answered_inquiries])
            risk_data['inquiry_responses'] = inquiry_text
        
        risk_data['research_current'] = risk.research_current or {}
        risk_data['research_historical'] = risk.research_historical or {}
        risk_data['research_regulatory'] = risk.research_regulatory or {}
        
        combined_result = None
        with perf_timer(f"Combined Analysis & Report Step [{risk_uuid}]"):
            combined_result = combined_agent.analyze_and_report(risk_description, risk_data)
            
            # Extract analysis and report from combined result
            # The combined result contains both analysis and report components
            # The structure is now simplified (no "Analyse-Zusammenfassung" wrapper)
            if 'analysis' in combined_result:
                risk.analysis = combined_result.get('analysis', {})
            else:
                # Fallback: extract directly from result (simplified structure)
                risk.analysis = {
                    'probability_percentage': combined_result.get('probability_percentage', 0),
                    'average_damage_per_event': combined_result.get('average_damage_per_event', 0),
                    'expected_damage': combined_result.get('expected_damage', 0),
                    'expected_damage_standard_deviation': combined_result.get('expected_damage_standard_deviation', 0),
                    'max_damage_pml': combined_result.get('max_damage_pml', 0),
                    'risk_assessment_percentage': combined_result.get('acceptance_risk_percentage', 50)
                }
                # Include title and summary if present
                if 'title' in combined_result:
                    risk.analysis['title'] = combined_result.get('title')
                if 'summary' in combined_result:
                    risk.analysis['summary'] = combined_result.get('summary')
            
            # Store the full report (which includes analysis summary)
            risk.report = combined_result
            risk.update_status('analyzed')
            
            update_and_publish(
                self,
                meta={
                    'step': 'combined_analyzed',
                    'status': 'analyzed',  # Combined analysis completed
                    'risk_uuid': risk_uuid,
                    'user_uuid': user_uuid,
                    'current_agent': 'combined_analysis_report',
                    'kleinrisiko': True,
                    'status': risk.status  # Use risk.status as source of truth
                }
            )
            
            # Mark as completed
            risk.update_status('completed')
            
            risk.clear_processing_lock()
            if risk.retry_count > 0 or risk.failed_at:
                risk.reset_retry_state()
                logger.info(f"[Workflow {risk_uuid}] Workflow completed after {risk.retry_count} retries - retry state reset")
            
            logger.info(f"[Workflow {risk_uuid}] Combined analysis and report complete")
            
    except Exception as e:
        logger.error(f"[Workflow {risk_uuid}] Combined analysis and report failed: {str(e)}")
        try:
            risk.mark_as_failed(str(e))
        except Exception:
            pass
        raise Exception(f"Kombinierte Analyse/Bericht fehlgeschlagen: {str(e)}")
    
    # Workflow complete - send final SUCCESS event
    logger.info(f"[Workflow {risk_uuid}] Workflow complete (small risk)")
    
    update_and_publish(
        self,
        meta={
            'step': 'completed',
            'status': 'completed',
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'kleinrisiko': True
        }
    )
    
    return {
        'status': 'completed',
        'risk_uuid': risk_uuid,
        'report': combined_result
    }


def _continue_from_classified(self, risk, risk_uuid, user_uuid):
    """Continue with inquiry generation when status is 'classified'."""
    try:
        from agents import InquiryAgent
    except ImportError as e:
        raise Exception(f"Agent import failed: {str(e)}")
    from config import Config

    if risk.status != 'classified':
        raise Exception(f"Ungültiger Status für Rückfragen: {risk.status} (erwartet: classified)")

    update_and_publish(
        self,
        meta={
            'step': 'inquiry',
            'status': 'processing',  # Workflow is processing, DB status is still 'classified'
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid,
            'current_agent': 'inquiry'
        }
    )

    risk_description = f"{risk.initial_prompt}\n\nVersicherungswert: {risk.insurance_value:,.2f} EUR"
    inquiry_agent = InquiryAgent(Config.OPENAI_API_KEY)
    inquiries = inquiry_agent.generate_inquiries(risk_description)

    if inquiries and len(inquiries) > 0:
        inquiry_data = [{'question': q, 'response': None} for q in inquiries]
        risk.inquiry = inquiry_data
        db.session.commit()
        risk.update_status('inquiry_awaiting_response')

        update_and_publish(
            self,
            meta={
                'step': 'inquiry_awaiting_response',
                'status': 'inquiry_awaiting_response',
                'inquiries': inquiry_data,
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid,
                'current_agent': 'inquiry'
            }
        )
        return {
            'status': 'inquiry_required',
            'inquiries': inquiry_data,
            'risk_uuid': risk_uuid,
            'user_uuid': user_uuid
        }
    else:
        # No inquiries: mark as inquired and continue
        risk.update_status('inquired')
        update_and_publish(
            self,
            meta={
                'step': 'inquired',
                'status': risk.status,  # Use risk.status as source of truth
                'risk_uuid': risk_uuid,
                'user_uuid': user_uuid,
                'current_agent': 'inquiry'
            }
        )
        return _continue_workflow_after_inquiry(self, risk, risk_uuid, user_uuid)