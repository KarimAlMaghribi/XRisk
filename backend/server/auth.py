"""
xrisk - Authentication Routes
Author: Manuel Schott

Handles user authentication, registration, and OAuth
"""

from flask import Blueprint, render_template, redirect, url_for, request, flash, session, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from authlib.integrations.flask_client import OAuth
from models import db, User
from email_service import email_service
from config import Config
import logging
import re
from datetime import datetime, timezone

logger = logging.getLogger('application')

auth_bp = Blueprint('auth', __name__)

# OAuth will be initialized in app.py
oauth = OAuth()

def cleanup_cookie_variants(response, cookie_name=None):
    """
    Clean up all variants of a cookie with different SameSite/Domain/Path values.
    This ensures only one cookie with the correct parameters exists.
    
    Args:
        response: Flask response object
        cookie_name: Name of the cookie to clean up (defaults to SESSION_COOKIE_NAME)
    """
    try:
        from config import Config
        if cookie_name is None:
            cookie_name = Config.SESSION_COOKIE_NAME
        
        if cookie_name not in request.cookies:
            return
        
        samesite_values = ['Lax', 'None', 'Strict']
        domain_values = [None, Config.SESSION_COOKIE_DOMAIN]
        path_values = ['/', None]
        
        for samesite in samesite_values:
            for domain in domain_values:
                for path in path_values:
                    try:
                        if cookie_name == Config.SESSION_COOKIE_NAME:
                            if (samesite == Config.SESSION_COOKIE_SAMESITE and 
                                domain == Config.SESSION_COOKIE_DOMAIN and 
                                (path or '/') == Config.SESSION_COOKIE_PATH):
                                continue
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

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """
    User login endpoint
    ---
    tags:
      - Auth
    summary: Benutzer-Login
    description: |
      Authentifiziert einen Benutzer mit E-Mail und Passwort.
      GET: Prüft ob der Benutzer bereits authentifiziert ist.
      POST: Führt die Anmeldung durch.
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              description: E-Mail-Adresse des Benutzers
              example: "user@example.com"
            password:
              type: string
              description: Passwort des Benutzers
              example: "meinPasswort123"
            remember:
              type: boolean
              description: Session merken (wird ignoriert, Sessions sind nicht permanent)
              default: false
              example: false
          example:
            email: "user@example.com"
            password: "meinPasswort123"
            remember: false
    responses:
      200:
        description: Erfolgreich angemeldet oder bereits authentifiziert
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Erfolgreich angemeldet."
            user:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                user_uuid:
                  type: string
                  example: "123e4567-e89b-12d3-a456-426614174000"
                email:
                  type: string
                  example: "user@example.com"
                name:
                  type: string
                  example: "Max Mustermann"
                is_active:
                  type: boolean
                  example: true
                is_verified:
                  type: boolean
                  example: true
                created_at:
                  type: string
                  format: date-time
                  example: "2025-01-15T10:30:00Z"
            authenticated:
              type: boolean
              example: true
        examples:
          application/json:
            success: true
            message: "Erfolgreich angemeldet."
            user:
              id: 1
              user_uuid: "123e4567-e89b-12d3-a456-426614174000"
              email: "user@example.com"
              name: "Max Mustermann"
              is_active: true
              is_verified: true
              created_at: "2025-01-15T10:30:00Z"
            authenticated: true
      400:
        description: Bereits authentifiziert oder fehlende Parameter
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Already authenticated"
      401:
        description: Ungültige Anmeldedaten oder nicht authentifiziert
        schema:
          type: object
          properties:
            authenticated:
              type: boolean
              example: false
            message:
              type: string
              example: "Not authenticated"
            error:
              type: string
              example: "Ungültige E-Mail oder Passwort."
      403:
        description: Konto deaktiviert
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Ihr Konto wurde deaktiviert. Bitte kontaktieren Sie den Administrator."
    """
    is_api_request = request.headers.get('Accept', '').startswith('application/json') or \
                     request.headers.get('X-Requested-With') == 'XMLHttpRequest' or \
                     request.headers.get('Content-Type', '').startswith('application/json')
    
    if request.method == 'GET':
        if is_api_request:
            if current_user.is_authenticated:
                return jsonify({
                    'authenticated': True,
                    'user': current_user.to_dict()
                }), 200
            return jsonify({
                'authenticated': False,
                'message': 'Not authenticated'
            }), 401
        
        if current_user.is_authenticated:
            return jsonify({
                'authenticated': True,
                'user': current_user.to_dict()
            }), 200
        return jsonify({
            'authenticated': False,
            'message': 'Not authenticated'
        }), 401
    
    if current_user.is_authenticated:
        return jsonify({'error': 'Already authenticated'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Bitte geben Sie E-Mail und Passwort ein.'}), 400
    
    email = data.get('email')
    password = data.get('password')
    remember = data.get('remember', False)
    
    if not email or not password:
        return jsonify({'error': 'Bitte geben Sie E-Mail und Passwort ein.'}), 400
    
    user = User.get_by_email(email)
    
    if user and user.check_password(password):
        if not user.is_active:
            return jsonify({'error': 'Ihr Konto wurde deaktiviert. Bitte kontaktieren Sie den Administrator.'}), 403
        
        login_user(user, remember=False)
        session.permanent = False
        session.modified = True
        user.update_last_login()
        logger.info(f"User logged in: {user.email} (session permanent: {session.permanent})")
        
        response = jsonify({
            'success': True,
            'message': 'Erfolgreich angemeldet.',
            'user': user.to_dict()
        })
        
        cleanup_cookie_variants(response)
        
        return response, 200
    else:
        return jsonify({'error': 'Ungültige E-Mail oder Passwort.'}), 401

# List of known temporary/disposable email domains (common bot domains)
DISPOSABLE_EMAIL_DOMAINS = {
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.com',
    'throwaway.email', 'temp-mail.org', 'getnada.com', 'mohmal.com',
    'yopmail.com', 'sharklasers.com', 'grr.la', 'spamgourmet.com',
    'trashmail.com', 'maildrop.cc', 'getairmail.com', 'fakemail.net',
    'mintemail.com', 'meltmail.com', 'emailondeck.com', 'fakeinbox.com'
}

def is_disposable_email(email):
    """Check if email domain is a known disposable/temporary email service"""
    if not email or '@' not in email:
        return False
    domain = email.split('@')[1].lower()
    return domain in DISPOSABLE_EMAIL_DOMAINS

def validate_email_domain(email):
    """Validate email domain format and check against disposable email list"""
    if not email or '@' not in email:
        return False, 'Ungültige E-Mail-Adresse'
    
    domain = email.split('@')[1].lower()
    
    if is_disposable_email(email):
        logger.warning(f"Registration attempt with disposable email: {email}")
        return False, 'Temporäre E-Mail-Adressen sind nicht erlaubt. Bitte verwenden Sie eine dauerhafte E-Mail-Adresse.'
    
    # Basic domain validation
    if not re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$', domain):
        return False, 'Ungültige E-Mail-Domain'
    
    return True, None

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint
    ---
    tags:
      - Auth
    summary: Benutzer-Registrierung
    description: Registriert einen neuen Benutzer und sendet eine E-Mail-Verifizierung
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
            - password_confirm
          properties:
            email:
              type: string
              description: E-Mail-Adresse des Benutzers
              example: "user@example.com"
            password:
              type: string
              description: Passwort (mindestens 8 Zeichen)
              example: "meinPasswort123"
            password_confirm:
              type: string
              description: Passwort-Bestätigung
              example: "meinPasswort123"
            name:
              type: string
              description: Name des Benutzers
              example: "Max Mustermann"
          example:
            email: "user@example.com"
            password: "meinPasswort123"
            password_confirm: "meinPasswort123"
            name: "Max Mustermann"
    responses:
      201:
        description: Registrierung erfolgreich
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Verifizierung."
            email_sent:
              type: boolean
              example: true
        examples:
          application/json:
            success: true
            message: "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Verifizierung."
            email_sent: true
      400:
        description: Bereits authentifiziert, fehlende Parameter oder Validierungsfehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Bitte geben Sie E-Mail und Passwort ein."
      500:
        description: Server-Fehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
    """
    if current_user.is_authenticated:
        return jsonify({'error': 'Already authenticated'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Bitte geben Sie E-Mail und Passwort ein.'}), 400
    
    email = data.get('email')
    password = data.get('password')
    password_confirm = data.get('password_confirm')
    name = data.get('name')
    
    # Honeypot field - bots will fill this, humans won't see it
    honeypot = data.get('website', '').strip()
    if honeypot:
        logger.warning(f"Bot detected via honeypot field, Email: {email}")
        return jsonify({'error': 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'}), 400
    
    # Validation
    if not email or not password:
        return jsonify({'error': 'Bitte geben Sie E-Mail und Passwort ein.'}), 400
    
    email_valid, email_error = validate_email_domain(email)
    if not email_valid:
        return jsonify({'error': email_error}), 400
    
    if password != password_confirm:
        return jsonify({'error': 'Passwörter stimmen nicht überein.'}), 400
    
    if len(password) < 8:
        return jsonify({'error': 'Passwort muss mindestens 8 Zeichen lang sein.'}), 400
    
    existing_user = User.get_by_email(email)
    if existing_user:
        return jsonify({'error': 'Diese E-Mail-Adresse ist bereits registriert.'}), 400
    
    try:
        user = User(email=email, name=name, password=password)
        db.session.add(user)
        db.session.commit()
        
        token = user.generate_email_verification_token()
        
        # Log email configuration status (without password)
        logger.info(f"Attempting to send verification email to {user.email}")
        logger.info(f"Email service configured - Server: {email_service.server}, Port: {email_service.port}, "
                   f"Username: {email_service.username}, TLS: {email_service.use_tls}, SSL: {email_service.use_ssl}")
        
        email_sent = email_service.send_verification_email(user.email, user.name, token)
        
        logger.info(f"New user registered: {user.email}, Email sent: {email_sent}")
        
        if email_sent:
            return jsonify({
                'success': True,
                'message': 'Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Verifizierung.'
            }), 201
        else:
            logger.warning(f"Email sending failed for user {user.email}. Check email configuration (MAIL_USERNAME, MAIL_PASSWORD) and server logs.")
            return jsonify({
                'success': True,
                'message': 'Registrierung erfolgreich! E-Mail-Versand fehlgeschlagen - bitte kontaktieren Sie den Support.',
                'email_sent': False
            }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'}), 500

@auth_bp.route('/logout')
@login_required
def logout():
    """
    User logout endpoint
    ---
    tags:
      - Auth
    summary: Benutzer-Abmeldung
    description: Meldet den aktuell angemeldeten Benutzer ab
    produces:
      - application/json
    security:
      - sessionAuth: []
    responses:
      200:
        description: Erfolgreich abgemeldet
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
      401:
        description: Nicht authentifiziert
    """
    user_email = current_user.email
    logger.info(f"User logged out: {user_email}")
    
    logout_user()
    session.clear()
    
    return jsonify({
        'success': True,
        'message': 'Sie wurden erfolgreich abgemeldet.'
    }), 200

@auth_bp.route('/login/google')
def login_google():
    """Initiate Google OAuth login"""
    try:
        from config import Config
        next_url = request.args.get('next') or session.get('_next')
        if not next_url:
            referrer = request.referrer
            if referrer and ('/workflow/resume/' in referrer or '/risks/' in referrer or '/workflow/state/' in referrer):
                next_url = referrer
        if next_url:
            session['oauth_next'] = next_url
            logger.info(f"Google OAuth: saving next URL: {next_url}")
        
        redirect_uri = f"{Config.APP_URL}/login/google/callback"
        logger.info(f"Google OAuth: redirecting to {redirect_uri}")
        logger.info(f"APP_URL: {Config.APP_URL}")
        logger.info(f"DOMAIN_NAME: {Config.DOMAIN_NAME}")
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        logger.error(f"CRITICAL: Google OAuth login failed!", exc_info=True)
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error message: {str(e)}")
        flash('Ein Fehler ist bei der Google-Anmeldung aufgetreten. Bitte versuchen Sie es später erneut.', 'error')
        return redirect(url_for('auth.login'))

@auth_bp.route('/login/google/callback')
def google_callback():
    """Google OAuth callback handler"""
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            flash('OAuth-Authentifizierung fehlgeschlagen.', 'error')
            return redirect(url_for('index'))
        
        email = user_info.get('email')
        name = user_info.get('name')
        oauth_id = user_info.get('sub')
        
        if not email or not oauth_id:
            flash('Unvollständige OAuth-Informationen.', 'error')
            return redirect(url_for('index'))
        
        user = User.get_by_oauth('google', oauth_id)
        
        if not user:
            user = User.get_by_email(email)
            
            if user:
                user.oauth_provider = 'google'
                user.oauth_id = oauth_id
                if not user.name and name:
                    user.name = name
                user.is_verified = True
                db.session.commit()
                logger.info(f"Linked Google OAuth to existing user: {email}")
            else:
                user = User(
                    email=email,
                    name=name,
                    oauth_provider='google',
                    oauth_id=oauth_id
                )
                db.session.add(user)
                db.session.commit()
                logger.info(f"New user registered via Google OAuth: {email}")
        
        login_user(user, remember=False)
        session.permanent = False
        session.modified = True
        user.update_last_login()
        
        next_url = session.pop('oauth_next', None)
        if next_url:
            logger.info(f"Google OAuth: redirecting to saved next URL: {next_url}")
            flash('Erfolgreich mit Google angemeldet!', 'success')
            response = redirect(next_url)
        else:
            flash('Erfolgreich mit Google angemeldet!', 'success')
            response = redirect(url_for('index'))
        
        cleanup_cookie_variants(response)
        return response
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Google OAuth error: {error_message}", exc_info=True)
        
        if 'mismatching_state' in error_message.lower() or 'state not equal' in error_message.lower() or 'csrf' in error_message.lower():
            flash('Die Anmeldung konnte nicht abgeschlossen werden. Bitte wiederholen Sie die Anmeldung. Falls das Problem weiterhin besteht, löschen Sie Ihre Cookies und versuchen Sie es erneut.', 'error')
        else:
            flash('Ein Fehler ist bei der Google-Anmeldung aufgetreten. Bitte wiederholen Sie die Anmeldung.', 'error')
        
        return redirect(url_for('index'))

@auth_bp.route('/login/microsoft')
def login_microsoft():
    """Initiate Microsoft OAuth login"""
    try:
        from config import Config
        next_url = request.args.get('next') or session.get('_next')
        if not next_url:
            referrer = request.referrer
            if referrer and ('/workflow/resume/' in referrer or '/risks/' in referrer or '/workflow/state/' in referrer):
                next_url = referrer
        if next_url:
            session['oauth_next'] = next_url
            logger.info(f"Microsoft OAuth: saving next URL: {next_url}")
        
        redirect_uri = f"{Config.APP_URL}/login/microsoft/callback"
        logger.info(f"Microsoft OAuth: redirecting to {redirect_uri}")
        logger.info(f"APP_URL: {Config.APP_URL}")
        logger.info(f"DOMAIN_NAME: {Config.DOMAIN_NAME}")
        return oauth.microsoft.authorize_redirect(redirect_uri)
    except Exception as e:
        logger.error(f"CRITICAL: Microsoft OAuth login failed!", exc_info=True)
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error message: {str(e)}")
        flash('Ein Fehler ist bei der Microsoft-Anmeldung aufgetreten. Bitte versuchen Sie es später erneut.', 'error')
        return redirect(url_for('auth.login'))

@auth_bp.route('/login/microsoft/callback')
def microsoft_callback():
    """Microsoft OAuth callback handler"""
    try:
        # Allow both Azure AD and personal Microsoft account issuers
        claims_options = {
            'iss': {
                'essential': True,
                'values': [
                    'https://login.microsoftonline.com/common/v2.0',
                    'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',  # Personal accounts
                    'https://login.live.com',  # Alternative issuer for personal accounts
                ]
            }
        }
        token = oauth.microsoft.authorize_access_token(claims_options=claims_options)
        
        # Debug: Log the ID token to see the issuer
        if 'id_token' in token:
            import jwt
            decoded = jwt.decode(token['id_token'], options={"verify_signature": False})
            logger.info(f"Microsoft OAuth - Received issuer: {decoded.get('iss')}")
            logger.info(f"Microsoft OAuth - Token type: {decoded.get('typ')}")
            logger.info(f"Microsoft OAuth - All claims: {list(decoded.keys())}")
        
        user_info = token.get('userinfo')
        
        if not user_info:
            flash('OAuth-Authentifizierung fehlgeschlagen.', 'error')
            return redirect(url_for('auth.login'))
        
        email = user_info.get('email') or user_info.get('preferred_username')
        name = user_info.get('name')
        oauth_id = user_info.get('sub') or user_info.get('oid')
        
        if not email or not oauth_id:
            flash('Unvollständige OAuth-Informationen.', 'error')
            return redirect(url_for('index'))
        
        user = User.get_by_oauth('microsoft', oauth_id)
        
        if not user:
            user = User.get_by_email(email)
            
            if user:
                user.oauth_provider = 'microsoft'
                user.oauth_id = oauth_id
                if not user.name and name:
                    user.name = name
                user.is_verified = True
                db.session.commit()
                logger.info(f"Linked Microsoft OAuth to existing user: {email}")
            else:
                user = User(
                    email=email,
                    name=name,
                    oauth_provider='microsoft',
                    oauth_id=oauth_id
                )
                db.session.add(user)
                db.session.commit()
                logger.info(f"New user registered via Microsoft OAuth: {email}")
        
        login_user(user, remember=False)
        session.permanent = False
        session.modified = True
        user.update_last_login()
        
        # Redirect to next URL if it was saved, otherwise to index
        next_url = session.pop('oauth_next', None)
        if next_url:
            logger.info(f"Microsoft OAuth: redirecting to saved next URL: {next_url}")
            flash('Erfolgreich mit Microsoft angemeldet!', 'success')
            response = redirect(next_url)
        else:
            flash('Erfolgreich mit Microsoft angemeldet!', 'success')
            response = redirect(url_for('index'))
        
        # Clean up all cookie variants with different SameSite values
        cleanup_cookie_variants(response)
        return response
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Microsoft OAuth error: {error_message}", exc_info=True)
        
        if 'mismatching_state' in error_message.lower() or 'state not equal' in error_message.lower() or 'csrf' in error_message.lower():
            flash('Die Anmeldung konnte nicht abgeschlossen werden. Bitte wiederholen Sie die Anmeldung. Falls das Problem weiterhin besteht, löschen Sie Ihre Cookies und versuchen Sie es erneut.', 'error')
        else:
            flash('Ein Fehler ist bei der Microsoft-Anmeldung aufgetreten. Bitte wiederholen Sie die Anmeldung.', 'error')
        
        return redirect(url_for('index'))

@auth_bp.route('/api/user/me')
def get_current_user():
    """
    Get current user information
    ---
    tags:
      - Auth
    summary: Aktueller Benutzer
    description: Gibt Informationen über den aktuell angemeldeten Benutzer zurück
    produces:
      - application/json
    security:
      - sessionAuth: []
    responses:
      200:
        description: Benutzerinformationen
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            user_uuid:
              type: string
              example: "123e4567-e89b-12d3-a456-426614174000"
            email:
              type: string
              example: "user@example.com"
            name:
              type: string
              example: "Max Mustermann"
            oauth_provider:
              type: string
              nullable: true
              example: null
            is_active:
              type: boolean
              example: true
            is_verified:
              type: boolean
              example: true
            created_at:
              type: string
              format: date-time
              example: "2025-01-15T10:30:00Z"
            last_login:
              type: string
              format: date-time
              nullable: true
              example: "2025-01-15T12:00:00Z"
        examples:
          application/json:
            id: 1
            user_uuid: "123e4567-e89b-12d3-a456-426614174000"
            email: "user@example.com"
            name: "Max Mustermann"
            oauth_provider: null
            is_active: true
            is_verified: true
            created_at: "2025-01-15T10:30:00Z"
            last_login: "2025-01-15T12:00:00Z"
      401:
        description: Nicht authentifiziert
        schema:
          type: object
          properties:
            error:
              type: string
              example: "unauthorized"
            message:
              type: string
              example: "Nicht authentifiziert"
    """
    # Prüfe ob Benutzer eingeloggt ist - für API-Endpunkte kein Redirect!
    if not current_user.is_authenticated:
        return jsonify({
            'error': 'unauthorized',
            'message': 'Nicht authentifiziert'
        }), 401
    
    return jsonify(current_user.to_dict())

@auth_bp.route('/api/user/profile', methods=['PUT'])
@login_required
def update_profile():
    """
    Update user profile
    ---
    tags:
      - Auth
    summary: Aktualisiert das Benutzerprofil
    description: Aktualisiert Name und/oder Passwort des eingeloggten Benutzers
    consumes:
      - application/json
    produces:
      - application/json
    security:
      - sessionAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              description: Neuer Name (optional)
              example: "Max Mustermann"
            password:
              type: string
              description: Neues Passwort (optional, min. 8 Zeichen)
              example: "neuesPasswort123"
    responses:
      200:
        description: Profil erfolgreich aktualisiert
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            user:
              type: object
              description: Aktualisierte Benutzerdaten
      400:
        description: Validierungsfehler (z.B. Passwort zu kurz)
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Passwort muss mindestens 8 Zeichen lang sein."
      401:
        description: Nicht authentifiziert
      500:
        description: Server-Fehler
    """
    data = request.get_json()
    
    if 'name' in data:
        current_user.name = data['name']
    
    if 'password' in data and data['password']:
        if len(data['password']) < 8:
            return jsonify({'error': 'Passwort muss mindestens 8 Zeichen lang sein.'}), 400
        current_user.set_password(data['password'])
        email_service.send_password_changed_notification(current_user.email, current_user.name)
    
    try:
        db.session.commit()
        logger.info(f"User profile updated: {current_user.email}")
        return jsonify({'success': True, 'user': current_user.to_dict()})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Fehler beim Aktualisieren des Profils.'}), 500

@auth_bp.route('/verify-email')
def verify_email():
    """
    Email verification endpoint
    ---
    tags:
      - Auth
    summary: E-Mail-Verifizierung
    description: Verifiziert eine E-Mail-Adresse anhand eines Tokens aus der Verifizierungs-E-Mail
    produces:
      - application/json
    parameters:
      - in: query
        name: token
        type: string
        required: true
        description: Verifizierungstoken aus der E-Mail
    responses:
      200:
        description: E-Mail erfolgreich verifiziert oder bereits verifiziert
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            error:
              type: string
      400:
        description: Ungültiger oder abgelaufener Token
    """
    token = request.args.get('token')
    
    # Get client information for logging
    client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR', 'unknown'))
    user_agent = request.headers.get('User-Agent', 'unknown')
    
    # Check if this is an API request
    is_api_request = request.headers.get('Accept', '').startswith('application/json') or \
                     request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if not token:
        logger.warning(f"Verification attempt without token - IP: {client_ip}, User-Agent: {user_agent}")
        if is_api_request:
            return jsonify({'error': 'Ungültiger Verifizierungslink.'}), 400
        # Browser request - redirect to frontend
        return redirect(f"{Config.FRONTEND_URL}?error=invalid_token")
    
    logger.info(f"Verification attempt - Token: {token[:30]}..., IP: {client_ip}, User-Agent: {user_agent}")
    
    user = User.get_by_verification_token(token)
    
    if not user:
        # Token not found - check if it was already used by looking up the hash
        user_by_hash = User.get_by_verification_token_hash(token)
        
        if user_by_hash and user_by_hash.is_verified:
            # Token was already used - user-friendly message
            logger.info(f"Verification token already used for user: {user_by_hash.email}, IP: {client_ip}, User-Agent: {user_agent}")
            if is_api_request:
                return jsonify({
                    'error': 'already_verified',
                    'message': 'Diese E-Mail-Adresse wurde bereits verifiziert. Sie können sich jetzt anmelden.'
                }), 200  # 200 because it's not an error, just informational
            # Browser request - redirect to frontend with success (already verified)
            return redirect(f"{Config.FRONTEND_URL}?email_verified=true&already_verified=true")
        
        # Token not found and not already used - could be:
        # 1. Invalid token
        # 2. Token was never created
        logger.warning(f"Verification token not found in database. Token (first 30 chars): {token[:30]}..., IP: {client_ip}, User-Agent: {user_agent}")
        
        # Log all users with verification tokens for debugging (only in debug mode)
        if Config.DEBUG_ENABLED:
            users_with_tokens = User.query.filter(User.email_verification_token.isnot(None)).all()
            logger.debug(f"Users with verification tokens: {len(users_with_tokens)}")
            for u in users_with_tokens[:5]:  # Log first 5
                logger.debug(f"  User {u.email}: token starts with {u.email_verification_token[:20] if u.email_verification_token else 'None'}..., verified: {u.is_verified}")
        
        # Invalid token - return error
        if is_api_request:
            return jsonify({'error': 'Ungültiger Verifizierungslink. Der Link ist ungültig oder abgelaufen.'}), 400
        # Browser request - redirect to frontend with error
        return redirect(f"{Config.FRONTEND_URL}?error=invalid_token")
    
    # Check if token is expired before verifying
    if user.email_verification_token_expires:
        expires_at = user.email_verification_token_expires
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expires_at:
            logger.warning(f"Verification token expired for user: {user.email}, IP: {client_ip}, User-Agent: {user_agent}")
            if is_api_request:
                return jsonify({'error': 'Verifizierungslink ist abgelaufen. Bitte fordern Sie einen neuen an.'}), 400
            # Browser request - redirect to frontend with error
            return redirect(f"{Config.FRONTEND_URL}?error=token_expired")
    
    if user.verify_email_token(token):
        logger.info(f"Email verified for user: {user.email}, IP: {client_ip}, User-Agent: {user_agent}")
        if is_api_request:
            return jsonify({
                'success': True,
                'message': 'E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.'
            }), 200
        # Browser request - redirect to frontend with success
        return redirect(f"{Config.FRONTEND_URL}?email_verified=true")
    else:
        logger.warning(f"Token verification failed for user: {user.email}, token: {token[:20]}..., IP: {client_ip}, User-Agent: {user_agent}")
        if is_api_request:
            return jsonify({
                'error': 'Verifizierungslink ist abgelaufen. Bitte fordern Sie einen neuen an.'
            }), 400
        # Browser request - redirect to frontend with error
        return redirect(f"{Config.FRONTEND_URL}?error=token_expired")

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """
    Resend verification email
    ---
    tags:
      - Auth
    summary: Verifizierungs-E-Mail erneut senden
    description: Sendet eine neue Verifizierungs-E-Mail an den Benutzer
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
          properties:
            email:
              type: string
              description: E-Mail-Adresse des Benutzers
    responses:
      200:
        description: E-Mail gesendet oder bereits verifiziert
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Verifizierungs-E-Mail wurde erneut gesendet. Bitte überprüfen Sie Ihr Postfach."
        examples:
          application/json:
            success: true
            message: "Verifizierungs-E-Mail wurde erneut gesendet. Bitte überprüfen Sie Ihr Postfach."
      400:
        description: Fehlende E-Mail-Adresse
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Bitte geben Sie Ihre E-Mail-Adresse ein."
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Bitte geben Sie Ihre E-Mail-Adresse ein.'}), 400
    
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Bitte geben Sie Ihre E-Mail-Adresse ein.'}), 400
    
    user = User.get_by_email(email)
    
    if not user:
        # Don't reveal if user exists (security best practice)
        return jsonify({
            'success': True,
            'message': 'Falls ein Konto mit dieser E-Mail existiert, wurde eine Verifizierungs-E-Mail gesendet.'
        }), 200
    
    if user.is_verified:
        return jsonify({
            'success': True,
            'message': 'Ihre E-Mail-Adresse ist bereits verifiziert.'
        }), 200
    
    token = user.generate_email_verification_token()
    email_sent = email_service.send_verification_email(user.email, user.name, token)
    
    if email_sent:
        logger.info(f"Verification email resent to: {user.email}")
        return jsonify({
            'success': True,
            'message': 'Verifizierungs-E-Mail wurde erneut gesendet. Bitte überprüfen Sie Ihr Postfach.'
        }), 200
    else:
        logger.error(f"Failed to resend verification email to: {user.email}")
        return jsonify({
            'success': False,
            'message': 'Fehler beim Versenden der E-Mail. Bitte versuchen Sie es später erneut.'
        }), 500

@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """
    Password reset request endpoint
    ---
    tags:
      - Auth
    summary: Passwort-Reset anfordern
    description: |
      Sendet eine E-Mail mit einem Passwort-Reset-Link an den Benutzer.
      GET: Zeigt die Passwort-Reset-Seite (für Browser-Zugriff).
      POST: Sendet die Reset-E-Mail (API).
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
          properties:
            email:
              type: string
              description: E-Mail-Adresse des Benutzers
    responses:
      200:
        description: Reset-E-Mail gesendet (auch wenn Benutzer nicht existiert, aus Sicherheitsgründen)
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Falls ein Konto mit dieser E-Mail existiert, wurde ein Passwort-Reset-Link gesendet."
        examples:
          application/json:
            success: true
            message: "Falls ein Konto mit dieser E-Mail existiert, wurde ein Passwort-Reset-Link gesendet."
      400:
        description: Bereits authentifiziert oder fehlende E-Mail-Adresse
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Bitte geben Sie Ihre E-Mail-Adresse ein."
    """
    if request.method == 'GET':
        # GET requests can still show the HTML page for browser access
        if current_user.is_authenticated:
            return redirect(url_for('index'))
        return render_template('forgot_password.html')
    
    # POST requests return JSON status codes only
    if current_user.is_authenticated:
        return jsonify({'error': 'Already authenticated'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Bitte geben Sie Ihre E-Mail-Adresse ein.'}), 400
    
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Bitte geben Sie Ihre E-Mail-Adresse ein.'}), 400
    
    user = User.get_by_email(email)
    
    # Don't reveal if user exists (security best practice)
    if user:
        token = user.generate_password_reset_token()
        email_sent = email_service.send_password_reset_email(user.email, user.name, token)
        
        if email_sent:
            logger.info(f"Password reset email sent to: {user.email}")
        else:
            logger.error(f"Failed to send password reset email to: {user.email}")
    
    return jsonify({
        'success': True,
        'message': 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Passwort-Reset-Link gesendet.'
    }), 200

@auth_bp.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    """
    Password reset endpoint
    ---
    tags:
      - Auth
    summary: Passwort zurücksetzen
    description: |
      Setzt das Passwort eines Benutzers anhand eines Reset-Tokens zurück.
      GET: Zeigt die Passwort-Reset-Seite (für Browser-Zugriff).
      POST: Setzt das Passwort zurück (API).
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: query
        name: token
        type: string
        required: false
        description: Passwort-Reset-Token (alternativ im JSON-Body)
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - token
            - password
            - password_confirm
          properties:
            token:
              type: string
              description: Passwort-Reset-Token aus der E-Mail
            password:
              type: string
              description: Neues Passwort (mindestens 8 Zeichen)
            password_confirm:
              type: string
              description: Passwort-Bestätigung
    responses:
      200:
        description: Passwort erfolgreich zurückgesetzt
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Passwort erfolgreich zurückgesetzt! Sie können sich jetzt anmelden."
        examples:
          application/json:
            success: true
            message: "Passwort erfolgreich zurückgesetzt! Sie können sich jetzt anmelden."
      400:
        description: Bereits authentifiziert, fehlende Parameter oder ungültiges Token
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Ungültiger Reset-Link."
      500:
        description: Server-Fehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
    """
    # Token kann aus Query-Parameter kommen (für GET) oder aus JSON-Body (für POST)
    token = request.args.get('token')
    
    if request.method == 'GET':
        # GET requests can still show the HTML page for browser access
        if current_user.is_authenticated:
            return redirect(url_for('index'))
        
        if not token:
            flash('Ungültiger Reset-Link.', 'error')
            return redirect(url_for('auth.login'))
        
        user = User.get_by_reset_token(token)
        
        if not user:
            flash('Ungültiger oder abgelaufener Reset-Link.', 'error')
            return redirect(url_for('auth.login'))
        
        if not user.verify_password_reset_token(token):
            flash('Reset-Link ist abgelaufen. Bitte fordern Sie einen neuen an.', 'error')
            return redirect(url_for('auth.forgot_password'))
        
        return render_template('reset_password.html', token=token)
    
    # POST requests return JSON status codes only
    if current_user.is_authenticated:
        return jsonify({'error': 'Already authenticated'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Ungültiger Reset-Link.'}), 400
    
    # Token kann aus Query-Parameter oder JSON-Body kommen
    token = token or data.get('token')
    
    if not token:
        return jsonify({'error': 'Ungültiger Reset-Link.'}), 400
    
    user = User.get_by_reset_token(token)
    
    if not user:
        return jsonify({'error': 'Ungültiger oder abgelaufener Reset-Link.'}), 400
    
    if not user.verify_password_reset_token(token):
        return jsonify({'error': 'Reset-Link ist abgelaufen. Bitte fordern Sie einen neuen an.'}), 400
    
    password = data.get('password')
    password_confirm = data.get('password_confirm')
    
    if not password or not password_confirm:
        return jsonify({'error': 'Bitte füllen Sie alle Felder aus.'}), 400
    
    if password != password_confirm:
        return jsonify({'error': 'Passwörter stimmen nicht überein.'}), 400
    
    if len(password) < 8:
        return jsonify({'error': 'Passwort muss mindestens 8 Zeichen lang sein.'}), 400
    
    user.reset_password(password)
    email_service.send_password_changed_notification(user.email, user.name)
    
    logger.info(f"Password reset successful for user: {user.email}")
    return jsonify({
        'success': True,
        'message': 'Passwort erfolgreich zurückgesetzt! Sie können sich jetzt anmelden.'
    }), 200

