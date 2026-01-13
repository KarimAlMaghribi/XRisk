"""
Author: Manuel Schott
"""

# Standard library imports
import uuid
import json
import logging
import os
import sys
from datetime import datetime
from functools import wraps

# Third-party imports
from flask import Flask, request, jsonify, render_template, abort, session, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, current_user
from dotenv import load_dotenv

load_dotenv()

if os.path.exists('.env.local'):
    load_dotenv('.env.local')

from logging_config import setup_logger

log_dir = os.environ.get('LOG_DIR')

if not log_dir:
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    
    for logger_name in ['application', 'OpenAI_API', 'celery', 'mcp_server']:
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.INFO)
        logger.handlers.clear()
        logger.addHandler(console_handler)
        logger.propagate = False
        logger.warning(f"LOG_DIR not set, {logger_name} logging to console only")
    
    app_logger = logging.getLogger('application')
else:
    app_logger = setup_logger('application', 'app.log', log_dir)
    openai_logger = setup_logger('OpenAI_API', 'openai_api.log', log_dir)
    celery_logger = setup_logger('celery', 'celery.log', log_dir)
    mcp_logger = setup_logger('mcp_server', 'mcp_server.log', log_dir)

server_dir = os.path.dirname(__file__)
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

from config import Config

debug_enabled = Config.DEBUG_ENABLED
if debug_enabled:
    app_logger.setLevel(logging.DEBUG)
    if not log_dir:
        console_handler.setLevel(logging.DEBUG)
    app_logger.info("=== xrisk Application Starting in DEBUG MODE ===")
else:
    app_logger.setLevel(logging.INFO)
    if not log_dir:
        console_handler.setLevel(logging.INFO)
    app_logger.info("=== xrisk Application Starting ===")

app_logger.info(f"Log Directory: {log_dir if log_dir else 'None (console only)'}")
app_logger.info(f"Log Level: {'DEBUG' if debug_enabled else 'INFO'}")
if log_dir:
    openai_logger.info(f"OpenAI API Logger - file logging enabled: {os.path.join(log_dir, 'openai_api.log')}")
else:
    openai_logger.info("OpenAI API Logger - console logging only")
app_logger.info(f"Flask App initializing...")

app = Flask(__name__, 
           template_folder='../templates',
           static_folder='../static')

app.config.from_object(Config)

app.config['SESSION_COOKIE_SECURE'] = Config.SESSION_COOKIE_SECURE
app.config['SESSION_COOKIE_HTTPONLY'] = Config.SESSION_COOKIE_HTTPONLY
app.config['SESSION_COOKIE_SAMESITE'] = Config.SESSION_COOKIE_SAMESITE
app.config['SESSION_COOKIE_NAME'] = Config.SESSION_COOKIE_NAME
app.config['SESSION_COOKIE_PATH'] = Config.SESSION_COOKIE_PATH
app.config['SESSION_COOKIE_DOMAIN'] = Config.SESSION_COOKIE_DOMAIN

app_logger.info(f"Flask session configured: name={Config.SESSION_COOKIE_NAME}, secure={Config.SESSION_COOKIE_SECURE}, samesite={Config.SESSION_COOKIE_SAMESITE}, domain={Config.SESSION_COOKIE_DOMAIN}")

app_logger.info("Flask App configuration loaded")

from models import db, RiskAssessment, User
from mcp_server import mcp_bp
from workflow_routes import workflow_bp
from workflow_events import workflow_events_bp
from auth import auth_bp, oauth
from email_service import email_service
from rest import rest_bp

if Config.DEBUG_ENABLED:
    from debug import debug_bp

# Configure CORS with explicit settings
app_logger.info(f"Configuring CORS with origins: {Config.CORS_ORIGINS}")
CORS(app, 
     origins=Config.CORS_ORIGINS, 
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
     expose_headers=['Content-Type', 'Authorization'],
     always_send=True)  # Always send CORS headers, even for non-CORS requests
app_logger.info("CORS configured successfully")

app_logger.info("Database initializing...")
db.init_app(app)

