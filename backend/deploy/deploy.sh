#!/bin/bash
# Deploy xrisk to Azure VM
# Usage: ./vm-deploy.sh [user@host]
# Author: Manuel Schott

set -e

# Determine script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

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

# Check if .env exists (in backend directory)
ENV_FILE="$PROJECT_ROOT/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env file not found!"
    echo "   Expected location: $ENV_FILE"
    echo "   Please create .env file with your configuration"
    exit 1
fi

# Security check: Warn if sensitive secrets are in .env
echo "Checking for sensitive secrets in .env..."
SENSITIVE_VARS=("POSTGRES_PASSWORD" "REDIS_PASSWORD" "MAIL_PASSWORD" "OPENAI_API_KEY" "GOOGLE_CLIENT_SECRET" "MICROSOFT_CLIENT_SECRET")
FOUND_SECRETS=0
for var in "${SENSITIVE_VARS[@]}"; do
    if grep -q "^${var}=" "$ENV_FILE" && ! grep -q "^${var}=#" "$ENV_FILE" && ! grep -q "^${var}=$" "$ENV_FILE"; then
        if [ $FOUND_SECRETS -eq 0 ]; then
            echo "⚠️  WARNING: Sensitive secrets found in .env file!"
            echo "   For better security, consider using:"
            echo "   - Azure Key Vault (production): Set AZURE_KEYVAULT_URL in .env"
            echo "   - .env.local (local dev): Copy backend/.env.local.example to backend/.env.local"
            echo ""
            echo "   Found secrets:"
        fi
        echo "   - ${var}"
        FOUND_SECRETS=$((FOUND_SECRETS + 1))
    fi
done

if [ $FOUND_SECRETS -gt 0 ]; then
    echo ""
    echo "   See backend/README_SECRETS.md for migration instructions"
    echo ""
    read -p "Continue deployment anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

echo "1. Building api-connector..."
cd "$PROJECT_ROOT/api-connector" || { echo "❌ Error: api-connector directory not found"; exit 1; }
if [ -f "package.json" ]; then
    echo "Installing api-connector dependencies..."
    npm install --silent 2>/dev/null || echo "⚠️  npm install failed, continuing..."
    echo "Building api-connector..."
    npm run build --silent 2>/dev/null || echo "⚠️  api-connector build failed, continuing..."
else
    echo "⚠️  No package.json found in api-connector/, skipping build"
fi
cd "$PROJECT_ROOT"

echo "1.1. Copying controller.html to static directory..."
if [ -f "$PROJECT_ROOT/api-connector/controller.html" ]; then
    mkdir -p "$PROJECT_ROOT/backend/static"
    cp "$PROJECT_ROOT/api-connector/controller.html" "$PROJECT_ROOT/backend/static/controller.html"
    echo "✅ controller.html copied to backend/static/"
else
    echo "⚠️  controller.html not found in api-connector/, skipping copy"
fi

# Copy built files from api-connector/dist to backend/static if they exist
if [ -d "$PROJECT_ROOT/api-connector/dist" ]; then
    mkdir -p "$PROJECT_ROOT/backend/static"
    cp -r "$PROJECT_ROOT/api-connector/dist/"* "$PROJECT_ROOT/backend/static/" 2>/dev/null || true
    echo "✅ Built files copied to backend/static/"
fi

echo "2. Syncing project files to VM..."
rsync -avz --progress \
    --exclude 'logs/' \
    --exclude '__pycache__/' \
    --exclude '.git/' \
    --exclude 'node_modules/' \
    --exclude '.env.local' \
    --exclude 'backend/.env.local' \
    --exclude '.env.local.example' \
    --exclude '.latest-image-tag' \
    --exclude 'caddy-data/' \
    --exclude 'api-connector/node_modules/' \
    --exclude 'api-connector/dist/' \
    --exclude 'backend/deploy/' \
    "$PROJECT_ROOT/" "$SSH_TARGET:~/xrisk/"

