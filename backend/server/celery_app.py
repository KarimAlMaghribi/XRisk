"""
xrisk - Celery Application
Author: Manuel Schott

Celery configuration and app initialization for async workflow orchestration
"""

import os
import sys
from celery import Celery
from dotenv import load_dotenv
import logging

# Load environment variables from .env and .env.local files as early as possible
load_dotenv()  # Load .env first

# Load .env.local if it exists (for local development)
if os.path.exists('.env.local'):
    load_dotenv('.env.local')

from config import Config
from logging_config import create_rotating_file_handler

logger = logging.getLogger('celery')

# Konfiguriere Celery-spezifisches Logging
def setup_celery_logging():
    """Setup Celery-specific logging configuration"""
    log_dir = os.environ.get('LOG_DIR')
    
    # Verhindere Propagation zum celery.redirected Logger (verhindert doppelte Logs)
    logger.propagate = False
    
    # Konfiguriere celery.redirected Logger, um WARNINGs zu vermeiden
    redirected_logger = logging.getLogger('celery.redirected')
    redirected_logger.setLevel(logging.CRITICAL)  # Deaktiviere celery.redirected Logging
    redirected_logger.propagate = False
    
    if log_dir:
        try:
            os.makedirs(log_dir, exist_ok=True)
            
            # Celery Logger (für alle Celery-Komponenten)
            celery_log_file = os.path.join(log_dir, 'celery.log')
            celery_file_handler = create_rotating_file_handler(celery_log_file)
            logger.addHandler(celery_file_handler)
            logger.info(f"Celery logging configured with daily rotation: {celery_log_file}")
            
        except Exception as e:
            logger.error(f"Failed to setup Celery logging: {e}")
    else:
        logger.warning("LOG_DIR not set, Celery file logging disabled")

# Spiegel Application-Logger (für PERF-Logs) in Worker-Prozess
def setup_application_logging_mirror():
    """Ensure 'application' logger writes to app.log in Celery worker too."""
    app_logger = logging.getLogger('application')
    app_logger.setLevel(logging.INFO)
    app_logger.propagate = False  # Verhindere Propagation zum celery.redirected Logger

    # Avoid duplicate handlers on hot-reload
    if not app_logger.handlers:
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        # Console handler (stdout)
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        app_logger.addHandler(console_handler)

        # Optional file handler
        log_dir = os.environ.get('LOG_DIR')
        if log_dir:
            try:
                os.makedirs(log_dir, exist_ok=True)
                app_log_file = os.path.join(log_dir, 'app.log')
                file_handler = create_rotating_file_handler(app_log_file, formatter=formatter)
                app_logger.addHandler(file_handler)
                app_logger.info(f"Celery worker mirrors application logs with daily rotation to: {app_log_file}")
            except Exception as e:
                logger.error(f"Failed to setup application log mirror: {e}")
        app_logger.propagate = False
        
    # Stelle sicher, dass auch andere Logger nicht propagieren
    # (wichtig für Logger, die in Celery-Worker-Prozessen verwendet werden)
    for logger_name in ['mcp_server', 'OpenAI_API', 'config']:
        other_logger = logging.getLogger(logger_name)
        other_logger.propagate = False

# Setup Celery logging
setup_celery_logging()
setup_application_logging_mirror()

def make_celery():
    """
    Create and configure Celery app
    
    Returns:
        Celery: Configured Celery application
    """
    import ssl
    
    broker_url = Config.CELERY_BROKER_URL
    backend_url = Config.CELERY_RESULT_BACKEND
    
    # Configure SSL for Redis if using rediss://
    broker_use_ssl = {}
    backend_use_ssl = {}
    
    if broker_url.startswith('rediss://'):
        broker_use_ssl = {
            'ssl_cert_reqs': ssl.CERT_NONE,  # For Azure Redis, don't verify certs
            'ssl_ca_certs': None,
            'ssl_certfile': None,
            'ssl_keyfile': None
        }
        logger.info("Configured SSL for Celery broker (Redis SSL)")
    
    if backend_url.startswith('rediss://'):
        backend_use_ssl = {
            'ssl_cert_reqs': ssl.CERT_NONE,  # For Azure Redis, don't verify certs
            'ssl_ca_certs': None,
            'ssl_certfile': None,
            'ssl_keyfile': None
        }
        logger.info("Configured SSL for Celery backend (Redis SSL)")
    
    celery = Celery(
        'xrisk',
        broker=broker_url,
        backend=backend_url,
        include=['workflow_task', 'retry_task']  # Import workflow and retry tasks
    )
    
    # Celery configuration
    celery.conf.update(
        task_track_started=Config.CELERY_TASK_TRACK_STARTED,
        task_time_limit=Config.CELERY_TASK_TIME_LIMIT,
        result_expires=Config.CELERY_RESULT_EXPIRES,
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,
        worker_prefetch_multiplier=1,  # Process one task at a time
        worker_max_tasks_per_child=50,  # Restart worker after 50 tasks (prevent memory leaks)
        broker_use_ssl=broker_use_ssl if broker_use_ssl else None,
        redis_backend_use_ssl=backend_use_ssl if backend_use_ssl else None,
        broker_connection_retry_on_startup=True,
        task_default_queue='celery',
        task_routes={
            'workflow.execute_risk_workflow': {'queue': 'celery'},
            'workflow.resume_after_inquiry': {'queue': 'celery'},
            'workflow.retry_failed_workflows': {'queue': 'celery'},
        },
        # Celery Beat Schedule (periodic tasks)
        beat_schedule={
            'retry-failed-workflows': {
                'task': 'workflow.retry_failed_workflows',
                'schedule': float(Config.RETRY_CHECK_INTERVAL),  # Configurable interval from .env
            },
        },
    )
    
    logger.info("Celery app configured successfully")
    logger.info(f"Broker: {broker_url[:20]}...")
    logger.info(f"Backend: {backend_url[:20]}...")
    
    return celery

# Create celery app instance
celery_app = make_celery()

# Configure Celery logging when the app is created
@celery_app.on_after_configure.connect
def setup_celery_logging_on_configure(sender, **kwargs):
    """Setup Celery logging when the app is configured"""
    setup_celery_logging()

