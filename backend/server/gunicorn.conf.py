"""
xrisk - Gunicorn Configuration
Author: Manuel Schott

Production configuration for Gunicorn WSGI server
"""

import os
import multiprocessing

# Monkey-patch BEFORE anything else when using gevent workers
# This MUST happen before any SSL/socket imports
from gevent import monkey
monkey.patch_all()

# Server socket
# Azure App Service expects port 8000 by default
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes - Using gevent for async SSE/Long-Running connections
# gevent workers can handle many concurrent connections without blocking
workers = 4
worker_class = "gevent"  # Async worker for SSE streams
worker_connections = 1000
timeout = 600  # 10 minutes - gevent workers don't block, but allow longer for safety
keepalive = 5

# Note: urllib3 is pinned to <2.0 in requirements.txt to avoid SSL recursion bug
# with Python 3.11 + gevent + urllib3 >= 2.0 combination

# Restart workers after this many requests, to prevent memory leaks
max_requests = 500  # Lower for Azure
max_requests_jitter = 25

# Logging
# Write to both stdout (for real-time monitoring) and files (for retrieval via az container exec)
log_dir = os.environ.get('LOG_DIR', '/app/logs')
accesslog = "-"  # stdout for real-time
errorlog = "-"   # stderr for real-time
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Also write access logs to file (for retrieval when stdout is unavailable)
# This works around Azure Container Instances log retrieval issues
import logging
import sys
import os

# Füge server-Verzeichnis zum Python-Path hinzu für logging_config Import
server_dir = os.path.dirname(__file__)
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

from logging_config import create_rotating_file_handler

def post_worker_init(worker):
    """Called just after a worker has initialized the application."""
    try:
        # Ensure log directory exists and is writable
        os.makedirs(log_dir, exist_ok=True)
        
        if not os.access(log_dir, os.W_OK):
            raise PermissionError(f"Log directory {log_dir} is not writable")
        
        # Setup file logging for access logs in each worker
        gunicorn_logger = logging.getLogger('gunicorn.access')
        # Remove existing handlers to avoid duplicates
        gunicorn_logger.handlers = []
        access_handler = create_rotating_file_handler(
            f'{log_dir}/gunicorn_access.log',
            formatter=logging.Formatter('%(message)s')
        )
        gunicorn_logger.addHandler(access_handler)
        
        # Setup file logging for error logs in each worker
        gunicorn_error_logger = logging.getLogger('gunicorn.error')
        # Remove existing handlers to avoid duplicates
        gunicorn_error_logger.handlers = []
        error_handler = create_rotating_file_handler(
            f'{log_dir}/gunicorn_error.log',
            formatter=logging.Formatter(
                '%(asctime)s [%(process)d] [%(levelname)s] %(message)s', 
                datefmt='%Y-%m-%d %H:%M:%S'
            )
        )
        gunicorn_error_logger.addHandler(error_handler)
    except (PermissionError, OSError) as e:
        # If file logging fails, continue with stdout/stderr only
        # This prevents worker boot failures
        import sys
        print(f"Warning: Could not setup Gunicorn file logging: {e}", file=sys.stderr)
        print(f"Continuing with stdout/stderr logging only", file=sys.stderr)
    except Exception as e:
        # Catch any other exceptions
        import sys
        print(f"Warning: Unexpected error setting up Gunicorn file logging: {e}", file=sys.stderr)
        print(f"Continuing with stdout/stderr logging only", file=sys.stderr)

# Process naming
proc_name = "xrisk_app"

# Server mechanics
daemon = False
pidfile = None  # No PID file needed for Azure
user = None
group = None
tmp_upload_dir = None

# SSL (uncomment for HTTPS)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Preload app - enabled for faster responses
preload_app = True

# Worker timeout
graceful_timeout = 30

# Restart workers
reload = False