echo "✅ Files synced"
echo ""

# Verify critical files were synced
echo "Verifying critical files..."
ssh "$SSH_TARGET" << 'VERIFY'
    if [ ! -f ~/xrisk/backend/Dockerfile.worker ]; then
        echo "❌ Error: backend/Dockerfile.worker not found after sync!"
        exit 1
    fi
    if [ ! -f ~/xrisk/backend/start_celery_worker.sh ]; then
        echo "❌ Error: backend/start_celery_worker.sh not found after sync!"
        exit 1
    fi
    echo "✅ Critical files verified"
VERIFY

echo "3. Copying environment variables..."
echo "   Note: Only non-sensitive config is copied. Secrets should be in Azure Key Vault or .env.local"
scp "$ENV_FILE" "$SSH_TARGET:~/xrisk/backend/.env"

echo "✅ Environment variables copied"
echo ""
echo "   ⚠️  IMPORTANT: Ensure secrets are configured on the VM:"
echo "   - Azure Key Vault: Set AZURE_KEYVAULT_URL in .env and configure Managed Identity"
echo "   - OR .env.local: Create ~/xrisk/backend/.env.local with secrets (not synced)"
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
    cd ~/xrisk/backend
    
    # Remove old .env file in /xrisk if it exists (should be in /xrisk/backend)
    if [ -f ~/xrisk/.env ] && [ ! -L ~/xrisk/.env ]; then
        echo "Removing old .env file from ~/xrisk (should be in ~/xrisk/backend)..."
        rm -f ~/xrisk/.env
        echo "✅ Old .env file removed"
    fi
    
    # Load .env file first to get AZURE_KEYVAULT_URL
    echo "Loading .env file to get Azure Key Vault configuration..."
    if [ -f .env ]; then
        # Load .env file to export variables (ignore comments and empty lines)
        set -a  # Automatically export all variables
        while IFS= read -r line || [ -n "$line" ]; do
            # Skip comments and empty lines
            [[ "$line" =~ ^[[:space:]]*# ]] && continue
            [[ -z "${line// }" ]] && continue
            # Export the variable
            export "$line" 2>/dev/null || true
        done < .env
        set +a  # Stop automatically exporting
        echo "✅ .env file loaded"
        if [ -n "$AZURE_KEYVAULT_URL" ]; then
            echo "  AZURE_KEYVAULT_URL is set"
        else
            echo "  ⚠️  AZURE_KEYVAULT_URL not found in .env file"
        fi
    else
        echo "⚠️  .env file not found at ~/xrisk/backend/.env"
    fi
    
    # Load secrets from Azure Key Vault and update .env file
    echo "Loading secrets from Azure Key Vault..."
    
    # Check if pip is installed, install if missing
    if ! command -v pip3 &> /dev/null && ! python3 -m pip --version &> /dev/null; then
        echo "Installing pip3..."
        if sudo apt-get update -qq && sudo apt-get install -y -qq python3-pip 2>/dev/null; then
            echo "✅ pip3 installed"
        else
            echo ""
            echo "❌ ERROR: Failed to install pip3"
            echo "   Cannot load secrets from Azure Key Vault without pip3"
            echo ""
            echo "   Please install pip3 manually:"
            echo "   sudo apt-get update && sudo apt-get install -y python3-pip"
            echo ""
            echo "   Deployment aborted!"
            exit 1
        fi
    fi
    
    # Check if Azure Key Vault libraries are installed, install if missing
    if ! python3 -c "import azure.keyvault.secrets" 2>/dev/null; then
        echo "Installing Azure Key Vault libraries..."
        # Try different pip commands
        if python3 -m pip install --quiet azure-keyvault-secrets>=4.7.0 azure-identity>=1.15.0 2>/dev/null; then
            echo "✅ Azure Key Vault libraries installed"
        elif pip3 install --quiet azure-keyvault-secrets>=4.7.0 azure-identity>=1.15.0 2>/dev/null; then
            echo "✅ Azure Key Vault libraries installed"
        else
            echo "⚠️  Failed to install Azure Key Vault libraries"
            echo "   Trying with sudo..."
            if sudo python3 -m pip install --quiet azure-keyvault-secrets>=4.7.0 azure-identity>=1.15.0 2>/dev/null; then
                echo "✅ Azure Key Vault libraries installed"
            elif sudo pip3 install --quiet azure-keyvault-secrets>=4.7.0 azure-identity>=1.15.0 2>/dev/null; then
                echo "✅ Azure Key Vault libraries installed"
            else
                echo "⚠️  Could not install Azure Key Vault libraries"
                echo "   Secrets must be in .env file if Key Vault is not available"
            fi
        fi
    fi
    
    if [ -f server/secret_loader.py ] && python3 -c "import azure.keyvault.secrets" 2>/dev/null; then
        # Use Python to load secrets from Key Vault and append to .env
        python3 << 'PYTHON_EOF'
import sys
import os
sys.path.insert(0, 'server')

print("Step 1: Checking Azure Key Vault configuration...")
keyvault_url = os.environ.get('AZURE_KEYVAULT_URL')
if keyvault_url:
    print(f"  AZURE_KEYVAULT_URL: {keyvault_url}")
else:
    print("  ⚠️  AZURE_KEYVAULT_URL not set in environment")

print("")
print("Step 2: Importing secret_loader...")
try:
    from secret_loader import load_secrets_from_keyvault
    print("  ✅ secret_loader imported successfully")
except Exception as e:
    print(f"  ❌ Failed to import secret_loader: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("")
print("Step 3: Loading secrets from Azure Key Vault...")
try:
    secrets = load_secrets_from_keyvault()
    print(f"  Function returned: {type(secrets)}, length: {len(secrets) if secrets else 0}")
    
    if secrets:
        print(f"✅ Loaded {len(secrets)} secrets from Azure Key Vault")
        print("")
        print("Loaded secrets:")
        for key in sorted(secrets.keys()):
            value_len = len(secrets[key])
            status = "✓" if value_len > 0 else "✗ (empty)"
            print(f"  {key}: {status} (length: {value_len})")
        print("")
        
        # Check if critical secrets are present
        critical_secrets = ['POSTGRES_PASSWORD', 'REDIS_PASSWORD', 'OPENAI_API_KEY']
        missing_critical = [s for s in critical_secrets if s not in secrets]
        if missing_critical:
            print("⚠️  WARNING: Some critical secrets are missing from Key Vault:")
            for secret in missing_critical:
                print(f"   - {secret}")
            print("   These may be loaded from .env file or need to be added to Key Vault")
        else:
            print("✅ All critical secrets (POSTGRES_PASSWORD, REDIS_PASSWORD, OPENAI_API_KEY) are present in Key Vault")
        
        # Explicitly verify REDIS_PASSWORD is loaded
        if 'REDIS_PASSWORD' in secrets and secrets['REDIS_PASSWORD']:
            print(f"✅ REDIS_PASSWORD loaded from Key Vault (length: {len(secrets['REDIS_PASSWORD'])})")
        else:
            print("⚠️  REDIS_PASSWORD not found in Key Vault - will check .env file")
        print("")
        
        # Append secrets to .env file
        print("Step 4: Appending secrets to .env file...")
        with open('.env', 'a') as f:
            f.write('\n# Secrets loaded from Azure Key Vault\n')
            for key, value in secrets.items():
                # Remove surrounding quotes if present (from Key Vault or previous writes)
                value_clean = value.strip()
                if value_clean.startswith('"') and value_clean.endswith('"'):
                    value_clean = value_clean[1:-1]
                    print(f"  Removed quotes from {key}")
                elif value_clean.startswith("'") and value_clean.endswith("'"):
                    value_clean = value_clean[1:-1]
                    print(f"  Removed single quotes from {key}")
                
                # Escape special characters in value, but don't wrap in quotes
                # Quotes cause issues when loading the .env file - they become part of the value
                value_escaped = value_clean.replace('\\', '\\\\').replace('$', '\\$')
                # Only escape quotes if they're in the middle of the value
                value_escaped = value_escaped.replace('"', '\\"')
                # Write without surrounding quotes - dotenv handles special characters
                f.write(f'{key}={value_escaped}\n')
        print("✅ Secrets appended to .env file")
        
        # Verify .env file was updated
        print("")
        print("Step 5: Verifying .env file:")
        with open('.env', 'r') as f:
            lines = f.readlines()
            secret_lines = [line for line in lines if 'POSTGRES_PASSWORD' in line or 'REDIS_PASSWORD' in line or 'OPENAI_API_KEY' in line]
            for line in secret_lines[-3:]:  # Show last 3 relevant lines
                if '=' in line:
                    key = line.split('=')[0].strip()
                    value_len = len(line.split('=')[1].strip()) if '=' in line else 0
                    print(f"  {key}: ✓ (length: {value_len})")
    else:
        print("⚠️  No secrets loaded from Azure Key Vault")
        print("")
        print("Debugging information:")
        print("  - Checking if Key Vault URL is set...")
        if keyvault_url:
            print(f"    ✅ Key Vault URL: {keyvault_url}")
        else:
            print("    ❌ Key Vault URL not set")
        print("  - Checking if we can connect to Key Vault...")
        try:
            from azure.keyvault.secrets import SecretClient
            from azure.identity import DefaultAzureCredential
            credential = DefaultAzureCredential()
            client = SecretClient(vault_url=keyvault_url, credential=credential)
            print("    ✅ Successfully created SecretClient")
            print("  - Listing available secrets...")
            secret_properties = list(client.list_properties_of_secrets())
            print(f"    Found {len(secret_properties)} secrets in Key Vault:")
            for prop in secret_properties:
                print(f"      - {prop.name}")
        except Exception as e:
            print(f"    ❌ Failed to connect: {e}")
            import traceback
            traceback.print_exc()
except Exception as e:
    error_msg = str(e)
    print(f"⚠️  Failed to load secrets from Azure Key Vault: {e}")
    
    # Check for specific authorization errors
    if "Forbidden" in error_msg or "not authorized" in error_msg.lower():
        print("")
        print("❌ AUTHORIZATION ERROR:")
        print("   The VM or user does not have permission to access Azure Key Vault.")
        print("")
        print("   To fix this, you need to grant access:")
        print("   1. Go to Azure Portal -> Key Vault 'vault-13' -> Access control (IAM)")
        print("   2. Add role assignment:")
        print("      - Role: 'Key Vault Secrets User' (or 'Key Vault Secrets Officer')")
        print("      - Assign access to: User/Managed Identity")
        print("      - Select: The VM's Managed Identity or user account")
        print("")
        print("   OR if using Managed Identity:")
        print("   az role assignment create \\")
        print("     --role 'Key Vault Secrets User' \\")
        print("     --assignee <managed-identity-principal-id> \\")
        print("     --scope /subscriptions/a3d58df5-e19c-4242-99c0-f4e0301dc71d/resourcegroups/xrisk_group/providers/microsoft.keyvault/vaults/vault-13")
        print("")
        print("   After granting access, wait a few minutes for propagation.")
        print("")
        print("   Deployment will continue with existing .env file (if secrets are present).")
    else:
        import traceback
        print("   Error details:")
        traceback.print_exc()
        print("   Continuing with existing .env file...")
PYTHON_EOF
    else
        echo "⚠️  Azure Key Vault libraries not available, skipping Key Vault secrets"
        echo "   Note: Secrets must be in .env file if Key Vault is not available"
        echo ""
        echo "   Checking if REDIS_PASSWORD exists in .env file..."
        if grep -q "^REDIS_PASSWORD=" .env 2>/dev/null; then
            REDIS_PASSWORD_FROM_ENV=$(grep "^REDIS_PASSWORD=" .env | cut -d'=' -f2- | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//")
            if [ -n "$REDIS_PASSWORD_FROM_ENV" ]; then
                echo "   ✅ REDIS_PASSWORD found in .env file"
            else
                echo "   ⚠️  REDIS_PASSWORD exists in .env but is empty"
            fi
        else
            echo "   ⚠️  REDIS_PASSWORD not found in .env file"
        fi
    fi
    
    # Export environment variables from .env file for docker-compose
    echo "Loading environment variables from .env file..."
    if [ -f .env ]; then
        # Source .env file to export variables (ignore comments and empty lines)
        set -a  # Automatically export all variables
        # Use a safer method to source .env that handles comments and quoted values
        while IFS= read -r line || [ -n "$line" ]; do
            # Skip comments and empty lines
            [[ "$line" =~ ^[[:space:]]*# ]] && continue
            [[ -z "${line// }" ]] && continue
            
            # Remove surrounding quotes from values if present
            # Handle both KEY="value" and KEY='value' formats
            if [[ "$line" =~ ^([^=]+)=\"(.+)\"$ ]]; then
                # Double quotes: KEY="value"
                key="${BASH_REMATCH[1]}"
                value="${BASH_REMATCH[2]}"
                # Unescape quotes in value
                value="${value//\\\"/\"}"
                export "$key=$value" 2>/dev/null || true
            elif [[ "$line" =~ ^([^=]+)=\'(.+)\'$ ]]; then
                # Single quotes: KEY='value'
                key="${BASH_REMATCH[1]}"
                value="${BASH_REMATCH[2]}"
                export "$key=$value" 2>/dev/null || true
            else
                # No quotes or unquoted value
                export "$line" 2>/dev/null || true
            fi
        done < .env
        set +a  # Stop automatically exporting
        echo "✅ Environment variables loaded from .env"
        
        # Verify critical variables are set - abort if missing
        MISSING_VARS=()
        if [ -z "$POSTGRES_PASSWORD" ]; then
            MISSING_VARS+=("POSTGRES_PASSWORD")
        fi
        if [ -z "$REDIS_PASSWORD" ]; then
            MISSING_VARS+=("REDIS_PASSWORD")
        fi
        if [ -z "$OPENAI_API_KEY" ]; then
            MISSING_VARS+=("OPENAI_API_KEY")
        fi
        
        if [ ${#MISSING_VARS[@]} -gt 0 ]; then
            echo ""
            echo "❌ ERROR: Critical environment variables are not set!"
            echo "   Missing variables: ${MISSING_VARS[*]}"
            echo ""
            echo "   Please ensure:"
            echo "   1. Secrets are loaded from Azure Key Vault, OR"
            echo "   2. Variables are set in .env file"
            echo ""
            echo "   Deployment aborted!"
            exit 1
        fi
        
        # Explicitly verify REDIS_PASSWORD is set and not empty
        echo "Verifying REDIS_PASSWORD is set..."
        if [ -z "$REDIS_PASSWORD" ]; then
            echo ""
            echo "❌ CRITICAL ERROR: REDIS_PASSWORD is not set!"
            echo "   Redis requires password authentication for security."
            echo "   Please ensure REDIS_PASSWORD is:"
            echo "   1. Set in Azure Key Vault (preferred), OR"
            echo "   2. Set in .env file"
            echo ""
            echo "   Deployment aborted!"
            exit 1
        else
            REDIS_PASSWORD_LEN=${#REDIS_PASSWORD}
            echo "✅ REDIS_PASSWORD is set (length: $REDIS_PASSWORD_LEN characters)"
            echo "   Redis will start with password authentication enabled"
        fi
        
        # Collect environment variables to pass to sudo docker compose
        # Docker Compose will automatically load .env file, but we also need to pass
        # critical variables explicitly to ensure they're available
        echo "Preparing environment variables for docker-compose..."
        ENV_VARS=""
        # Collect all environment variables that start with POSTGRES_, REDIS_, OPENAI_, etc.
        while IFS= read -r line || [ -n "$line" ]; do
            # Skip comments and empty lines
            [[ "$line" =~ ^[[:space:]]*# ]] && continue
            [[ -z "${line// }" ]] && continue
            # Extract variable name
            var_name=$(echo "$line" | cut -d'=' -f1 | tr -d '[:space:]')
            var_value=$(echo "$line" | cut -d'=' -f2- | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//")
            # Add to ENV_VARS string for passing to docker-compose
            if [[ "$var_name" =~ ^(POSTGRES_|REDIS_|OPENAI_|MAIL_|SMTP_|GOOGLE_|MICROSOFT_|AZURE_KEYVAULT) ]]; then
                ENV_VARS="${ENV_VARS}${var_name}=\"${var_value}\" "
            fi
        done < .env
        
        echo "✅ Environment variables prepared"
    else
        echo "❌ ERROR: .env file not found!"
        echo "   Deployment aborted!"
        exit 1
    fi
    
    # Final verification: Ensure REDIS_PASSWORD is set before starting containers
    echo ""
    echo "=========================================="
    echo "  Final Pre-Deployment Verification"
    echo "=========================================="
    echo ""
    echo "Verifying REDIS_PASSWORD is available for container startup..."
    if [ -z "$REDIS_PASSWORD" ]; then
        echo ""
        echo "❌ CRITICAL ERROR: REDIS_PASSWORD is not set!"
        echo "   Cannot start Redis container without password."
        echo ""
        echo "   This should not happen if:"
        echo "   1. Secrets were loaded from Azure Key Vault, OR"
        echo "   2. REDIS_PASSWORD was in .env file"
        echo ""
        echo "   Please check:"
        echo "   - Azure Key Vault contains REDIS_PASSWORD secret"
        echo "   - .env file contains REDIS_PASSWORD"
        echo "   - Deployment script successfully loaded secrets"
        echo ""
        echo "   Deployment aborted!"
        exit 1
    else
        REDIS_PASSWORD_LEN=${#REDIS_PASSWORD}
        echo "✅ REDIS_PASSWORD verified: Set (length: $REDIS_PASSWORD_LEN characters)"
        echo "   Redis container will start with password authentication"
    fi
    echo ""
    
    # Fix log directory permissions before starting containers
    echo "Fixing log directory permissions..."
    mkdir -p logs
    # Try chmod, ignore errors if it fails (Docker containers will set their own permissions)
    chmod 777 logs 2>/dev/null || echo "⚠️  Could not set logs permissions (may need sudo or will be set by Docker), continuing..."
    touch logs/celery.log logs/app.log 2>/dev/null || true
    chmod 666 logs/*.log 2>/dev/null || true
    
    # Stop and remove old containers if running
    echo "Stopping and removing old containers..."
    # Use sudo -E to preserve environment variables, and docker-compose will also load .env file
    sudo -E docker compose -f docker-compose.yml --env-file .env down --remove-orphans 2>/dev/null || true
    # Also remove containers by name in case docker-compose didn't work
    sudo docker rm -f xrisk-app xrisk-worker xrisk-postgres xrisk-redis 2>/dev/null || true
    
    # Build images (explicitly rebuild worker to ensure Dockerfile.worker changes are applied)
    echo "Building Docker images..."
    echo "Building worker image with updated Dockerfile.worker..."
    # Use sudo -E to preserve environment variables, and docker-compose will also load .env file
    sudo -E docker compose -f docker-compose.yml --env-file .env build worker
    echo "Building other images (if needed)..."
    sudo -E docker compose -f docker-compose.yml --env-file .env build
    
    # Start containers
    echo "Starting containers..."
    # Use sudo -E to preserve environment variables, and docker-compose will also load .env file
    # This ensures REDIS_PASSWORD and other secrets are available when containers start
    sudo -E docker compose -f docker-compose.yml --env-file .env up -d
    
    # Wait for services to be healthy
    echo "Waiting for services to start..."
    sleep 10
    
    # Debug PostgreSQL password issue
    echo ""
    echo "=========================================="
    echo "  Debugging PostgreSQL Connection"
    echo "=========================================="
    echo ""
    
    if sudo docker ps | grep -q xrisk-postgres; then
        echo "✅ PostgreSQL container is running"
        
        # Check if PostgreSQL is ready
        if sudo docker exec xrisk-postgres pg_isready -U "${POSTGRES_USER:-xrisk}" >/dev/null 2>&1; then
            echo "✅ PostgreSQL is ready"
            
            # Try to connect with current password
            echo "Testing connection with POSTGRES_PASSWORD from environment..."
            if sudo docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" xrisk-postgres psql -U "${POSTGRES_USER:-xrisk}" -d "${POSTGRES_DB:-xrisk}" -c "SELECT 1;" >/dev/null 2>&1; then
                echo "✅ Connection successful with POSTGRES_PASSWORD"
            else
                echo "❌ Connection FAILED with POSTGRES_PASSWORD"
                echo ""
                echo "Password mismatch detected. Attempting to update password automatically..."
                
                # Try to update password as postgres superuser
                # First, try without password (if postgres user has no password set)
                echo "Attempting to update password..."
                UPDATE_OUTPUT=$(sudo docker exec xrisk-postgres psql -U postgres -d postgres -c "ALTER USER \"${POSTGRES_USER:-xrisk}\" WITH PASSWORD '${POSTGRES_PASSWORD}';" 2>&1)
                UPDATE_EXIT_CODE=$?
                
                if [ $UPDATE_EXIT_CODE -eq 0 ]; then
                    echo "✅ Password updated successfully"
                    
                    # Verify the update worked
                    sleep 2
                    if sudo docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" xrisk-postgres psql -U "${POSTGRES_USER:-xrisk}" -d "${POSTGRES_DB:-xrisk}" -c "SELECT 1;" >/dev/null 2>&1; then
                        echo "✅ Password verification successful - connection works now"
                        echo "Restarting app container to apply changes..."
                        sudo docker restart xrisk-app || echo "⚠️  Could not restart app container automatically"
                    else
                        echo "⚠️  Password updated but verification failed"
                        echo "   Update output: $UPDATE_OUTPUT"
                    fi
                else
                    echo "⚠️  Could not update password automatically"
                    echo "   Error: $UPDATE_OUTPUT"
                    echo ""
                    echo "Manual fix required:"
                    echo "   sudo docker exec -it xrisk-postgres psql -U postgres -c \"ALTER USER ${POSTGRES_USER:-xrisk} WITH PASSWORD '${POSTGRES_PASSWORD}';\""
                    echo ""
                    echo "Then restart the app container:"
                    echo "   sudo docker restart xrisk-app"
                fi
            fi
        else
            echo "⚠️  PostgreSQL is not ready yet"
        fi
    else
        echo "❌ PostgreSQL container is not running"
        echo "Checking PostgreSQL logs..."
        sudo docker logs xrisk-postgres --tail=20 2>&1 || echo "Could not get PostgreSQL logs"
    fi
    echo ""
    
    # Show status
    echo "Container Status:"
    sudo -E docker compose -f docker-compose.yml --env-file .env ps
    
    echo ""
    echo "Logs (last 20 lines):"
    sudo -E docker compose -f docker-compose.yml --env-file .env logs --tail=20
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
echo "View logs: ssh $SSH_TARGET 'cd ~/xrisk/backend && sudo docker compose -f docker-compose.yml logs -f'"
echo "Stop:      ssh $SSH_TARGET 'cd ~/xrisk/backend && sudo docker compose -f docker-compose.yml down'"
echo "Restart:   ssh $SSH_TARGET 'cd ~/xrisk/backend && sudo docker compose -f docker-compose.yml restart'"
echo ""

