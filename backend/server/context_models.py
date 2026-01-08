"""
xrisk - Context Database Models
Author: Manuel Schott

All Context-related database models for risk assessment knowledge base
"""

from datetime import datetime, timezone
from typing import List

# Import db from models - this works because models.py defines db first
from models import db

# Tags müssen zuerst definiert werden, da andere Modelle darauf verweisen
class ContextTag(db.Model):
    """Tags für Kontextinformationen"""
    __tablename__ = 'context_tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    def __init__(self, name, description=None):
        self.name = name.lower().strip()  # Normalize tag names
        self.description = description
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @classmethod
    def get_or_create(cls, name, description=None):
        """Tag erstellen oder existierenden zurückgeben"""
        tag = cls.query.filter_by(name=name.lower().strip()).first()
        if not tag:
            tag = cls(name=name, description=description)
            db.session.add(tag)
            db.session.commit()
        return tag

# Sicherheit Context Models
class ContextSicherheit(db.Model):
    __tablename__ = 'context_sicherheit'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_sicherheit_tags', backref='sicherheit_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextSicherheit']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextSicherheitCurrent(db.Model):
    __tablename__ = 'context_sicherheit_current'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_sicherheit_current_tags', backref='sicherheit_current_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextSicherheitCurrent']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextSicherheitHistorical(db.Model):
    __tablename__ = 'context_sicherheit_historical'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_sicherheit_historical_tags', backref='sicherheit_historical_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextSicherheitHistorical']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextSicherheitRegulatory(db.Model):
    __tablename__ = 'context_sicherheit_regulatory'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_sicherheit_regulatory_tags', backref='sicherheit_regulatory_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextSicherheitRegulatory']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []


