"""
xrisk - Konfiguration
Author: Manuel Schott
"""

import os
import logging
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load secrets from Azure Key Vault or .env.local FIRST (before loading .env)
# This ensures secrets are available when config.py reads environment variables
try:
    from .secret_loader import load_all_secrets, apply_secrets_to_environment
    secrets = load_all_secrets()
    apply_secrets_to_environment(secrets, override_existing=False)
    print(f"Loaded {len(secrets)} secrets from secure sources (Key Vault/.env.local)")
except Exception as e:
    print(f"Warning: Could not load secrets from secure sources: {e}")
    print("Continuing with .env and environment variables only")

project_root = Path(__file__).parent.parent
env_default = project_root / '.env'
env_local = project_root / '.env.local'

if env_default.exists():
    load_dotenv(env_default)
    print(f"Loaded base configuration from .env")
else:
    print("No .env file found")

# Note: .env.local is already loaded by secret_loader, but we load it again
# with dotenv to ensure compatibility (dotenv handles quotes and escaping)
if env_local.exists():
    load_dotenv(env_local, override=True)
    print(f"Loaded secrets from .env.local (overrides .env)")
else:
    print("No .env.local file found (using .env values or environment variables)")

logger = logging.getLogger('config')
logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

logger.propagate = False

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    _db_url = os.environ.get('DATABASE_URL', '').strip()
    
    logger.info(f"Environment check - DATABASE_URL present: {bool(_db_url)}")
    
    if _db_url:
        SQLALCHEMY_DATABASE_URI = _db_url
        logger.info(f"Database Config: Using DATABASE_URL (length: {len(_db_url)} chars)")
    else:
        logger.error("CRITICAL: No database connection string found!")
        logger.error("Set DATABASE_URL environment variable")
        raise ValueError("No database connection configured")
    
    if SQLALCHEMY_DATABASE_URI:
        _safe_uri = SQLALCHEMY_DATABASE_URI.split('@')[1] if '@' in SQLALCHEMY_DATABASE_URI else 'invalid-format'
        logger.info(f"Database Host: {_safe_uri}")
        logger.info(f"Database URL format valid: {SQLALCHEMY_DATABASE_URI.startswith('postgresql://')}")
    else:
        logger.error("CRITICAL: SQLALCHEMY_DATABASE_URI is empty after configuration!")
        raise ValueError("SQLALCHEMY_DATABASE_URI is None")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 5,
        'max_overflow': 10,
        'connect_args': {
            'connect_timeout': 10,
            'options': '-c statement_timeout=30000'
        }
    }
    
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    
    LOG_DIR = os.environ.get('LOG_DIR', '/app/logs')
    
    logger.info(f"Log directory configured: {LOG_DIR}")
    print(f"LOG_DIR configured: {LOG_DIR}")
    
    MCP_BASE_URL = os.environ.get('MCP_BASE_URL', 'http://127.0.0.1:8000/mcp')
    MCP_STORE_TIMEOUT = int(os.environ.get('MCP_STORE_TIMEOUT', '10'))
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    
    # Celery Configuration
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
    CELERY_TASK_TRACK_STARTED = True
    CELERY_TASK_TIME_LIMIT = 1800  # 30 minutes max per task
    CELERY_RESULT_EXPIRES = 3600  # Results expire after 1 hour
    
    OPENAI_MODEL = os.environ.get('OPENAI_MODEL') or 'gpt-5'
    OPENAI_SERVICE_TIER = os.environ.get('OPENAI_SERVICE_TIER') or 'flex'
    OPENAI_TEMPERATURE = float(os.environ.get('OPENAI_TEMPERATURE', '0.7'))
    OPENAI_MAX_TOKENS = int(os.environ.get('OPENAI_MAX_TOKENS', '1000'))
    
    AGENT_MODELS = {
        'validation': os.environ.get('VALIDATION_MODEL') or 'gpt-5',
        'classification': os.environ.get('CLASSIFICATION_MODEL') or 'gpt-5',
        'inquiry': os.environ.get('INQUIRY_MODEL') or 'gpt-5',
        'research': os.environ.get('RESEARCH_MODEL') or 'gpt-5',
        'research_current': os.environ.get('RESEARCH_CURRENT_MODEL') or 'gpt-5',
        'research_historical': os.environ.get('RESEARCH_HISTORICAL_MODEL') or 'gpt-5',
        'research_regulatory': os.environ.get('RESEARCH_REGULATORY_MODEL') or 'gpt-5',
        'analysis': os.environ.get('ANALYSIS_MODEL') or 'gpt-4o-mini',
        'report': os.environ.get('REPORT_MODEL') or 'gpt-4o-mini',
        'combined_analysis_report': os.environ.get('COMBINED_ANALYSIS_REPORT_MODEL') or 'gpt-4o-mini'
    }
    
    AGENT_TEMPERATURES = {
        'validation': float(os.environ.get('VALIDATION_TEMPERATURE', '0.3')),
        'classification': float(os.environ.get('CLASSIFICATION_TEMPERATURE', '0.2')),
        'inquiry': float(os.environ.get('INQUIRY_TEMPERATURE', '0.5')),
        'research': float(os.environ.get('RESEARCH_TEMPERATURE', '0.4')),
        'research_current': float(os.environ.get('RESEARCH_CURRENT_TEMPERATURE', '0.4')),
        'research_historical': float(os.environ.get('RESEARCH_HISTORICAL_TEMPERATURE', '0.3')),
        'research_regulatory': float(os.environ.get('RESEARCH_REGULATORY_TEMPERATURE', '0.3')),
        'analysis': float(os.environ.get('ANALYSIS_TEMPERATURE', '0.6')),
        'report': float(os.environ.get('REPORT_TEMPERATURE', '0.7')),
        'combined_analysis_report': float(os.environ.get('COMBINED_ANALYSIS_REPORT_TEMPERATURE', '0.65'))
    }
    
    AGENT_MAX_TOKENS = {
        'validation': int(os.environ.get('VALIDATION_MAX_TOKENS', '500')),
        'classification': int(os.environ.get('CLASSIFICATION_MAX_TOKENS', '100')),
        'inquiry': int(os.environ.get('INQUIRY_MAX_TOKENS', '3000')),
        'research': int(os.environ.get('RESEARCH_MAX_TOKENS', '3000')),
        'research_current': int(os.environ.get('RESEARCH_CURRENT_MAX_TOKENS', '3000')),
        'research_historical': int(os.environ.get('RESEARCH_HISTORICAL_MAX_TOKENS', '3000')),
        'research_regulatory': int(os.environ.get('RESEARCH_REGULATORY_MAX_TOKENS', '3000')),
        'analysis': int(os.environ.get('ANALYSIS_MAX_TOKENS', '4000')),
        'report': int(os.environ.get('REPORT_MAX_TOKENS', '4000')),
        'combined_analysis_report': int(os.environ.get('COMBINED_ANALYSIS_REPORT_MAX_TOKENS', '6000'))
    }
    
    
    # Agent-specific service tier (flex) configuration
    # Controls whether each agent should try the flex model first
    AGENT_USE_FLEX = {
        'validation': os.environ.get('VALIDATION_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'classification': os.environ.get('CLASSIFICATION_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'inquiry': os.environ.get('INQUIRY_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'research': os.environ.get('RESEARCH_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'research_current': os.environ.get('RESEARCH_CURRENT_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'research_historical': os.environ.get('RESEARCH_HISTORICAL_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'research_regulatory': os.environ.get('RESEARCH_REGULATORY_USE_FLEX', 'true').lower() in ('true', '1', 'yes', 'on'),
        'analysis': os.environ.get('ANALYSIS_USE_FLEX', 'false').lower() in ('true', '1', 'yes', 'on'),
        'report': os.environ.get('REPORT_USE_FLEX', 'false').lower() in ('true', '1', 'yes', 'on'),
        'combined_analysis_report': os.environ.get('COMBINED_ANALYSIS_REPORT_USE_FLEX', 'false').lower() in ('true', '1', 'yes', 'on')
    }
    
    DEBUG_ENABLED = os.environ.get('DEBUG_ENABLED', 'False').lower() in ('true', '1', 'yes', 'on')
    
    API_ENDPOINTS = [
        {'name': 'Risk Validation', 'endpoint': '/risk/validate'},
        {'name': 'Risk Classification', 'endpoint': '/risk/classification'},
        {'name': 'Risk Inquiry', 'endpoint': '/risk/inquiry'},
        {'name': 'Risk Research', 'endpoint': '/risk/research'},
        {'name': 'Risk Analysis', 'endpoint': '/risk/analysis'},
        {'name': 'Risk Report', 'endpoint': '/risk/report'},
        {'name': 'MCP Server Info', 'endpoint': '/mcp/info'},
        {'name': 'MCP Store Context', 'endpoint': '/mcp/context/{table}/store'},
        {'name': 'MCP Search Context', 'endpoint': '/mcp/context/search'},
        {'name': 'MCP List Tags', 'endpoint': '/mcp/tags'},
        {'name': 'MCP Statistics', 'endpoint': '/mcp/stats'}
    ]
    
    # Email Configuration for admin notifications
    # Falls back to MAIL_* configuration if SMTP_* not set (use same email account)
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'manuel.schott@adesso.de')
    SMTP_SERVER = os.environ.get('SMTP_SERVER', os.environ.get('MAIL_SERVER', 'smtp.gmail.com'))
    SMTP_PORT = int(os.environ.get('SMTP_PORT', os.environ.get('MAIL_PORT', '587')))
    SMTP_USER = os.environ.get('SMTP_USER', os.environ.get('MAIL_USERNAME'))
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', os.environ.get('MAIL_PASSWORD'))
    
    # Automatic Retry Configuration
    RETRY_CHECK_INTERVAL = int(os.environ.get('RETRY_CHECK_INTERVAL', '300'))  # 5 minutes default
    RETRY_MAX_ATTEMPTS = int(os.environ.get('RETRY_MAX_ATTEMPTS', '3'))  # 3 retries default
    
    # Small Risk Threshold Configuration
    # Risks with insurance value <= this amount (in EUR) are considered "small risks"
    # Small risks skip research and use combined analysis/report agent
    SMALL_RISK_THRESHOLD_EUR = float(os.environ.get('SMALL_RISK_THRESHOLD_EUR', '1000.0'))
    
    # OAuth Configuration
    # Google OAuth - Get credentials from https://console.cloud.google.com/
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    
    # Microsoft OAuth - Get credentials from https://portal.azure.com/
    MICROSOFT_CLIENT_ID = os.environ.get('MICROSOFT_CLIENT_ID')
    MICROSOFT_CLIENT_SECRET = os.environ.get('MICROSOFT_CLIENT_SECRET')
    MICROSOFT_TENANT_ID = os.environ.get('MICROSOFT_TENANT_ID', 'common')  # 'common' for multi-tenant
    
    # OAuth Configuration for Authlib
    OAUTH_CREDENTIALS = {
        'google': {
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'server_metadata_url': 'https://accounts.google.com/.well-known/openid-configuration',
            'client_kwargs': {
                'scope': 'openid email profile'
            }
        },
        'microsoft': {
            'client_id': MICROSOFT_CLIENT_ID,
            'client_secret': MICROSOFT_CLIENT_SECRET,
            'server_metadata_url': f'https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration',
            'client_kwargs': {
                'scope': 'openid email profile',
                'prompt': 'select_account'
            },
            # Allow multiple issuers for both Azure AD and personal Microsoft accounts
            'id_token_claims_options': {
                'iss': {
                    'values': [
                        f'https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/v2.0',
                        'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0'  # Consumers tenant for personal accounts
                    ]
                }
            }
        }
    }
    
    # Email Configuration for verification and password reset
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', '587'))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() in ('true', '1', 'yes')
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'False').lower() in ('true', '1', 'yes')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', MAIL_USERNAME)
    
    # App URL for OAuth redirect URIs and email links
    # Automatically built from DOMAIN_NAME (can be overridden with APP_URL in .env.local for local dev)
    DOMAIN_NAME = os.environ.get('DOMAIN_NAME', 'localhost:8000')
    APP_URL = os.environ.get('APP_URL') or f'https://{DOMAIN_NAME}'
    
    # API Domain - REST API should only be accessible via api subdomain
    API_DOMAIN = os.environ.get('API_DOMAIN', f'api.{DOMAIN_NAME}' if 'localhost' not in DOMAIN_NAME else 'localhost:8000')
    
    # Frontend/Login redirect URL for browser-based redirects (e.g., email verification)
    # Defaults to APP_URL if not set
    FRONTEND_URL = os.environ.get('FRONTEND_URL') or APP_URL
    
    # Frontend route for workflow resume (e.g., / for the main page)
    # Defaults to / if not set
    FRONTEND_RESUME_ROUTE = os.environ.get('FRONTEND_RESUME_ROUTE', '/')
    
    # Session Cookie Configuration - Critical for OAuth to work properly
    # OAuth requires session cookies to store the CSRF state between redirect and callback
    # Detect if running over HTTPS to set SESSION_COOKIE_SECURE appropriately
    # In production (HTTPS), set to True. In development (HTTP), set to False.
    _is_https = os.environ.get('HTTPS_ENABLED', 'True').lower() in ('true', '1', 'yes', 'on')
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', str(_is_https)).lower() in ('true', '1', 'yes', 'on')
    SESSION_COOKIE_HTTPONLY = True  # Always HTTP-only for security
    SESSION_COOKIE_NAME = 'xrisk_session'
    SESSION_COOKIE_PATH = '/'
    
    # Cookie Domain: Set to .xrisk.info to allow sharing between xrisk.info and api.xrisk.info
    # For localhost, leave empty (None) so cookies work on localhost
    _domain_name = os.environ.get('DOMAIN_NAME', 'localhost:8000')
    if 'localhost' in _domain_name or '127.0.0.1' in _domain_name:
        SESSION_COOKIE_DOMAIN = None  # No domain restriction for localhost
        # SameSite=Lax works fine for localhost (same-origin)
        SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')
    else:
        # Extract domain without port (e.g., 'xrisk.info' from 'xrisk.info:8000')
        domain_without_port = _domain_name.split(':')[0]
        # Set cookie domain to .domain to allow subdomains
        SESSION_COOKIE_DOMAIN = f'.{domain_without_port}'
        # SameSite=None is required for cross-origin requests between subdomains (xrisk.info <-> api.xrisk.info)
        # But only works with Secure=True (HTTPS)
        if SESSION_COOKIE_SECURE:
            SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'None')
        else:
            # If not secure, fall back to Lax (but this won't work for cross-subdomain)
            SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')
    
    EMAIL_VERIFICATION_TOKEN_EXPIRY = int(os.environ.get('EMAIL_VERIFICATION_TOKEN_EXPIRY', '86400'))
    PASSWORD_RESET_TOKEN_EXPIRY = int(os.environ.get('PASSWORD_RESET_TOKEN_EXPIRY', '3600'))  # 1 hour
    
    # CORS Configuration
    # Comma-separated list of allowed origins
    # Example: "https://xrisk.info,https://www.xrisk.info"
    _cors_origins_str = os.environ.get('CORS_ORIGINS', '*')
    CORS_ORIGINS = [origin.strip() for origin in _cors_origins_str.split(',')] if _cors_origins_str != '*' else ['*']