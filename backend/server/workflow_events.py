"""
xrisk - Workflow Event Streaming
Author: Manuel Schott

Server-Sent Events (SSE) mit Redis Pub/Sub für Echtzeit-Updates
Nutzt Redis Pub/Sub für Push-Benachrichtigungen
"""

from flask import Blueprint, Response, stream_with_context, request
from flask_login import current_user
from celery.result import AsyncResult
from celery_app import celery_app
from config import Config
from models import RiskAssessment
from workflow_task import DEFAULT_ANONYMOUS_USER_UUID
import redis
import json
import logging
import time

logger = logging.getLogger('application')

workflow_events_bp = Blueprint('workflow_events', __name__, url_prefix='/workflow')


def safe_json_serialize(obj):
    """
    Safely serialize objects to JSON, handling non-serializable objects
    
    Args:
        obj: Object to serialize
        
    Returns:
        JSON serializable object
    """
    if obj is None:
        return None
    
    try:
        json.dumps(obj)
        return obj
    except (TypeError, ValueError):
        if hasattr(obj, '__dict__'):
            return str(obj)
        else:
            return str(obj)


def get_redis_client():
    """
    Create Redis client with SSL support if needed
    
    Returns:
        redis.Redis: Redis client
    """
    import ssl
    
    if Config.REDIS_URL.startswith('rediss://'):
        return redis.from_url(
            Config.REDIS_URL,
            ssl_cert_reqs=ssl.CERT_NONE,
            decode_responses=True
        )
    else:
        return redis.from_url(
            Config.REDIS_URL,
            decode_responses=True
        )


