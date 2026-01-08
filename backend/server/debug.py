"""
xrisk - Debug Routes
Author: Manuel Schott

Debug routes for development - only active when DEBUG_ENABLED=True
"""

from flask import Blueprint, render_template, jsonify, flash, redirect, url_for, request
from models import db, RiskAssessment, User
import json
from datetime import timezone
from functools import wraps

debug_bp = Blueprint('debug', __name__)

def require_debug_enabled(f):
    """Decorator to protect routes that should only be accessible when DEBUG_ENABLED is True"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from config import Config
        if not Config.DEBUG_ENABLED:
            return jsonify({'error': 'Debug routes are disabled'}), 404
        return f(*args, **kwargs)
    return decorated_function

def get_context_tables():
    """Zentrale Definition aller Context-Tabellen"""
    from models import (
        ContextGeneral, ContextKfz, ContextGesundheit, ContextGeneralCurrent,
        ContextGeneralHistorical, ContextGeneralRegulatory,
        ContextKfzCurrent, ContextKfzHistorical, ContextKfzRegulatory,
        ContextGesundheitCurrent, ContextGesundheitHistorical, ContextGesundheitRegulatory,
        ContextLandwirtschaft, ContextLandwirtschaftCurrent, ContextLandwirtschaftHistorical, ContextLandwirtschaftRegulatory,
        ContextWetter, ContextWetterCurrent, ContextWetterHistorical, ContextWetterRegulatory,
        ContextSicherheit, ContextSicherheitCurrent, ContextSicherheitHistorical, ContextSicherheitRegulatory
    )
    
    return {
        'allgemein': ContextGeneral,
        'allgemein_current': ContextGeneralCurrent,
        'allgemein_historical': ContextGeneralHistorical,
        'allgemein_regulatory': ContextGeneralRegulatory,
        'kfz': ContextKfz,
        'kfz_current': ContextKfzCurrent,
        'kfz_historical': ContextKfzHistorical,
        'kfz_regulatory': ContextKfzRegulatory,
        'gesundheit': ContextGesundheit,
        'gesundheit_current': ContextGesundheitCurrent,
        'gesundheit_historical': ContextGesundheitHistorical,
        'gesundheit_regulatory': ContextGesundheitRegulatory,
        'landwirtschaft': ContextLandwirtschaft,
        'landwirtschaft_current': ContextLandwirtschaftCurrent,
        'landwirtschaft_historical': ContextLandwirtschaftHistorical,
        'landwirtschaft_regulatory': ContextLandwirtschaftRegulatory,
        'wetter': ContextWetter,
        'wetter_current': ContextWetterCurrent,
        'wetter_historical': ContextWetterHistorical,
        'wetter_regulatory': ContextWetterRegulatory,
        'sicherheit': ContextSicherheit,
        'sicherheit_current': ContextSicherheitCurrent,
        'sicherheit_historical': ContextSicherheitHistorical,
        'sicherheit_regulatory': ContextSicherheitRegulatory
    }

@debug_bp.route('/risks')
@require_debug_enabled
def risks_page():
    """Risk assessments overview page"""
    risks = RiskAssessment.query.order_by(RiskAssessment.creation_date.desc()).all()
    
    risk_types = set()
    for risk in risks:
        if risk.risk_type:
            risk_types.add(risk.risk_type)
    
    return render_template('risks.html', risks=risks, risk_types=risk_types)

@debug_bp.route('/risks/<risk_uuid>')
@require_debug_enabled
def risk_detail(risk_uuid):
    """Risk assessment detail page"""
    risk = RiskAssessment.query.filter_by(risk_uuid=risk_uuid).first()
    
    if not risk:
        return jsonify({'error': 'Risk assessment not found'}), 404
    
    return render_template('risk_detail.html', risk=risk)

@debug_bp.route('/users')
@require_debug_enabled
def users_page():
    """Users overview page"""
    users = User.query.order_by(User.created_at.desc()).all()
    
    total_users = len(users)
    verified_users = sum(1 for user in users if user.is_verified)
    active_users = sum(1 for user in users if user.is_active)
    oauth_users = sum(1 for user in users if user.oauth_provider)
    
    return render_template('users.html', 
                         users=users, 
                         total_users=total_users,
                         verified_users=verified_users,
                         active_users=active_users,
                         oauth_users=oauth_users)

def _delete_user_handler(user_uuid):
    """Internal handler for user deletion"""
    import logging
    app_logger = logging.getLogger('application')
    
    try:
        user = User.query.filter_by(user_uuid=user_uuid).first()
        
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        email = user.email
        db.session.delete(user)
        db.session.commit()
        
        app_logger.info(f"User deleted: {email} (UUID: {user_uuid})")
        return jsonify({'success': True, 'message': f'Benutzer {email} erfolgreich gelöscht'})
        
    except Exception as e:
        db.session.rollback()
        app_logger.error(f"Error deleting user {user_uuid}: {str(e)}")
        return jsonify({'error': f'Fehler beim Löschen: {str(e)}'}), 500

@debug_bp.route('/users/<user_uuid>', methods=['GET', 'DELETE'])
@require_debug_enabled
def user_detail_or_delete(user_uuid):
    """User detail page (GET) or delete user (DELETE)"""
    if request.method == 'DELETE':
        # DELETE request - no authentication required for debug routes
        return _delete_user_handler(user_uuid)
    
    # GET request - show user detail page
    user = User.query.filter_by(user_uuid=user_uuid).first()
    
    if not user:
        flash('Benutzer nicht gefunden', 'error')
        return redirect(url_for('debug.users_page'))
    
    user_dict = {
        'id': user.id,
        'user_uuid': user.user_uuid,
        'email': user.email,
        'name': user.name,
        'password_hash': '****** (hidden for security)' if user.password_hash else None,
        'oauth_provider': user.oauth_provider,
        'oauth_id': user.oauth_id,
        'is_active': user.is_active,
        'is_verified': user.is_verified,
        'email_verification_token': user.email_verification_token[:20] + '...' if user.email_verification_token else None,
        'email_verification_token_expires': user.email_verification_token_expires.isoformat() if user.email_verification_token_expires else None,
        'password_reset_token': user.password_reset_token[:20] + '...' if user.password_reset_token else None,
        'password_reset_token_expires': user.password_reset_token_expires.isoformat() if user.password_reset_token_expires else None,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'last_login': user.last_login.isoformat() if user.last_login else None
    }
    
    user_json = json.dumps(user_dict, indent=2, ensure_ascii=False)
    
    return render_template('user_detail.html', user=user, user_json=user_json)


@debug_bp.route('/context')
@require_debug_enabled
def context_page():
    """Context-Seite für Anzeige der Kontexttabellen"""
    context_tables = get_context_tables()
    
    table_stats = {}
    for table_name, model in context_tables.items():
        try:
            count = model.query.count()
            table_stats[table_name] = count
        except Exception as e:
            table_stats[table_name] = 0
    
    # Extract unique classifications and calculate stats per classification
    classification_display = {
        'allgemein': 'Allgemein',
        'kfz': 'KFZ',
        'gesundheit': 'Gesundheit',
        'landwirtschaft': 'Landwirtschaft',
        'wetter': 'Wetter',
        'sicherheit': 'Sicherheit'
    }
    
    classification_stats = {}
    for table_name in table_stats.keys():
        # Extract base classification (e.g., 'kfz' from 'kfz_current')
        base_class = table_name.split('_')[0]
        if base_class in classification_display:
            if base_class not in classification_stats:
                classification_stats[base_class] = 0
            classification_stats[base_class] += table_stats[table_name]
    
    return render_template('context.html', 
                         table_stats=table_stats, 
                         context_tables=context_tables,
                         classification_stats=classification_stats,
                         classification_display=classification_display)

@debug_bp.route('/context/<table_name>')
@require_debug_enabled
def context_table_detail(table_name):
    """Detailansicht für eine spezifische Kontexttabelle"""
    context_tables = get_context_tables()
    
    if table_name not in context_tables:
        return jsonify({'error': 'Tabelle nicht gefunden'}), 404
    
    model = context_tables[table_name]
    entries = model.query.order_by(model.created_at.desc()).all()
    
    return render_template('context_detail.html', 
                         table_name=table_name, 
                         entries=entries, 
                         context_tables=context_tables)

