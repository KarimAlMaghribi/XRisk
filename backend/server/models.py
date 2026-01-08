"""
xrisk - Database Models
Author: Manuel Schott

Core database models for risk assessment system
"""

# pyright: reportMissingImports=false
# prevent pyright from reporting missing imports by context_models star import

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta
import uuid
import logging
import json
import secrets
import hashlib
from sqlalchemy import event
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlalchemy.engine import Engine
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()
logger = logging.getLogger('celery')

from context_models import *  # noqa: F403, E402 - full import required; import after db to avoid circular imports

class User(UserMixin, db.Model):
    """User model for authentication and authorization"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    user_uuid = db.Column(db.String(36), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    name = db.Column(db.String(255), nullable=True)
    oauth_provider = db.Column(db.String(50), nullable=True)
    oauth_id = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    email_verification_token = db.Column(db.String(100), nullable=True, unique=True)
    email_verification_token_expires = db.Column(db.DateTime, nullable=True)
    email_verification_token_hash = db.Column(db.String(64), nullable=True, index=True)  # SHA-256 hash (64 hex chars)
    password_reset_token = db.Column(db.String(100), nullable=True, unique=True)
    password_reset_token_expires = db.Column(db.DateTime, nullable=True)
    
    def __init__(self, email, name=None, password=None, oauth_provider=None, oauth_id=None):
        self.user_uuid = str(uuid.uuid4())
        self.email = email
        self.name = name
        self.oauth_provider = oauth_provider
        self.oauth_id = oauth_id
        if password:
            self.set_password(password)
        if oauth_provider:
            self.is_verified = True
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password against hash"""
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.now(timezone.utc)
        db.session.commit()
    
    def to_dict(self):
        """Convert user to dictionary (exclude sensitive data)"""
        return {
            'id': self.id,
            'user_uuid': self.user_uuid,
            'email': self.email,
            'name': self.name,
            'oauth_provider': self.oauth_provider,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    @classmethod
    def get_by_email(cls, email):
        """Find user by email"""
        return cls.query.filter_by(email=email).first()
    
    @classmethod
    def get_by_uuid(cls, user_uuid):
        """Find user by UUID"""
        return cls.query.filter_by(user_uuid=user_uuid).first()
    
    @classmethod
    def get_by_oauth(cls, provider, oauth_id):
        """Find user by OAuth provider and ID"""
        return cls.query.filter_by(oauth_provider=provider, oauth_id=oauth_id).first()
    
    def generate_email_verification_token(self, expiry_hours=24):
        """Generate email verification token and store its hash"""
        self.email_verification_token = secrets.token_urlsafe(32)
        self.email_verification_token_expires = datetime.now(timezone.utc) + timedelta(hours=expiry_hours)
        self.email_verification_token_hash = hashlib.sha256(self.email_verification_token.encode('utf-8')).hexdigest()
        db.session.commit()
        return self.email_verification_token
    
    def verify_email_token(self, token):
        """Verify email token and mark email as verified"""
        if not self.email_verification_token or not self.email_verification_token_expires:
            return False
        
        if self.email_verification_token != token:
            return False
        
        expires_at = self.email_verification_token_expires
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if datetime.now(timezone.utc) > expires_at:
            return False
        
        self.is_verified = True
        self.verified_at = datetime.now(timezone.utc)
        self.email_verification_token = None
        self.email_verification_token_expires = None
        db.session.commit()
        return True
    
    def generate_password_reset_token(self, expiry_hours=1):
        """Generate password reset token"""
        self.password_reset_token = secrets.token_urlsafe(32)
        self.password_reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=expiry_hours)
        db.session.commit()
        return self.password_reset_token
    
    def verify_password_reset_token(self, token):
        """Verify password reset token"""
        if not self.password_reset_token or not self.password_reset_token_expires:
            return False
        
        if self.password_reset_token != token:
            return False
        
        expires_at = self.password_reset_token_expires
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if datetime.now(timezone.utc) > expires_at:
            return False
        
        return True
    
    def reset_password(self, new_password):
        """Reset password and clear reset token"""
        self.set_password(new_password)
        self.password_reset_token = None
        self.password_reset_token_expires = None
        db.session.commit()
    
    @classmethod
    def get_by_verification_token(cls, token):
        """Find user by verification token"""
        return cls.query.filter_by(email_verification_token=token).first()
    
    @classmethod
    def get_by_verification_token_hash(cls, token):
        """Find user by verification token hash (for checking if token was already used)"""
        token_hash = hashlib.sha256(token.encode('utf-8')).hexdigest()
        return cls.query.filter_by(email_verification_token_hash=token_hash).first()
    
    @classmethod
    def get_by_reset_token(cls, token):
        """Find user by password reset token"""
        return cls.query.filter_by(password_reset_token=token).first()
    
    def __repr__(self):
        return f'<User {self.email}>'

