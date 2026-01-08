#!/bin/bash
# Quick Update - Only sync Python source code and restart services
# NO container rebuild, NO image download
# Usage: ./vm-update.sh [user@host]
# Author: Manuel Schott

set -e

# Determine script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SSH_TARGET="${1:-azureuser@xrisk.info}"

echo "=========================================="
echo "  Quick Update - Code Only"
echo "=========================================="
echo ""
echo "Target: $SSH_TARGET"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Check if SSH target is provided
if [ -z "$SSH_TARGET" ]; then
    echo "❌ Error: SSH target not provided"
    echo "Usage: $0 user@host"
    exit 1
fi

# Extract host from SSH target
HOST=$(echo "$SSH_TARGET" | cut -d'@' -f2)

echo "1. Syncing Python source code..."
rsync -avz --progress \
    --exclude '__pycache__/' \
    "$PROJECT_ROOT/server/" "$SSH_TARGET:~/xrisk/server/"

echo "✅ Source code synced"
echo ""

echo "2. Copying controller.html to static directory..."
if [ -f "$PROJECT_ROOT/frontend/controller.html" ]; then
    mkdir -p "$PROJECT_ROOT/static"
    cp "$PROJECT_ROOT/frontend/controller.html" "$PROJECT_ROOT/static/controller.html"
    echo "✅ controller.html copied to static/"
else
    echo "⚠️  controller.html not found in frontend/, skipping copy"
fi

echo "2.1. Syncing templates and static files..."
rsync -avz --progress \
    "$PROJECT_ROOT/templates/" "$SSH_TARGET:~/xrisk/templates/"
rsync -avz --progress \
    "$PROJECT_ROOT/static/" "$SSH_TARGET:~/xrisk/static/"

echo "✅ Templates and static files synced"
echo ""

echo "3. Restarting services on VM..."
ssh "$SSH_TARGET" << 'EOF'
    cd ~/xrisk
    
    echo "Restarting app and worker containers..."
    sudo docker compose -f docker-compose.yml restart app worker
    
    echo "Waiting for services to restart..."
    sleep 5
    
    echo ""
    echo "Container Status:"
    sudo docker compose -f docker-compose.yml ps
    
    echo ""
    echo "Recent logs:"
    sudo docker compose -f docker-compose.yml logs --tail=15 app worker
EOF

echo ""
echo "✅ Quick update complete!"
echo ""
echo "Your application is now running with the latest code."
echo "No Docker images were rebuilt - fastest possible deployment!"
echo ""
echo "View logs: ssh $SSH_TARGET 'cd ~/xrisk && docker compose -f docker-compose.yml logs -f app'"
echo ""

