#!/bin/bash
# Deploy xrisk to Azure VM
# Usage: ./vm-deploy.sh [user@host]
# Author: Manuel Schott

set -e

# Determine script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SSH_TARGET="${1:-azureuser@xrisk.info}"

echo "=========================================="
echo "  Deploying xrisk to VM"
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

# Check if .env exists (in project root)
ENV_FILE="$PROJECT_ROOT/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env file not found!"
    echo "   Expected location: $ENV_FILE"
    echo "   Please create .env file with your configuration"
    exit 1
fi

echo "1. Building frontend..."
cd "$PROJECT_ROOT/frontend" || { echo "❌ Error: frontend directory not found"; exit 1; }
if [ -f "package.json" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent 2>/dev/null || echo "⚠️  npm install failed, continuing..."
    echo "Building frontend..."
    npm run build --silent 2>/dev/null || echo "⚠️  Frontend build failed, continuing..."
else
    echo "⚠️  No package.json found in frontend/, skipping build"
fi
cd "$PROJECT_ROOT"

echo "1.1. Copying controller.html to static directory..."
if [ -f "$PROJECT_ROOT/frontend/controller.html" ]; then
    mkdir -p "$PROJECT_ROOT/static"
    cp "$PROJECT_ROOT/frontend/controller.html" "$PROJECT_ROOT/static/controller.html"
    echo "✅ controller.html copied to static/"
else
    echo "⚠️  controller.html not found in frontend/, skipping copy"
fi

echo "2. Syncing project files to VM..."
rsync -avz --progress \
    --exclude 'logs/' \
    --exclude '__pycache__/' \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude '.env.local' \
    --exclude '.latest-image-tag' \
    --exclude 'caddy-data/' \
    --exclude 'frontend/node_modules/' \
    --exclude 'frontend/dist/' \
    "$PROJECT_ROOT/" "$SSH_TARGET:~/xrisk/"

echo "✅ Files synced"
echo ""

echo "3. Copying environment variables..."
scp "$ENV_FILE" "$SSH_TARGET:~/xrisk/.env"

echo "✅ Environment variables copied"
echo ""

echo "4. Checking and installing Docker if needed..."
set +e  # Temporarily disable exit on error
ssh "$SSH_TARGET" "docker --version" >/dev/null 2>&1
DOCKER_EXISTS=$?
set -e  # Re-enable exit on error

if [ $DOCKER_EXISTS -ne 0 ]; then
    echo ""
    echo "❌ Docker not found - installing now..."
    echo ""
    
    ssh "$SSH_TARGET" << 'DOCKER_INSTALL'
        set -e
        
        echo "Installing Docker..."
        
        # Update packages
        sudo apt-get update -qq
        
        # Install prerequisites
        sudo apt-get install -y -qq apt-transport-https ca-certificates curl software-properties-common
        
        # Add Docker GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        
        # Add Docker repository
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker
        sudo apt-get update -qq
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Start Docker
        sudo systemctl start docker
        sudo systemctl enable docker
        
        # Add user to docker group
        sudo usermod -aG docker $USER
        
        echo "✅ Docker installed"
DOCKER_INSTALL
    
    if [ $? -ne 0 ]; then
        echo "❌ Docker installation failed"
        exit 1
    fi
    
    echo "✅ Docker installed successfully"
    echo ""
else
    echo "✅ Docker is available"
    echo ""
fi

echo "5. Building and starting containers on VM..."
ssh "$SSH_TARGET" << 'EOF'
    cd ~/xrisk
    
    # Fix log directory permissions before starting containers
    echo "Fixing log directory permissions..."
    mkdir -p logs
    # Try chmod, ignore errors if it fails (Docker containers will set their own permissions)
    chmod 777 logs 2>/dev/null || echo "⚠️  Could not set logs permissions (may need sudo or will be set by Docker), continuing..."
    touch logs/celery.log logs/app.log 2>/dev/null || true
    chmod 666 logs/*.log 2>/dev/null || true
    
    # Stop old containers if running
    sudo docker compose -f docker-compose.yml down 2>/dev/null || true
    
    # Build images
    echo "Building Docker images..."
    sudo docker compose -f docker-compose.yml build
    
    # Start containers
    echo "Starting containers..."
    sudo docker compose -f docker-compose.yml up -d
    
    # Wait for services to be healthy
    echo "Waiting for services to start..."
    sleep 10
    
    # Show status
    echo ""
    echo "Container Status:"
    sudo docker compose -f docker-compose.yml ps
    
    echo ""
    echo "Logs (last 20 lines):"
    sudo docker compose -f docker-compose.yml logs --tail=20
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "=========================================="
echo "  Access Your Application"
echo "=========================================="
echo ""
echo "HTTP:  http://$HOST"
echo "HTTPS: https://$HOST (if domain configured)"
echo ""
echo "View logs: ssh $SSH_TARGET 'cd ~/xrisk && docker compose -f docker-compose.yml logs -f'"
echo "Stop:      ssh $SSH_TARGET 'cd ~/xrisk && docker compose -f docker-compose.yml down'"
echo "Restart:   ssh $SSH_TARGET 'cd ~/xrisk && docker compose -f docker-compose.yml restart'"
echo ""