class RiskAssessment(db.Model):
    __tablename__ = 'risk_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    creation_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    user_uuid = db.Column(db.String(36), nullable=False, index=True)
    risk_uuid = db.Column(db.String(36), unique=True, nullable=False, index=True)
    status = db.Column(db.String(50), nullable=False, default='created')
    initial_prompt = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    insurance_value = db.Column(db.Float, nullable=True)
    risk_type = db.Column(db.String(100), nullable=True)
    inquiry = db.Column(MutableList.as_mutable(db.JSON), nullable=True)
    research_current = db.Column(MutableDict.as_mutable(db.JSON), nullable=True)
    research_historical = db.Column(MutableDict.as_mutable(db.JSON), nullable=True)
    research_regulatory = db.Column(MutableDict.as_mutable(db.JSON), nullable=True)
    analysis = db.Column(MutableDict.as_mutable(db.JSON), nullable=True)
    report = db.Column(MutableDict.as_mutable(db.JSON), nullable=True)
    processing_since = db.Column(db.DateTime, nullable=True)
    retry_count = db.Column(db.Integer, default=0, nullable=False)
    failed_at = db.Column(db.DateTime, nullable=True)
    failed_reason = db.Column(db.Text, nullable=True)
    admin_notified = db.Column(db.Boolean, default=False, nullable=False)
    
    def __init__(self, user_uuid, initial_prompt, start_date=None, end_date=None, insurance_value=None):
        self.user_uuid = user_uuid
        self.risk_uuid = str(uuid.uuid4())
        self.initial_prompt = initial_prompt
        self.start_date = start_date
        self.end_date = end_date
        self.insurance_value = insurance_value
        self.status = 'created'
    
    def to_dict(self):
        return {
            'id': self.id,
            'creation_date': self.creation_date.isoformat() if self.creation_date else None,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'user_uuid': self.user_uuid,
            'risk_uuid': self.risk_uuid,
            'status': self.status,
            'initial_prompt': self.initial_prompt,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'insurance_value': self.insurance_value,
            'risk_type': self.risk_type,
            'inquiry': self.inquiry,
            'research_current': self.research_current,
            'research_historical': self.research_historical,
            'research_regulatory': self.research_regulatory,
            'analysis': self.analysis,
            'report': self.report,
            'retry_count': self.retry_count,
            'failed_at': self.failed_at.isoformat() if self.failed_at else None,
            'failed_reason': self.failed_reason,
            'admin_notified': self.admin_notified
        }
    
    def update_status(self, new_status):
        self.status = new_status
        self.last_updated = datetime.now(timezone.utc)
        db.session.commit()
    
    def is_processing(self):
        """
        Check if this risk is currently being processed
        
        Returns:
            bool: True if currently processing, False otherwise
        """
        if not self.processing_since:
            return False
        
        processing_time = self.processing_since
        if processing_time.tzinfo is None:
            processing_time = processing_time.replace(tzinfo=timezone.utc)
        
        elapsed = (datetime.now(timezone.utc) - processing_time).total_seconds()
        return elapsed < 300
    
    def is_processing_timeout(self):
        """
        Check if the current processing has timed out
        
        Returns:
            bool: True if timed out, False otherwise
        """
        if not self.processing_since:
            return False
        
        processing_time = self.processing_since
        if processing_time.tzinfo is None:
            processing_time = processing_time.replace(tzinfo=timezone.utc)
        
        elapsed = (datetime.now(timezone.utc) - processing_time).total_seconds()
        return elapsed >= 300
    
    def set_processing_lock(self):
        """Set processing lock to prevent duplicate requests"""
        self.processing_since = datetime.now(timezone.utc)
        db.session.commit()
    
    def clear_processing_lock(self):
        """Clear processing lock after completion or error"""
        self.processing_since = None
        db.session.commit()
    
    def get_processing_elapsed_seconds(self):
        """Get elapsed seconds since processing started"""
        if not self.processing_since:
            return 0
        
        processing_time = self.processing_since
        if processing_time.tzinfo is None:
            processing_time = processing_time.replace(tzinfo=timezone.utc)
        
        return int((datetime.now(timezone.utc) - processing_time).total_seconds())
    
    def mark_as_failed(self, reason):
        """Mark risk as failed for retry mechanism"""
        self.failed_at = datetime.now(timezone.utc)
        self.failed_reason = reason
        self.clear_processing_lock()
        db.session.commit()
    
    def can_retry(self, max_retries=3):
        """Check if workflow can be retried"""
        return self.retry_count < max_retries and self.failed_at is not None
    
    def increment_retry(self):
        """Increment retry counter"""
        self.retry_count += 1
        db.session.commit()
    
    def clear_failed_status(self):
        """Clear failed status after successful retry"""
        self.failed_at = None
        self.failed_reason = None
        db.session.commit()
    
    def reset_retry_state(self):
        """Reset all retry-related fields after successful completion"""
        self.retry_count = 0
        self.failed_at = None
        self.failed_reason = None
        self.admin_notified = False
        db.session.commit()

    @classmethod
    def get_by_uuids(cls, user_uuid, risk_uuid):
        """Fetch a single risk by user and risk UUIDs"""
        return cls.query.filter_by(user_uuid=user_uuid, risk_uuid=risk_uuid).first()

    @classmethod
    def get_by_status(cls, status):
        """Fetch all risks with a given status"""
        return cls.query.filter_by(status=status).all()

    @classmethod
    def get_failed_risks(cls, max_retries=3):
        """
        Get all failed risks that can be retried
        
        Args:
            max_retries: Maximum retry attempts (default: 3)
        
        Returns:
            List of RiskAssessment objects that can be retried
        """
        return cls.query.filter(
            cls.failed_at.isnot(None),
            cls.retry_count < max_retries,
            cls.admin_notified == False,
            cls.status != 'inquiry'
        ).all()

    def is_accepted(self):
        """Check if this risk has been accepted by any user"""
        return RiskAcceptance.query.filter_by(risk_uuid=self.risk_uuid).first() is not None

    def is_accepted_by(self, user_uuid):
        """Check if this risk has been accepted by a specific user"""
        return RiskAcceptance.query.filter_by(risk_uuid=self.risk_uuid, user_uuid=user_uuid).first() is not None

    def is_released(self):
        """Check if this risk is released (available for acceptance by risk takers)"""
        return self.status == 'available'
    
    def is_signed(self):
        """Check if this risk has been signed/accepted by a risk taker"""
        return self.status == 'signed'
    
    def mark_as_available(self):
        """Mark this risk as available for risk takers"""
        self.status = 'available'
        self.last_updated = datetime.now(timezone.utc)
        db.session.commit()
    
    def mark_as_signed(self):
        """Mark this risk as signed/accepted by a risk taker"""
        self.status = 'signed'
        self.last_updated = datetime.now(timezone.utc)
        db.session.commit()