# Association Tables for Sicherheit
ContextSicherheitTags = db.Table('context_sicherheit_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_sicherheit.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextSicherheitCurrentTags = db.Table('context_sicherheit_current_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_sicherheit_current.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextSicherheitHistoricalTags = db.Table('context_sicherheit_historical_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_sicherheit_historical.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextSicherheitRegulatoryTags = db.Table('context_sicherheit_regulatory_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_sicherheit_regulatory.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

# Wetter Context Models
class ContextWetter(db.Model):
    __tablename__ = 'context_wetter'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_wetter_tags', backref='wetter_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextWetter']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextWetterCurrent(db.Model):
    __tablename__ = 'context_wetter_current'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_wetter_current_tags', backref='wetter_current_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextWetterCurrent']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextWetterHistorical(db.Model):
    __tablename__ = 'context_wetter_historical'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_wetter_historical_tags', backref='wetter_historical_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextWetterHistorical']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextWetterRegulatory(db.Model):
    __tablename__ = 'context_wetter_regulatory'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_wetter_regulatory_tags', backref='wetter_regulatory_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextWetterRegulatory']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []


# Association Tables for Wetter
ContextWetterTags = db.Table('context_wetter_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_wetter.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextWetterCurrentTags = db.Table('context_wetter_current_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_wetter_current.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextWetterHistoricalTags = db.Table('context_wetter_historical_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_wetter_historical.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextWetterRegulatoryTags = db.Table('context_wetter_regulatory_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_wetter_regulatory.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

# Landwirtschaft Context Models
class ContextLandwirtschaft(db.Model):
    __tablename__ = 'context_landwirtschaft'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_landwirtschaft_tags', backref='landwirtschaft_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextLandwirtschaft']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextLandwirtschaftCurrent(db.Model):
    __tablename__ = 'context_landwirtschaft_current'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_landwirtschaft_current_tags', backref='landwirtschaft_current_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextLandwirtschaftCurrent']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextLandwirtschaftHistorical(db.Model):
    __tablename__ = 'context_landwirtschaft_historical'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_landwirtschaft_historical_tags', backref='landwirtschaft_historical_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextLandwirtschaftHistorical']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []

class ContextLandwirtschaftRegulatory(db.Model):
    __tablename__ = 'context_landwirtschaft_regulatory'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=0.5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Tags relationship
    tags = db.relationship(ContextTag, secondary='context_landwirtschaft_regulatory_tags', backref='landwirtschaft_regulatory_contexts')
    
    @classmethod
    def add_tags(cls, context_id: int, tag_names: List[str]) -> bool:
        """Fügt Tags zu einem Kontext-Eintrag hinzu"""
        try:
            context = cls.query.get(context_id)
            if not context:
                return False
            
            for tag_name in tag_names:
                tag = ContextTag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = ContextTag(name=tag_name)
                    db.session.add(tag)
                
                if tag not in context.tags:
                    context.tags.append(tag)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @classmethod
    def search_by_tags(cls, tag_names: List[str]) -> List['ContextLandwirtschaftRegulatory']:
        """Sucht Kontexte nach Tags"""
        try:
            return cls.query.join(cls.tags).filter(ContextTag.name.in_(tag_names)).all()
        except Exception:
            return []


# Association Tables for Landwirtschaft
ContextLandwirtschaftTags = db.Table('context_landwirtschaft_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_landwirtschaft.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextLandwirtschaftCurrentTags = db.Table('context_landwirtschaft_current_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_landwirtschaft_current.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextLandwirtschaftHistoricalTags = db.Table('context_landwirtschaft_historical_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_landwirtschaft_historical.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)

ContextLandwirtschaftRegulatoryTags = db.Table('context_landwirtschaft_regulatory_tags',
    db.Column('context_id', db.Integer, db.ForeignKey('context_landwirtschaft_regulatory.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)
)
"""
xrisk - Datenbankmodelle
Author: Manuel Schott
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
import uuid

# db = SQLAlchemy() # Bereits oben definiert

class ContextGeneral(db.Model):
    """Allgemeine Kontextinformationen"""
    __tablename__ = 'ctx_allgemein'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)  # Quellenangabe
    content = db.Column(db.Text, nullable=False)  # Inhalt
    content_type = db.Column(db.String(50), default='text')  # text, html, json, etc.
    confidence_score = db.Column(db.Float, default=1.0)  # Vertrauenswert 0.0-1.0
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # M:N Beziehung zu Tags (temporär deaktiviert)
    tags = db.relationship(ContextTag, secondary='ctx_allgemein_tags', backref='general_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        """Tags zu diesem Kontext hinzufügen"""
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        """Kontext nach Tags suchen"""
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGeneralTags(db.Model):
    """Verbindungstabelle für ctx_allgemein und tags"""
    __tablename__ = 'ctx_allgemein_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_allgemein.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


class ContextKfz(db.Model):
    """KFZ-spezifische Kontextinformationen"""
    __tablename__ = 'ctx_kfz'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # M:N Beziehung zu Tags
    tags = db.relationship(ContextTag, secondary='ctx_kfz_tags', backref='kfz_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        """Tags zu diesem Kontext hinzufügen"""
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        """Kontext nach Tags suchen"""
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextKfzTags(db.Model):
    """Verbindungstabelle für ctx_kfz und tags"""
    __tablename__ = 'ctx_kfz_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_kfz.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


class ContextGesundheit(db.Model):
    """Gesundheit-spezifische Kontextinformationen"""
    __tablename__ = 'ctx_gesundheit'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # M:N Beziehung zu Tags
    tags = db.relationship(ContextTag, secondary='ctx_gesundheit_tags', backref='gesundheit_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        """Tags zu diesem Kontext hinzufügen"""
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        """Kontext nach Tags suchen"""
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGesundheitTags(db.Model):
    """Verbindungstabelle für ctx_gesundheit und tags"""
    __tablename__ = 'ctx_gesundheit_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_gesundheit.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# Zusätzliche Tabellen für spezifische Zeiträume (optional, aber empfohlen)
class ContextGeneralCurrent(db.Model):
    """Aktuelle allgemeine Kontextinformationen"""
    __tablename__ = 'ctx_allgemein_current'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_allgemein_current_tags', backref='general_current_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        """Tags zu diesem Kontext hinzufügen"""
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        """Kontext nach Tags suchen"""
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGeneralCurrentTags(db.Model):
    """Verbindungstabelle für ctx_allgemein_current und tags"""
    __tablename__ = 'ctx_allgemein_current_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_allgemein_current.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# ============================================================================
# Vollständige Modelle für alle Risikoarten und Zeiträume
# ============================================================================

# Allgemein - Historical
class ContextGeneralHistorical(db.Model):
    """Historische allgemeine Kontextinformationen"""
    __tablename__ = 'ctx_allgemein_historical'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_allgemein_historical_tags', backref='general_historical_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGeneralHistoricalTags(db.Model):
    """Verbindungstabelle für ctx_allgemein_historical und tags"""
    __tablename__ = 'ctx_allgemein_historical_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_allgemein_historical.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# Allgemein - Regulatory
class ContextGeneralRegulatory(db.Model):
    """Regulatorische allgemeine Kontextinformationen"""
    __tablename__ = 'ctx_allgemein_regulatory'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_allgemein_regulatory_tags', backref='general_regulatory_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGeneralRegulatoryTags(db.Model):
    """Verbindungstabelle für ctx_allgemein_regulatory und tags"""
    __tablename__ = 'ctx_allgemein_regulatory_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_allgemein_regulatory.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# KFZ - Current
class ContextKfzCurrent(db.Model):
    """Aktuelle KFZ-Kontextinformationen"""
    __tablename__ = 'ctx_kfz_current'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_kfz_current_tags', backref='kfz_current_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextKfzCurrentTags(db.Model):
    """Verbindungstabelle für ctx_kfz_current und tags"""
    __tablename__ = 'ctx_kfz_current_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_kfz_current.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# KFZ - Historical
class ContextKfzHistorical(db.Model):
    """Historische KFZ-Kontextinformationen"""
    __tablename__ = 'ctx_kfz_historical'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_kfz_historical_tags', backref='kfz_historical_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextKfzHistoricalTags(db.Model):
    """Verbindungstabelle für ctx_kfz_historical und tags"""
    __tablename__ = 'ctx_kfz_historical_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_kfz_historical.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# KFZ - Regulatory
class ContextKfzRegulatory(db.Model):
    """Regulatorische KFZ-Kontextinformationen"""
    __tablename__ = 'ctx_kfz_regulatory'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_kfz_regulatory_tags', backref='kfz_regulatory_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextKfzRegulatoryTags(db.Model):
    """Verbindungstabelle für ctx_kfz_regulatory und tags"""
    __tablename__ = 'ctx_kfz_regulatory_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_kfz_regulatory.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# Gesundheit - Current
class ContextGesundheitCurrent(db.Model):
    """Aktuelle Gesundheit-Kontextinformationen"""
    __tablename__ = 'ctx_gesundheit_current'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_gesundheit_current_tags', backref='gesundheit_current_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGesundheitCurrentTags(db.Model):
    """Verbindungstabelle für ctx_gesundheit_current und tags"""
    __tablename__ = 'ctx_gesundheit_current_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_gesundheit_current.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# Gesundheit - Historical
class ContextGesundheitHistorical(db.Model):
    """Historische Gesundheit-Kontextinformationen"""
    __tablename__ = 'ctx_gesundheit_historical'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_gesundheit_historical_tags', backref='gesundheit_historical_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGesundheitHistoricalTags(db.Model):
    """Verbindungstabelle für ctx_gesundheit_historical und tags"""
    __tablename__ = 'ctx_gesundheit_historical_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_gesundheit_historical.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)


# Gesundheit - Regulatory
class ContextGesundheitRegulatory(db.Model):
    """Regulatorische Gesundheit-Kontextinformationen"""
    __tablename__ = 'ctx_gesundheit_regulatory'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(50), default='text')
    confidence_score = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    tags = db.relationship(ContextTag, secondary='ctx_gesundheit_regulatory_tags', backref='gesundheit_regulatory_contexts')
    
    def __init__(self, source, content, content_type='text', confidence_score=1.0):
        self.source = source
        self.content = content
        self.content_type = content_type
        self.confidence_score = confidence_score
    
    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'content': self.content,
            'content_type': self.content_type,
            'confidence_score': self.confidence_score,
            'tags': [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def add_tags(self, tag_names):
        for tag_name in tag_names:
            if isinstance(tag_name, str):
                tag = ContextTag.get_or_create(tag_name)
                if tag not in self.tags:
                    self.tags.append(tag)
    
    @classmethod
    def search_by_tags(cls, tag_names, limit=50):
        return cls.query.join(cls.tags).filter(
            ContextTag.name.in_([name.lower() for name in tag_names])
        ).distinct().limit(limit).all()


class ContextGesundheitRegulatoryTags(db.Model):
    """Verbindungstabelle für ctx_gesundheit_regulatory und tags"""
    __tablename__ = 'ctx_gesundheit_regulatory_tags'
    
    context_id = db.Column(db.Integer, db.ForeignKey('ctx_gesundheit_regulatory.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('context_tags.id'), primary_key=True)