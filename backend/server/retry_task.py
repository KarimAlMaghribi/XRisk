"""
xrisk - Automatic Retry Task
Author: Manuel Schott

Celery Beat task that runs periodically to retry failed workflows
"""

from celery_app import celery_app
from datetime import datetime, timezone
import logging

logger = logging.getLogger('celery')


@celery_app.task(name='workflow.retry_failed_workflows')
def retry_failed_workflows():
    """
    Periodic task that retries failed workflows
    Runs periodically based on RETRY_CHECK_INTERVAL (default: 5 minutes)
    
    - Finds failed workflows older than RETRY_MIN_AGE
    - Excludes workflows waiting for user input (status='inquiry_awaiting_response')
    - Retries up to RETRY_MAX_ATTEMPTS times
    - Sends admin email after max retries reached
    """
    from models import RiskAssessment, db
    from app import app
    from workflow_task import execute_risk_workflow
    from config import Config
    import os
    
    logger.info("[Retry Task] Starting periodic retry check...")
    logger.info(f"[Retry Task] Config - Max Attempts: {Config.RETRY_MAX_ATTEMPTS}")
    
    try:
        with app.app_context():
            # 1) Resume stalled workflows that should auto-continue (inquired/researched/analyzed, not processing, not failed)
            from models import RiskAssessment
            stalled_risks = RiskAssessment.query.filter(
                RiskAssessment.status.in_(['inquired', 'researched', 'analyzed']),
                RiskAssessment.processing_since.is_(None),
                RiskAssessment.failed_at.is_(None)
            ).all()
            if stalled_risks:
                logger.info(f"[Retry Task] Found {len(stalled_risks)} stalled workflows to auto-continue")
                from workflow_task import resume_from_current_status
                queue_name = 'celery'
                for risk in stalled_risks:
                    logger.info(f"[Retry Task] Auto-continuing stalled workflow {risk.risk_uuid} from {risk.status}")
                    task = resume_from_current_status.apply_async(
                        args=[risk.risk_uuid, risk.user_uuid],
                        task_id=f"workflow_resume_{risk.risk_uuid}",
                        queue=queue_name
                    )
                    logger.info(f"[Retry Task] Resume task queued: {task.id}")

            # 2) Start validated-but-not-started risks automatically
            validated_risks = RiskAssessment.query.filter(
                RiskAssessment.status == 'validated',
                RiskAssessment.processing_since.is_(None),
                RiskAssessment.failed_at.is_(None)
            ).all()
            if validated_risks:
                logger.info(f"[Retry Task] Found {len(validated_risks)} validated risks to start")
                from workflow_task import execute_risk_workflow
                queue_name = 'celery'
                for risk in validated_risks:
                    logger.info(f"[Retry Task] Starting workflow for validated risk {risk.risk_uuid}")
                    task = execute_risk_workflow.apply_async(
                        args=[risk.risk_uuid, risk.user_uuid],
                        task_id=f"workflow_{risk.risk_uuid}",
                        queue=queue_name
                    )
                    logger.info(f"[Retry Task] Started task: {task.id}")

            # 3) Find all failed risks that can be retried
            failed_risks = RiskAssessment.get_failed_risks(
                max_retries=Config.RETRY_MAX_ATTEMPTS
            )
            
            logger.info(f"[Retry Task] Found {len(failed_risks)} failed workflows eligible for retry")
            
            for risk in failed_risks:
                # Check if workflow is already processing (automatic retry might be running)
                if risk.processing_since:
                    elapsed = risk.get_processing_elapsed_seconds()
                    logger.info(f"[Retry Task] Skipping {risk.risk_uuid} - already processing for {elapsed}s")
                    continue
                
                # Ensure timezone-aware arithmetic: treat DB-stored naive datetimes as UTC
                failed_at = risk.failed_at
                if failed_at is None:
                    # Shouldn't happen for failed risks, but guard anyway
                    logger.warning(f"[Retry Task] Risk {risk.risk_uuid} has no failed_at; skipping")
                    continue
                if failed_at.tzinfo is None:
                    failed_at = failed_at.replace(tzinfo=timezone.utc)
                failed_age = int((datetime.now(timezone.utc) - failed_at).total_seconds())
                logger.info(f"[Retry Task] Processing risk {risk.risk_uuid} - Retry {risk.retry_count + 1}/{Config.RETRY_MAX_ATTEMPTS}, Failed {failed_age}s ago, Status: {risk.status}")
                
                # Check if max retries reached
                if risk.retry_count >= Config.RETRY_MAX_ATTEMPTS:
                    logger.warning(f"[Retry Task] Risk {risk.risk_uuid} exceeded max retries ({Config.RETRY_MAX_ATTEMPTS}), sending admin notification")
                    send_admin_notification(risk)
                    risk.admin_notified = True
                    db.session.commit()
                    continue
                
                # Double-check: Don't retry inquiry status (should already be filtered by query)
                if risk.status == 'inquiry_awaiting_response':
                    logger.info(f"[Retry Task] Skipping {risk.risk_uuid} - waiting for user inquiry response")
                    continue
                
                # Increment retry counter
                risk.increment_retry()
                
                # Determine queue
                queue_name = 'celery'
                
                # Restart workflow from current status
                logger.info(f"[Retry Task] Restarting workflow for {risk.risk_uuid} from status {risk.status}")
                
                # Clear failed status
                risk.clear_failed_status()
                
                # Start new workflow task
                task = execute_risk_workflow.apply_async(
                    args=[risk.risk_uuid, risk.user_uuid],
                    task_id=f"workflow_retry_{risk.risk_uuid}_{risk.retry_count}",
                    queue=queue_name
                )
                
                logger.info(f"[Retry Task] Workflow restarted: {task.id} on queue {queue_name}")
            
            logger.info(f"[Retry Task] Retry check complete - processed {len(failed_risks)} failed, {len(stalled_risks)} stalled, {len(validated_risks)} validated risks")
            
    except Exception as e:
        logger.error(f"[Retry Task] Error during retry check: {str(e)}")
        import traceback
        logger.error(f"[Retry Task] Traceback: {traceback.format_exc()}")