@workflow_events_bp.route('/stream/<task_id>', methods=['GET'])
def stream_workflow_updates(task_id):
    """
    Server-Sent Events (SSE) endpoint for real-time workflow updates
    ---
    tags:
      - Workflow
    summary: Server-Sent Events Stream für Echtzeit-Updates
    description: |
      Bietet einen Server-Sent Events (SSE) Stream für Echtzeit-Updates eines Workflows.
      Nutzt Redis Pub/Sub für echte Push-Benachrichtigungen.
      
      **Client-Verwendung:**
      ```javascript
      const eventSource = new EventSource('/workflow/stream/TASK_ID');
      eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Update:', data);
      };
      ```
    produces:
      - text/event-stream
    parameters:
      - in: path
        name: task_id
        type: string
        required: true
        description: Celery Task ID
        example: "workflow_abcdef01-2345-4678-9abc-def012345678"
    responses:
      200:
        description: SSE Stream wird geöffnet
        schema:
          type: string
          description: Server-Sent Events Stream
          example: |
            data: {"connected": true, "task_id": "workflow_abc123"}
            
    """
    def generate():
        """Generator function for SSE stream with Redis Pub/Sub"""
        
        logger.info(f"[SSE] Starting event stream for task {task_id}")
        
        redis_client = get_redis_client()
        pubsub = redis_client.pubsub()
        
        channel = f"workflow:{task_id}"
        pubsub.subscribe(channel)
        
        logger.info(f"[SSE] Subscribed to Redis channel: {channel}")
        
        try:
            yield f"data: {json.dumps({'connected': True, 'task_id': task_id})}\n\n"
            
            task = AsyncResult(task_id, app=celery_app)

            try:
                task_state = task.state
            except Exception as e:
                err_type = type(e).__name__ if hasattr(e, '__class__') else 'Unknown'
                logger.warning(f"[SSE] Failed to read task.state for {task_id}: {err_type}: {e}")
                status = 'pending'
                task_info = {'step': 'pending', 'message': 'Workflow startet...', 'status': 'pending'}
            else:
                task_info = None
                if task_state in ('PROGRESS', 'INQUIRY_REQUIRED', 'LOGIN_REQUIRED', 'SUCCESS', 'FAILURE'):
                    try:
                        task_info = safe_json_serialize(task.info)
                        if not isinstance(task_info, dict):
                            task_info = {}
                    except Exception as e:
                        err_type = type(e).__name__ if hasattr(e, '__class__') else 'Unknown'
                        logger.warning(f"[SSE] Failed to read task.info for {task_id}: {err_type}: {e}")
                        task_info = {
                            'step': 'unknown',
                            'message': 'Statusdaten momentan nicht verfügbar',
                            'error': True,
                            'error_type': err_type,
                            'status': 'pending'
                        }
                
                # Determine status from meta.status if available, otherwise derive from task_state and meta
                if task_info and isinstance(task_info, dict) and 'status' in task_info:
                    status = task_info['status']
                else:
                    # Derive status from task_state and meta information
                    # If we have step/agent info, we can infer the status
                    if task_info and isinstance(task_info, dict):
                        # Check if inquiries are present - means inquiry_required
                        if task_info.get('inquiries') or task_info.get('step') == 'inquiry_awaiting_response':
                            status = 'inquiry_required'
                        # Check if login_required flag is set
                        elif task_info.get('login_required'):
                            status = 'login_required'
                        # Otherwise, derive from task_state (but skip generic 'progress')
                        else:
                            state_to_status = {
                                'PENDING': 'pending',
                                'INQUIRY_REQUIRED': 'inquiry_required',
                                'LOGIN_REQUIRED': 'login_required',
                                'SUCCESS': 'completed',
                                'FAILURE': 'failed'
                            }
                            # For PROGRESS state, use the step/agent to determine actual status
                            if task_state == 'PROGRESS':
                                # Use step name as status if available, but don't use DB statuses like 'inquired' as step status
                                step = task_info.get('step', 'pending')
                                # Valid step statuses (not DB statuses)
                                valid_step_statuses = ('pending', 'inquiry_required', 'login_required', 'completed', 'failed', 'research', 'analysis', 'report', 'resume')
                                if step in valid_step_statuses:
                                    status = step
                                else:
                                    # If step is a DB status like 'inquired', 'researched', 'analyzed', use 'pending' and let meta.step handle it
                                    status = 'pending'
                            else:
                                status = state_to_status.get(task_state, 'pending')
                    else:
                        # No task_info, use task_state mapping
                        state_to_status = {
                            'PENDING': 'pending',
                            'INQUIRY_REQUIRED': 'inquiry_required',
                            'LOGIN_REQUIRED': 'login_required',
                            'SUCCESS': 'completed',
                            'FAILURE': 'failed'
                        }
                        status = state_to_status.get(task_state, 'pending')
                    
                    if not task_info:
                        task_info = {}
                    task_info['status'] = status

            # Special handling: if status was login_required but user is now logged in, use actual risk status
            if status == 'login_required' and current_user.is_authenticated:
                risk_uuid = task_info.get('risk_uuid') if isinstance(task_info, dict) else None
                if not risk_uuid and isinstance(task.result, dict):
                    risk_uuid = task.result.get('risk_uuid')
                
                if risk_uuid:
                    try:
                        risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
                        if not risk:
                            risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
                        
                        if risk:
                            logger.info(f"[SSE] Task {task_id} has login_required but user is now logged in. Using risk status: {risk.status}")
                            
                            # Use risk.status directly - it already represents the workflow state
                            task_info = {
                                'risk_uuid': risk_uuid,
                                'user_uuid': risk.user_uuid,
                                'status': risk.status
                            }
                            
                            # Add inquiries if needed
                            if risk.status == 'inquiry_awaiting_response' and risk.inquiry:
                                task_info['inquiries'] = risk.inquiry
                            
                            # Update status from task_info
                            status = task_info['status']
                    except Exception as e:
                        logger.error(f"[SSE] Error checking risk status for login_required task: {str(e)}")

            initial_data = {
                'task_id': task_id,
                'status': status,
                'meta': task_info if task_info else {'step': 'pending', 'message': 'Workflow startet...', 'status': 'pending'}
            }
            yield f"data: {json.dumps(initial_data)}\n\n"
            
            last_heartbeat = time.time()
            heartbeat_interval = 25
            while True:
                message = pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                now = time.time()
                if message and message.get('type') == 'message':
                    try:
                        event_data = json.loads(message['data'])
                        event_data = safe_json_serialize(event_data)
                        # Ensure status field exists (might be 'state' in old format)
                        if 'status' not in event_data and 'state' in event_data:
                            # Convert old 'state' to 'status'
                            # For PROGRESS state, use step/agent info instead of generic 'progress'
                            old_state = event_data['state']
                            if old_state == 'PROGRESS':
                                # Use step name as status if available
                                meta = event_data.get('meta', {})
                                if isinstance(meta, dict):
                                    if meta.get('inquiries') or meta.get('step') == 'inquiry_awaiting_response':
                                        event_data['status'] = 'inquiry_required'
                                    elif meta.get('login_required'):
                                        event_data['status'] = 'login_required'
                                    else:
                                        step = meta.get('step', 'pending')
                                        event_data['status'] = step if step in ('pending', 'inquiry_required', 'login_required', 'completed', 'failed') else 'pending'
                                else:
                                    event_data['status'] = 'pending'
                            else:
                                state_to_status = {
                                    'PENDING': 'pending',
                                    'INQUIRY_REQUIRED': 'inquiry_required',
                                    'LOGIN_REQUIRED': 'login_required',
                                    'SUCCESS': 'completed',
                                    'FAILURE': 'failed'
                                }
                                event_data['status'] = state_to_status.get(old_state, 'pending')
                            # Remove old state field
                            event_data.pop('state', None)
                        
                        # Check if event has login_required status but user is now logged in
                        event_status = event_data.get('status') or (event_data.get('meta', {}).get('status') if isinstance(event_data.get('meta'), dict) else None)
                        if event_status == 'login_required' and current_user.is_authenticated:
                            risk_uuid = event_data.get('risk_uuid') or (event_data.get('meta', {}).get('risk_uuid') if isinstance(event_data.get('meta'), dict) else None)
                            if risk_uuid:
                                try:
                                    risk = RiskAssessment.get_by_uuids(current_user.user_uuid, risk_uuid)
                                    if not risk:
                                        risk = RiskAssessment.get_by_uuids(DEFAULT_ANONYMOUS_USER_UUID, risk_uuid)
                                    
                                    if risk:
                                        logger.info(f"[SSE] Event has login_required but user is logged in. Using risk status: {risk.status}")
                                        # Update event_data with actual risk status
                                        if 'meta' not in event_data:
                                            event_data['meta'] = {}
                                        event_data['meta']['status'] = risk.status
                                        event_data['status'] = risk.status
                                        # Remove login_required flag
                                        event_data['meta'].pop('login_required', None)
                                        event_data.pop('login_required', None)
                                except Exception as e:
                                    logger.error(f"[SSE] Error checking risk status in event: {str(e)}")
                        
                        logger.info(f"[SSE] Received event: {event_data.get('status')} - {event_data.get('meta', {}).get('message', '')}")
                        yield f"data: {json.dumps(event_data)}\n\n"
                        last_heartbeat = now
                        if event_data.get('status') in ['completed', 'failed']:
                            logger.info(f"[SSE] Task finished, closing stream")
                            break
                    except json.JSONDecodeError as e:
                        logger.error(f"[SSE] Failed to parse event data: {e}")
                        continue
                if now - last_heartbeat >= heartbeat_interval:
                    try:
                        yield ": ping\n\n"
                        last_heartbeat = now
                    except Exception:
                        break
                        
        except Exception as e:
            import traceback
            exc_type = type(e).__name__ if hasattr(e, '__class__') else 'Unknown'
            error_message = f"[{exc_type}] {str(e)}\n{traceback.format_exc()}"
            logger.error(f"[SSE] Error in event stream: {error_message}")

            error_data = safe_json_serialize({
                'error': True,
                'message': error_message,
                'error_type': exc_type
            })
            yield f"data: {json.dumps(error_data)}\n\n"
        finally:
            pubsub.unsubscribe(channel)
            pubsub.close()
            redis_client.close()
            logger.info(f"[SSE] Closed Redis connection for task {task_id}")
        
        yield f"data: {json.dumps({'stream_closed': True})}\n\n"
    
    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive'
        }
    )


@workflow_events_bp.route('/events-test', methods=['GET'])
def test_sse():
    """
    Test endpoint for SSE functionality
    Sends test events every second
    """
    def generate():
        for i in range(10):
            data = {
                'test': True,
                'count': i,
                'timestamp': time.time()
            }
            yield f"data: {json.dumps(data)}\n\n"
            time.sleep(1)
        
        yield f"data: {json.dumps({'done': True})}\n\n"
    
    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive'
        }
    )

