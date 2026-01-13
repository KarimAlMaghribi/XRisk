#!/bin/bash
# xrisk VM Logs Downloader
# Downloads all logs from Docker containers running on VM
# Usage: ./vm-download-logs.sh [user@host]
# Author: Manuel Schott

set -e

SSH_TARGET="${1:-azureuser@xrisk.info}"
REMOTE_DIR="~/xrisk/backend"

echo "=========================================="
echo "  xrisk VM Logs Downloader"
echo "=========================================="
echo ""
echo "SSH Target: $SSH_TARGET"
echo "Remote Directory: $REMOTE_DIR"
echo ""

# Check if SSH is available
if ! command -v ssh &> /dev/null; then
    echo "❌ Error: SSH not found!"
    exit 1
fi

echo "✅ SSH found"
echo ""

# Test SSH connection
echo "Testing SSH connection..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$SSH_TARGET" "echo connected" &> /dev/null; then
    echo "⚠️  Warning: SSH connection requires authentication"
    echo "   Trying with interactive authentication..."
    if ! ssh -o ConnectTimeout=10 "$SSH_TARGET" "echo 'SSH Connection OK'"; then
        echo "❌ Error: Could not establish SSH connection!"
        exit 1
    fi
fi

echo "✅ SSH connection successful"
echo ""

# Create timestamp and log folder with subdirectories
TIMESTAMP=$(date +"%Y-%m-%d_%H%M")
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FOLDER="$PROJECT_ROOT/logs/vm-logs-$TIMESTAMP"
DOCKER_LOG_DIR="$LOG_FOLDER/docker"
APP_LOG_DIR="$LOG_FOLDER/application"
SYSTEM_LOG_DIR="$LOG_FOLDER/system"

mkdir -p "$LOG_FOLDER" "$DOCKER_LOG_DIR" "$APP_LOG_DIR" "$SYSTEM_LOG_DIR"
echo "✅ Log folder created: $LOG_FOLDER"
echo "   - docker/: $DOCKER_LOG_DIR"
echo "   - application/: $APP_LOG_DIR"
echo "   - system/: $SYSTEM_LOG_DIR"
echo ""

# Function to check file size
check_file_size() {
    local file="$1"
    local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
    local size_kb=$((size / 1024))
    
    if [ "$size" -gt 100 ]; then
        echo "✅ Saved (${size_kb} KB)"
    else
        echo "ℹ️  Empty or not available"
        rm -f "$file"
    fi
}

echo "=========================================="
echo "  Downloading Docker Container Logs"
echo "=========================================="
echo ""

# Disable exit on error for log collection (some logs may not exist)
set +e

# 1. Docker Compose Logs - All Services
echo "[1/5] Fetching all container logs (docker compose logs)..."
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml logs --tail=500" > "$DOCKER_LOG_DIR/docker-compose-all.log" 2>&1
check_file_size "$DOCKER_LOG_DIR/docker-compose-all.log"

echo ""
echo "=========================================="
echo "  Downloading Log Files from Containers"
echo "=========================================="
echo ""

# 2. Log Files from App Container
echo "[2/5] Fetching log files from App container..."

# app.log
echo "  - app.log"
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml exec -T app cat /app/logs/app.log" > "$APP_LOG_DIR/app.log" 2>&1
check_file_size "$APP_LOG_DIR/app.log"

# openai_api.log
echo "  - openai_api.log"
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml exec -T app cat /app/logs/openai_api.log" > "$APP_LOG_DIR/openai_api.log" 2>&1
check_file_size "$APP_LOG_DIR/openai_api.log"

# mcp_server.log
echo "  - mcp_server.log"
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml exec -T app cat /app/logs/mcp_server.log" > "$APP_LOG_DIR/mcp_server.log" 2>&1
check_file_size "$APP_LOG_DIR/mcp_server.log"

# gunicorn_access.log
echo "  - gunicorn_access.log"
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml exec -T app cat /app/logs/gunicorn_access.log" > "$APP_LOG_DIR/gunicorn_access.log" 2>&1
check_file_size "$APP_LOG_DIR/gunicorn_access.log"

# gunicorn_error.log
echo "  - gunicorn_error.log"
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml exec -T app cat /app/logs/gunicorn_error.log" > "$APP_LOG_DIR/gunicorn_error.log" 2>&1
check_file_size "$APP_LOG_DIR/gunicorn_error.log"

echo ""

# 3. Log Files from Worker Container
echo "[3/5] Fetching log files from Worker container..."

# celery.log
echo "  - celery.log"
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml exec -T worker cat /app/logs/celery.log" > "$APP_LOG_DIR/celery.log" 2>&1
check_file_size "$APP_LOG_DIR/celery.log"

echo ""
echo "=========================================="
echo "  Downloading Container Status Info"
echo "=========================================="
echo ""

# 4. Container Status Info
echo "[4/5] Fetching container status..."
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker compose -f docker-compose.yml ps" > "$SYSTEM_LOG_DIR/container-status.txt" 2>&1
check_file_size "$SYSTEM_LOG_DIR/container-status.txt"

# Docker Stats
echo "[5/5] Fetching system information..."
ssh "$SSH_TARGET" "cd $REMOTE_DIR && sudo docker stats --no-stream" > "$SYSTEM_LOG_DIR/docker-stats.txt" 2>&1
check_file_size "$SYSTEM_LOG_DIR/docker-stats.txt"

# System Info
ssh "$SSH_TARGET" "uptime && df -h && free -h" > "$SYSTEM_LOG_DIR/system-info.txt" 2>&1
check_file_size "$SYSTEM_LOG_DIR/system-info.txt"

echo ""

# Summary
echo "=========================================="
echo "  Download Complete"
echo "=========================================="
echo ""
echo "Folder: $LOG_FOLDER"
echo ""

echo "Downloaded files by category:"
file_count=$(find "$LOG_FOLDER" -type f | wc -l | tr -d ' ')
total_size=$(du -sh "$LOG_FOLDER" 2>/dev/null | cut -f1)

echo ""
echo "📦 Docker Logs ($DOCKER_LOG_DIR):"
for file in "$DOCKER_LOG_DIR"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        size_kb=$((size / 1024))
        printf "  - %-30s %8d KB\n" "$filename" "$size_kb"
    fi
done

echo ""
echo "📝 Application Logs ($APP_LOG_DIR):"
for file in "$APP_LOG_DIR"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        size_kb=$((size / 1024))
        printf "  - %-30s %8d KB\n" "$filename" "$size_kb"
    fi
done

echo ""
echo "⚙️  System Info ($SYSTEM_LOG_DIR):"
for file in "$SYSTEM_LOG_DIR"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        size_kb=$((size / 1024))
        printf "  - %-30s %8d KB\n" "$filename" "$size_kb"
    fi
done

echo ""
echo "Total files: $file_count"
echo "Total size: $total_size"
echo ""
echo "✅ Done!"
echo ""

