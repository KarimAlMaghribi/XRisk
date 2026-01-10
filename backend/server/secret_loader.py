"""
Secret Loader - Secure credential management
Supports Azure Key Vault and local .env.local fallback
Author: Manuel Schott
"""

import os
import logging
from pathlib import Path
from typing import Optional, Dict

logger = logging.getLogger('secret_loader')
logger.setLevel(logging.INFO)

# Try to import Azure Key Vault client
try:
    from azure.keyvault.secrets import SecretClient
    from azure.identity import DefaultAzureCredential
    AZURE_KEYVAULT_AVAILABLE = True
except ImportError:
    AZURE_KEYVAULT_AVAILABLE = False
    logger.warning("Azure Key Vault libraries not installed. Install with: pip install azure-keyvault-secrets azure-identity")


def load_secrets_from_keyvault(keyvault_url: Optional[str] = None) -> Dict[str, str]:
    """
    Load secrets from Azure Key Vault.
    
    Args:
        keyvault_url: URL of the Azure Key Vault (e.g., https://xrisk-kv.vault.azure.net/)
                     If None, reads from AZURE_KEYVAULT_URL environment variable.
    
    Returns:
        Dictionary of secret names and values
    """
    if not AZURE_KEYVAULT_AVAILABLE:
        logger.warning("Azure Key Vault libraries not available, skipping Key Vault")
        return {}
    
    if not keyvault_url:
        keyvault_url = os.environ.get('AZURE_KEYVAULT_URL')
    
    if not keyvault_url:
        logger.info("No Azure Key Vault URL configured, skipping Key Vault")
        return {}
    
    try:
        logger.info(f"Connecting to Azure Key Vault: {keyvault_url}")
        
        # Use DefaultAzureCredential which supports:
        # - Managed Identity (when running on Azure)
        # - Azure CLI credentials (for local development)
        # - Environment variables (AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID)
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=keyvault_url, credential=credential)
        
        # List all secrets and load them
        secrets = {}
        secret_properties = client.list_properties_of_secrets()
        
        for secret_property in secret_properties:
            try:
                secret_name = secret_property.name
                secret_value = client.get_secret(secret_name).value
                # Convert secret name to environment variable format (uppercase, replace hyphens with underscores)
                env_var_name = secret_name.upper().replace('-', '_')
                secrets[env_var_name] = secret_value
                logger.info(f"Loaded secret: {secret_name} -> {env_var_name}")
            except Exception as e:
                logger.warning(f"Failed to load secret {secret_property.name}: {e}")
        
        logger.info(f"Successfully loaded {len(secrets)} secrets from Azure Key Vault")
        return secrets
        
    except Exception as e:
        logger.error(f"Failed to load secrets from Azure Key Vault: {e}")
        logger.info("Falling back to .env.local or environment variables")
        return {}


def load_secrets_from_env_local(env_file_path: Optional[Path] = None) -> Dict[str, str]:
    """
    Load secrets from .env.local file (for local development).
    
    Args:
        env_file_path: Path to .env.local file. If None, uses backend/.env.local
    
    Returns:
        Dictionary of environment variable names and values
    """
    if env_file_path is None:
        project_root = Path(__file__).parent.parent
        env_file_path = project_root / '.env.local'
    
    secrets = {}
    
    if not env_file_path.exists():
        logger.info(f".env.local not found at {env_file_path}, skipping")
        return secrets
    
    try:
        logger.info(f"Loading secrets from {env_file_path}")
        with open(env_file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue
                
                # Parse KEY=VALUE format
                if '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()
                    # Remove quotes if present
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]
                    
                    secrets[key] = value
        
        logger.info(f"Loaded {len(secrets)} secrets from .env.local")
        return secrets
        
    except Exception as e:
        logger.error(f"Failed to load secrets from .env.local: {e}")
        return {}


def load_all_secrets() -> Dict[str, str]:
    """
    Load secrets from all available sources in priority order:
    1. Azure Key Vault (if configured)
    2. .env.local (for local development)
    3. Environment variables (already set)
    
    Returns:
        Dictionary of all loaded secrets
    """
    all_secrets = {}
    
    # Priority 1: Azure Key Vault (for production)
    keyvault_secrets = load_secrets_from_keyvault()
    all_secrets.update(keyvault_secrets)
    
    # Priority 2: .env.local (for local development, overrides Key Vault)
    env_local_secrets = load_secrets_from_env_local()
    all_secrets.update(env_local_secrets)
    
    # Priority 3: Environment variables (already set, highest priority)
    # These are already in os.environ, so we don't need to add them
    
    return all_secrets


def apply_secrets_to_environment(secrets: Dict[str, str], override_existing: bool = False):
    """
    Apply loaded secrets to the environment.
    
    Args:
        secrets: Dictionary of environment variable names and values
        override_existing: If True, override existing environment variables.
                          If False, only set if not already present.
    """
    for key, value in secrets.items():
        if override_existing or key not in os.environ:
            os.environ[key] = value
            logger.debug(f"Set environment variable: {key}")


# Auto-load secrets when module is imported (for convenience)
if __name__ != "__main__":
    # Only auto-load if not already loaded (avoid double loading)
    if not os.environ.get('SECRETS_LOADED'):
        try:
            loaded_secrets = load_all_secrets()
            apply_secrets_to_environment(loaded_secrets, override_existing=False)
            os.environ['SECRETS_LOADED'] = 'true'
        except Exception as e:
            logger.warning(f"Failed to auto-load secrets: {e}")


if __name__ == "__main__":
    # CLI tool for testing secret loading
    import sys
    
    print("=" * 60)
    print("Secret Loader - Test Mode")
    print("=" * 60)
    print()
    
    print("1. Loading secrets from Azure Key Vault...")
    keyvault_secrets = load_secrets_from_keyvault()
    print(f"   Loaded {len(keyvault_secrets)} secrets from Key Vault")
    if keyvault_secrets:
        print("   Secrets:", list(keyvault_secrets.keys()))
    print()
    
    print("2. Loading secrets from .env.local...")
    env_local_secrets = load_secrets_from_env_local()
    print(f"   Loaded {len(env_local_secrets)} secrets from .env.local")
    if env_local_secrets:
        print("   Secrets:", list(env_local_secrets.keys()))
    print()
    
    print("3. All loaded secrets:")
    all_secrets = load_all_secrets()
    print(f"   Total: {len(all_secrets)} secrets")
    if all_secrets:
        for key in sorted(all_secrets.keys()):
            value = all_secrets[key]
            # Mask sensitive values
            if 'password' in key.lower() or 'secret' in key.lower() or 'key' in key.lower():
                masked_value = value[:4] + '*' * (len(value) - 8) + value[-4:] if len(value) > 8 else '****'
                print(f"   {key} = {masked_value}")
            else:
                print(f"   {key} = {value[:50]}..." if len(str(value)) > 50 else f"   {key} = {value}")
