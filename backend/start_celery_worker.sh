#!/bin/bash
# Azure Celery Worker Startup Script
# Author: Manuel Schott

set -e

echo "Starting xrisk Celery Worker..."
echo "Working Directory: $(pwd)"
echo "Python Version: $(python --version)"

# Note: Environment variables are loaded by Python's load_dotenv() from .env and .env.local
# These files are mounted as volumes in docker-compose.yml
# We don't check for env vars here since they're loaded by Python at runtime
echo "Environment variables will be loaded from .env and .env.local by Python"

# Set PYTHONPATH to include server directory
export PYTHONPATH=/app/server:$PYTHONPATH
echo "PYTHONPATH: $PYTHONPATH"

# Navigate to server directory
cd /app/server

# Ensure log directory exists and is writable
LOG_DIR=${LOG_DIR:-/app/logs}
echo "Ensuring log directory exists: $LOG_DIR"
mkdir -p "$LOG_DIR" || {
    echo "Warning: Could not create log directory $LOG_DIR, will use stdout/stderr"
    LOG_DIR=""
}

# Start Celery worker
echo "Starting Celery worker..."

# Use celery queue
QUEUE_NAME="celery"
echo "Using queue: $QUEUE_NAME"

# Use logfile only if LOG_DIR is writable, otherwise use stdout/stderr (Docker best practice)
if [ -n "$LOG_DIR" ] && [ -w "$LOG_DIR" ]; then
    LOGFILE_ARG="--logfile=$LOG_DIR/celery.log"
    echo "Logging to file: $LOGFILE_ARG"
else
    LOGFILE_ARG=""
    echo "Logging to stdout/stderr (Docker best practice)"
fi

exec celery -A celery_app.celery_app worker \
    --loglevel=info \
    $LOGFILE_ARG \
    --queues=$QUEUE_NAME \
    --concurrency=2 \
    --max-tasks-per-child=50 \
    --task-events \
    --without-gossip \
    --without-mingle \
    --without-heartbeat
