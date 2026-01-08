#!/bin/bash
# Azure Container Instance Startup Script
# Author: Manuel Schott

# Don't exit on error - show detailed error messages
set +e

echo "========================================"
echo "  Starting xrisk Application"
echo "========================================"
echo "Working Directory: $(pwd)"
echo "Python Version: $(python --version)"
echo "User: $(whoami)"
echo ""

# Check if database connection is available
echo "Checking environment variables..."
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Database URL found"
else
    echo "❌ WARNING: No database connection string found (DATABASE_URL)"
fi

# Check if OpenAI API key is set
if [ -n "$OPENAI_API_KEY" ]; then
    KEY_PREVIEW="${OPENAI_API_KEY:0:10}"
    echo "✅ OpenAI API key is set: $KEY_PREVIEW..."
else
    echo "❌ WARNING: OPENAI_API_KEY not set"
fi

# Check if Redis URL is set
if [ -n "$REDIS_URL" ]; then
    REDIS_PREVIEW="${REDIS_URL:0:20}"
    echo "✅ Redis URL is set: $REDIS_PREVIEW..."
else
    echo "❌ WARNING: REDIS_URL not set"
fi

# Check if LOG_DIR is set (will be loaded from .env by Python)
LOG_DIR=${LOG_DIR:-/app/logs}
echo "✅ LOG_DIR: $LOG_DIR"
# Ensure log directory exists and is writable
mkdir -p "$LOG_DIR" || {
    echo "⚠️  Warning: Could not create log directory $LOG_DIR"
}
# Set permissions to ensure writability
chmod 777 "$LOG_DIR" 2>/dev/null || echo "⚠️  Warning: Could not set permissions on $LOG_DIR"
# Create log files if they don't exist
touch "$LOG_DIR/celery.log" "$LOG_DIR/app.log" "$LOG_DIR/gunicorn_access.log" "$LOG_DIR/gunicorn_error.log" 2>/dev/null || true
chmod 666 "$LOG_DIR"/*.log 2>/dev/null || true
echo "✅ Log directory ready: $LOG_DIR"

echo ""

# Initialize database
echo "Initializing database..."
cd /app/server || { echo "❌ Error: Cannot cd to /app/server"; exit 1; }

python database_setup.py
if [ $? -ne 0 ]; then
    echo "⚠️  Database initialization failed, continuing anyway..."
else
    echo "✅ Database initialized successfully"
fi

echo ""

# Start Celery Beat FIRST (in background as appuser for scheduled tasks)
if [ "$(id -u)" = "0" ]; then
    echo "Starting Celery Beat (scheduler for retry tasks)..."
    cd /app/server || exit 1
    
    # Check if log directory is writable before starting Beat
    if [ -w "$LOG_DIR" ]; then
        BEAT_LOGFILE="--logfile=$LOG_DIR/celery.log"
        BEAT_PIDFILE="--pidfile=$LOG_DIR/celery_beat.pid"
    else
        echo "⚠️  Log directory not writable, Beat will log to stdout"
        BEAT_LOGFILE=""
        BEAT_PIDFILE=""
    fi
    
    su -s /bin/bash appuser -c "celery -A celery_app beat --loglevel=info $BEAT_LOGFILE $BEAT_PIDFILE --detach" &
    BEAT_PID=$!
    echo "✅ Celery Beat started with PID: $BEAT_PID"
    echo ""
fi

# Start Gunicorn SECOND (in background as appuser), THEN Caddy
if [ "$(id -u)" = "0" ]; then
    echo "Starting Gunicorn on port 8000 (as appuser)..."
    echo "Working directory: /app/server"
    echo "Command: gunicorn --config gunicorn.conf.py wsgi:app"
    echo ""
    
    # Test if user exists
    if ! id appuser > /dev/null 2>&1; then
        echo "❌ Error: User 'appuser' does not exist!"
        exit 1
    fi
    
    # Test if directory exists
    if [ ! -d "/app/server" ]; then
        echo "❌ Error: Directory /app/server does not exist!"
        exit 1
    fi
    
    # Start Gunicorn as appuser in background
    cd /app/server || exit 1
    su -s /bin/bash appuser -c "gunicorn --config gunicorn.conf.py wsgi:app" &
    GUNICORN_PID=$!
    
    echo "Gunicorn started with PID: $GUNICORN_PID"
    echo "Waiting for Gunicorn to be ready..."
    sleep 3
    
    # Test if Gunicorn is running
    if ! kill -0 $GUNICORN_PID 2>/dev/null; then
        echo "❌ Error: Gunicorn failed to start!"
        exit 1
    fi
    
    # Test if port 8000 is listening
    for i in {1..20}; do
        if curl -f -m 5 http://127.0.0.1:8000/health >/dev/null 2>&1; then
            echo "✅ Gunicorn is ready and responding on port 8000"
            break
        fi
        echo "Waiting for Gunicorn... ($i/20)"
        sleep 2
    done
    
    echo ""
    
    # Now start Caddy (for HTTPS) - runs as root for port 80/443
    if [ -n "$DOMAIN_NAME" ]; then
        echo "Starting Caddy for HTTPS on port 443..."
        echo "Domain: $DOMAIN_NAME"
        caddy start --config /etc/caddy/Caddyfile --adapter caddyfile
        
        if [ $? -eq 0 ]; then
            echo "✅ Caddy started successfully (running as root)"
        else
            echo "❌ Caddy failed to start!"
            kill $GUNICORN_PID
            exit 1
        fi
        echo ""
    else
        echo "⚠️  DOMAIN_NAME not set - skipping Caddy (no HTTPS)"
        echo ""
    fi
    
    # Keep container alive and monitor Gunicorn
    echo "=== Application is running ==="
    echo "Gunicorn PID: $GUNICORN_PID"
    if [ -n "$BEAT_PID" ]; then
        echo "Celery Beat PID: $BEAT_PID"
    fi
    echo "Monitoring Gunicorn process..."
    echo ""
    
    # Cleanup function for Beat
    cleanup() {
        echo "Shutting down..."
        if [ -n "$BEAT_PID" ] && kill -0 $BEAT_PID 2>/dev/null; then
            echo "Stopping Celery Beat (PID: $BEAT_PID)..."
            kill $BEAT_PID 2>/dev/null
        fi
    }
    trap cleanup EXIT
    
    # Wait for Gunicorn to exit
    wait $GUNICORN_PID
    EXIT_CODE=$?
    
    echo "Gunicorn exited with code: $EXIT_CODE"
    cleanup
    exit $EXIT_CODE
    
else
    # Already non-root user - start Gunicorn normally
    echo "Starting Gunicorn on port 8000..."
    echo "Command: gunicorn --config gunicorn.conf.py wsgi:app"
    echo ""
    cd /app/server || exit 1
    exec gunicorn --config gunicorn.conf.py wsgi:app
fi