class RiskAcceptance(db.Model):
    """Model to track when risks are accepted by users"""
    __tablename__ = 'risk_acceptances'
    
    id = db.Column(db.Integer, primary_key=True)
    risk_uuid = db.Column(db.String(36), nullable=False, index=True)
    owner_user_uuid = db.Column(db.String(36), nullable=False, index=True)  # UUID of the risk owner (redundant but useful)
    user_uuid = db.Column(db.String(36), nullable=False, index=True)  # UUID of the user who accepted the risk
    accepted_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    def __init__(self, risk_uuid, owner_user_uuid, user_uuid):
        self.risk_uuid = risk_uuid
        self.owner_user_uuid = owner_user_uuid
        self.user_uuid = user_uuid
    
    def to_dict(self):
        """Convert risk acceptance to dictionary"""
        return {
            'id': self.id,
            'risk_uuid': self.risk_uuid,
            'owner_user_uuid': self.owner_user_uuid,
            'user_uuid': self.user_uuid,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None
        }
    
    @classmethod
    def get_by_risk_uuid(cls, risk_uuid):
        """Get all acceptances for a specific risk"""
        return cls.query.filter_by(risk_uuid=risk_uuid).all()
    
    @classmethod
    def get_by_user_uuid(cls, user_uuid):
        """Get all risks accepted by a specific user"""
        return cls.query.filter_by(user_uuid=user_uuid).all()
    
    @classmethod
    def is_risk_accepted(cls, risk_uuid):
        """Check if a risk has been accepted"""
        return cls.query.filter_by(risk_uuid=risk_uuid).first() is not None
    
    def __repr__(self):
        return f'<RiskAcceptance risk_uuid={self.risk_uuid} user_uuid={self.user_uuid}>'


@event.listens_for(Engine, "before_cursor_execute")
def _log_sql_for_risk_assessment(_conn, _cursor, statement, parameters, _context, _executemany):
    try:
        stmt_l = statement.lower()
        if ' risk_assessments ' in stmt_l or ' risk_assessments\n' in stmt_l or ' risk_assessments(' in stmt_l or ' risk_assessments.' in stmt_l or 'into risk_assessments' in stmt_l or 'update risk_assessments' in stmt_l or 'delete from risk_assessments' in stmt_l:
            logger.info(f"[SQL] {statement} | params={parameters}")
    except Exception as e:
        logger.warning(f"[SQL] logging failed: {e}")

_ = _log_sql_for_risk_assessment