# Test database connection with detailed error logging
try:
    with app.app_context():
        # Try to connect to the database
        from sqlalchemy import text
        app_logger.info("Testing database connection...")
        
        # Extract connection details for logging
        db_url = app.config['SQLALCHEMY_DATABASE_URI']
        if '@' in db_url and '://' in db_url:
            auth_part = db_url.split('://')[1].split('@')[0]
            if ':' in auth_part:
                username, password = auth_part.split(':', 1)
                # Remove surrounding quotes if present
                if password.startswith('"') and password.endswith('"'):
                    password = password[1:-1]
                    app_logger.warning("DEBUG: Removed quotes from password in connection test")
                elif password.startswith("'") and password.endswith("'"):
                    password = password[1:-1]
                    app_logger.warning("DEBUG: Removed single quotes from password in connection test")
                
                app_logger.info(f"DEBUG: Attempting connection with user: {username}")
                if password:
                    app_logger.info(f"DEBUG: Password length: {len(password)}")
                else:
                    app_logger.warning("DEBUG: Password is empty!")
        
        # Try a simple query
        result = db.session.execute(text("SELECT 1"))
        result.fetchone()
        app_logger.info("✅ Database connection test successful")
except Exception as e:
    error_msg = str(e)
    app_logger.error(f"❌ Database connection test FAILED: {error_msg}")
    
    # Log detailed error information
    if "password authentication failed" in error_msg.lower():
        app_logger.error("Password authentication failed - checking password configuration...")
        postgres_password = os.environ.get('POSTGRES_PASSWORD', '').strip()
        if postgres_password:
            app_logger.info(f"DEBUG: POSTGRES_PASSWORD env var exists, length: {len(postgres_password)}")
        else:
            app_logger.error("DEBUG: POSTGRES_PASSWORD environment variable is empty or not set!")
        
        # Check DATABASE_URL
        db_url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        if '@' in db_url and '://' in db_url:
            auth_part = db_url.split('://')[1].split('@')[0]
            if ':' in auth_part:
                username, password = auth_part.split(':', 1)
                app_logger.info(f"DEBUG: DATABASE_URL contains user: {username}, password length: {len(password)}")
                if not password:
                    app_logger.error("DEBUG: DATABASE_URL password is empty!")
    
    # Don't raise - let the app continue so we can see more logs
    app_logger.warning("Continuing despite connection test failure - error may occur later")

app_logger.info("Database initialized")

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Bitte melden Sie sich an, um auf diese Seite zuzugreifen.'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    """Handle unauthorized access - return JSON for API requests, redirect for browser requests"""
    is_api_request = request.headers.get('Accept', '').startswith('application/json') or \
                     request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if is_api_request:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Bitte melden Sie sich an, um auf diese Seite zuzugreifen.',
            'login_required': True
        }), 401
    
    return redirect('/')

@app.before_request
def configure_session():
    """Configure session to be non-permanent (session cookie, ends when browser closes)"""
    try:
        if session.permanent is not False:
            session.permanent = False
    except Exception:
        pass

@app.before_request
def log_cors_info():
    """Log CORS information for debugging"""
    if request.method == 'OPTIONS' or request.headers.get('Origin'):
        origin = request.headers.get('Origin', 'No Origin header')
        app_logger.info(f"CORS Request - Method: {request.method}, Origin: {origin}, Path: {request.path}, Host: {request.host}")