def send_admin_notification(risk):
    """
    Send email notification to admins when workflow fails after max retries
    
    Args:
        risk: RiskAssessment instance
    """
    from config import Config
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    logger.info(f"[Admin Notification] Sending email for risk {risk.risk_uuid}")
    
    # Get admin email from config
    admin_email = Config.ADMIN_EMAIL
    
    if not admin_email:
        logger.warning("[Admin Notification] No ADMIN_EMAIL configured, skipping email")
        return
    
    # Prepare email
    subject = f"xrisk: Workflow Failed After Max Retries - {risk.risk_uuid}"
    
    body = f"""
xrisk Workflow Alert

Ein Workflow konnte nach {risk.retry_count} Versuchen nicht erfolgreich abgeschlossen werden.

Risk Details:
- Risk UUID: {risk.risk_uuid}
- User UUID: {risk.user_uuid}
- Status: {risk.status}
- Retry Count: {risk.retry_count}
- Failed At: {risk.failed_at.strftime('%Y-%m-%d %H:%M:%S UTC') if risk.failed_at else 'N/A'}
- Failed Reason: {risk.failed_reason}

Risk Description:
{risk.initial_prompt[:500]}...

Action Required:
1. Check logs for detailed error information
2. Review risk configuration and OpenAI API status
3. Manually restart workflow if appropriate
4. Contact development team if issue persists

Logs: Check /app/logs/app.log in container

This is an automated message from xrisk Application.
    """
    
    try:
        # Check if SMTP is configured
        smtp_server = Config.SMTP_SERVER
        smtp_port = Config.SMTP_PORT
        smtp_user = Config.SMTP_USER
        smtp_password = Config.SMTP_PASSWORD
        
        if not all([smtp_server, smtp_user, smtp_password]):
            logger.warning(f"[Admin Notification] SMTP not fully configured - logging only")
            logger.warning(f"[Admin Notification] EMAIL WOULD BE SENT TO: {admin_email}")
            logger.warning(f"[Admin Notification] Subject: {subject}")
            logger.warning(f"[Admin Notification] Body: {body[:200]}...")
            return
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = admin_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email via SMTP
        logger.info(f"[Admin Notification] Connecting to SMTP server {smtp_server}:{smtp_port}")
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Enable TLS encryption
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        logger.info(f"[Admin Notification] Email sent successfully to {admin_email}")
        
    except Exception as e:
        logger.error(f"[Admin Notification] Failed to send email: {str(e)}")
        logger.error(f"[Admin Notification] Email content was: Subject: {subject}")