@app.before_request
def enforce_api_subdomain():
    """Enforce that REST API routes are only accessible via api.xrisk.info subdomain"""
    # Allow OPTIONS requests for CORS preflight - these must always pass through
    if request.method == 'OPTIONS':
        return None
    
    if request.path.startswith('/debug'):
        return None
    
    if request.path.startswith('/login/google') or request.path.startswith('/login/microsoft'):
        return None
    
    api_route_prefixes = ['/workflow', '/mcp', '/api/user']
    api_routes = ['/health', '/login', '/register', '/logout']
    
    is_api_route = False
    for prefix in api_route_prefixes:
        if request.path.startswith(prefix):
            is_api_route = True
            break
    if not is_api_route:
        for route in api_routes:
            if request.path == route:
                is_api_route = True
                break
    
    if is_api_route:
        host = request.host.lower()
        host_without_port = host.split(':')[0]
        expected_api_host = Config.API_DOMAIN.lower().split(':')[0]
        
        # Allow localhost for development
        if 'localhost' in host_without_port or '127.0.0.1' in host_without_port:
            return None
        
        # Check if request is coming from allowed origin (CORS request)
        origin = request.headers.get('Origin', '')
        if origin:
            # Extract domain from origin (e.g., "https://xrisk.info" -> "xrisk.info")
            origin_domain = origin.replace('https://', '').replace('http://', '').split(':')[0]
            # Allow if origin is in CORS_ORIGINS list
            if any(origin_domain in allowed_origin.replace('https://', '').replace('http://', '') for allowed_origin in Config.CORS_ORIGINS):
                app_logger.debug(f"Allowing CORS request from {origin} to API route {request.path}")
                return None
        
        # Enforce API subdomain for direct requests (non-CORS)
        if not (host_without_port.startswith('api.') or host_without_port == expected_api_host):
            app_logger.warning(f"API route '{request.path}' accessed via wrong domain: {host} (expected: {expected_api_host} or api.*)")
            return jsonify({
                'error': 'Forbidden',
                'message': 'REST API is only accessible via api.xrisk.info',
                'requested_path': request.path,
                'requested_host': host
            }), 403
    
    return None

def cleanup_cookie_variants(response, cookie_name):
    """
    Clean up all variants of a cookie with different SameSite/Domain/Path values.
    This ensures only one cookie with the correct parameters exists.
    """
    try:
        # Try to delete cookie with all possible SameSite/Domain/Path combinations
        samesite_values = ['Lax', 'None', 'Strict']
        domain_values = [None, Config.SESSION_COOKIE_DOMAIN]
        path_values = ['/', None]
        
        for samesite in samesite_values:
            for domain in domain_values:
                for path in path_values:
                    try:
                        response.set_cookie(
                            cookie_name,
                            '',
                            expires=0,
                            path=path or '/',
                            domain=domain,
                            secure=Config.SESSION_COOKIE_SECURE,
                            httponly=True,
                            samesite=samesite
                        )
                    except Exception:
                        pass
    except Exception:
        pass

@app.after_request
def cleanup_old_session_cookie(response):
    """
    Remove old 'session' cookie if it exists (cleanup for migration from old cookie name).
    Don't touch xrisk_session cookies here - cleanup is handled during login only.
    """
    try:
        if 'session' in request.cookies and request.cookies['session']:
            cleanup_cookie_variants(response, 'session')
    except Exception:
        pass
    
    # Ensure CORS headers are set even for error responses and preflight requests
    # Flask-CORS should handle this, but we ensure it's done
    origin = request.headers.get('Origin')
    if origin:
        # Check if origin is in allowed origins (support wildcard)
        origin_allowed = False
        if '*' in Config.CORS_ORIGINS:
            origin_allowed = True
        elif origin in Config.CORS_ORIGINS:
            origin_allowed = True
        elif any(origin_domain in origin.replace('https://', '').replace('http://', '') for origin_domain in [o.replace('https://', '').replace('http://', '') for o in Config.CORS_ORIGINS]):
            origin_allowed = True
        
        if origin_allowed:
            if 'Access-Control-Allow-Origin' not in response.headers:
                response.headers['Access-Control-Allow-Origin'] = origin
            if 'Access-Control-Allow-Credentials' not in response.headers:
                response.headers['Access-Control-Allow-Credentials'] = 'true'
            # Ensure Access-Control-Allow-Headers is set for preflight requests
            # Include both capitalized and lowercase versions to handle browser differences
            if 'Access-Control-Allow-Headers' not in response.headers:
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, content-type, Authorization, authorization, X-Requested-With, x-requested-with'
            # Ensure Access-Control-Allow-Methods is set for preflight requests
            if 'Access-Control-Allow-Methods' not in response.headers:
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    
    return response

oauth.init_app(app)

if Config.GOOGLE_CLIENT_ID and Config.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=Config.GOOGLE_CLIENT_ID,
        client_secret=Config.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )
    app_logger.info("Google OAuth configured")
else:
    app_logger.warning("Google OAuth credentials not configured")

if Config.MICROSOFT_CLIENT_ID and Config.MICROSOFT_CLIENT_SECRET:
    oauth.register(
        name='microsoft',
        client_id=Config.MICROSOFT_CLIENT_ID,
        client_secret=Config.MICROSOFT_CLIENT_SECRET,
        server_metadata_url=f'https://login.microsoftonline.com/{Config.MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )
    app_logger.info("Microsoft OAuth configured")
else:
    app_logger.warning("Microsoft OAuth credentials not configured")

email_service.init_app(app)
app_logger.info("Email service initialized")

app_logger.info("Registering blueprints...")
app.register_blueprint(rest_bp)
app.register_blueprint(mcp_bp)
app.register_blueprint(workflow_bp)
app.register_blueprint(workflow_events_bp)
app.register_blueprint(auth_bp)

# Register debug blueprint only if DEBUG_ENABLED is True
if Config.DEBUG_ENABLED:
    app.register_blueprint(debug_bp)
    app_logger.info("Debug routes registered (DEBUG_ENABLED=True)")
else:
    app_logger.info("Debug routes disabled (DEBUG_ENABLED=False)")

if debug_enabled:
    try:
        from flasgger import Swagger
        
        swagger_config = {
            "headers": [],
            "specs": [
                {
                    "endpoint": "apispec",
                    "route": "/apispec.json",
                    "rule_filter": lambda rule: True,
                    "model_filter": lambda tag: True,
                }
            ],
            "static_url_path": "/flasgger_static",
            "swagger_ui": True,
            "specs_route": "/api-docs"
        }
        
        swagger_template = {
            "swagger": "2.0",
            "info": {
                "title": "xrisk API",
                "description": "API-Dokumentation für die xrisk Risikotransferplattform-API",
                "version": "1.0.0",
                "contact": {
                    "name": "xrisk API Support"
                }
            },
            "basePath": "/",
            "schemes": ["http", "https"],
            "tags": [
                {
                    'name': 'Workflow',
                    'description': 'Workflow-Management der KI-Agenten für neue Risikoeingaben'
                },
                {
                    'name': 'MCP',
                    'description': 'Message Context Protocol - Kontextverwaltung für KI-Agenten'
                },
                {
                    'name': 'Auth',
                    'description': 'Authentifizierung und Benutzerverwaltung'
                },
                {
                    'name': 'Health',
                    'description': 'System-Status / Health Checks'
                }
            ]
        }
        
        swagger = Swagger(app, config=swagger_config, template=swagger_template)
        app_logger.info("Swagger API documentation initialized at /api-docs (DEBUG mode only)")
    except ImportError:
        app_logger.warning("flasgger not installed - API documentation endpoints disabled")
else:
    app_logger.info("Swagger API documentation disabled (DEBUG_ENABLED=False)")

mcp_logger.info("MCP Server blueprint registered and logging configured")

def require_debug_enabled(f):
    """Decorator to protect routes that should only be accessible when DEBUG_ENABLED is True"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        debug_enabled = app.config.get('DEBUG_ENABLED', False)
        if not debug_enabled:
            app_logger.warning(f"Access denied to route '{request.path}' - DEBUG_ENABLED is False")
            abort(404)
        app_logger.debug(f"Access granted to route '{request.path}' - DEBUG_ENABLED is True")
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    """Landing page about existential risks"""
    return render_template('index.html')

@app.route('/dist/<path:filename>')
def dist_files(filename):
    """Serve files from static/ directory via /dist/ URL path (for backwards compatibility)"""
    import os
    from flask import send_from_directory
    
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
    file_path = os.path.join(static_dir, filename)
    
    if not os.path.commonpath([static_dir, file_path]) == static_dir:
        abort(403)
    
    if os.path.exists(file_path) and os.path.isfile(file_path):
        response = send_from_directory(static_dir, filename)
        
        if filename.endswith('.js'):
            response.mimetype = 'application/javascript'
        elif filename.endswith('.mjs'):
            response.mimetype = 'application/javascript'
        elif filename.endswith('.js.map'):
            response.mimetype = 'application/json'
        elif filename.endswith('.d.ts'):
            response.mimetype = 'application/typescript'
        elif filename.endswith('.ts'):
            response.mimetype = 'application/typescript'
        
        return response
    
    frontend_dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'dist')
    frontend_file_path = os.path.join(frontend_dist_dir, filename)
    
    if os.path.exists(frontend_file_path) and os.path.isfile(frontend_file_path):
        response = send_from_directory(frontend_dist_dir, filename)
        
        if filename.endswith('.js'):
            response.mimetype = 'application/javascript'
        elif filename.endswith('.mjs'):
            response.mimetype = 'application/javascript'
        elif filename.endswith('.js.map'):
            response.mimetype = 'application/json'
        elif filename.endswith('.d.ts'):
            response.mimetype = 'application/typescript'
        elif filename.endswith('.ts'):
            response.mimetype = 'application/typescript'
        
        return response
    
    abort(404, description=f"File {filename} not found. Please run 'cd frontend && npm run build'")

@app.route('/offer')
def offer_calculator():
    """Risk premium calculator (temporary page)"""
    return render_template('offer.html')

# Debug routes moved to debug.py - only registered if DEBUG_ENABLED=True

# REST API routes moved to rest.py

@app.route('/debug-status')
def debug_status():
    """Check if debug routes are enabled (for testing purposes)"""
    return jsonify({
        'debug_enabled': app.config.get('DEBUG_ENABLED', False),
        'message': 'Debug routes are ' + ('enabled' if app.config.get('DEBUG_ENABLED', False) else 'disabled')
    })

# Context routes moved to debug.py

def create_app():
    """Application factory for production use"""
    app_logger.info("create_app() called - initializing database tables...")
    
    with app.app_context():
        # Test database connection before creating tables
        try:
            from sqlalchemy import text
            app_logger.info("Testing database connection in create_app()...")
            
            # Extract and log password details
            db_url = app.config['SQLALCHEMY_DATABASE_URI']
            if '@' in db_url and '://' in db_url:
                auth_part = db_url.split('://')[1].split('@')[0]
                if ':' in auth_part:
                    username, password = auth_part.split(':', 1)
                    # Remove surrounding quotes if present
                    if password.startswith('"') and password.endswith('"'):
                        password = password[1:-1]
                        app_logger.warning("DEBUG create_app: Removed quotes from password")
                    elif password.startswith("'") and password.endswith("'"):
                        password = password[1:-1]
                        app_logger.warning("DEBUG create_app: Removed single quotes from password")
                    
                    app_logger.info(f"DEBUG create_app: Connecting with user: {username}")
                    if password:
                        app_logger.info(f"DEBUG create_app: Password length: {len(password)}")
                    else:
                        app_logger.error("DEBUG create_app: Password is empty in DATABASE_URL!")
            
            # Test connection
            result = db.session.execute(text("SELECT 1"))
            result.fetchone()
            app_logger.info("✅ Database connection test successful in create_app()")
        except Exception as e:
            error_msg = str(e)
            app_logger.error(f"❌ Database connection test FAILED in create_app(): {error_msg}")
            
            # Log password details for debugging
            postgres_password = os.environ.get('POSTGRES_PASSWORD', '').strip()
            if postgres_password:
                app_logger.info(f"DEBUG create_app: POSTGRES_PASSWORD env var - length: {len(postgres_password)}")
            else:
                app_logger.error("DEBUG create_app: POSTGRES_PASSWORD environment variable is empty!")
            
            # Re-raise the exception so we can see the full error
            raise
        
        db.create_all()
        app_logger.info("Database tables created/verified")
        
        from database_setup import migrate_database
        app_logger.info("Running database migrations...")
        migrate_database()
    
    app_logger.info("=== xrisk Application Ready ===")
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    import warnings
    import logging
    import os
    
    app.run(host='0.0.0.0', port=8000, debug=True)
