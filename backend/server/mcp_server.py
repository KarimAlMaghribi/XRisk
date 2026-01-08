"""
xrisk - MCP (Message Context Protocol) Server
Author: Manuel Schott

Implementiert einen Kontextserver über REST API für das Message Context Protocol.
Der Server ermöglicht das Speichern, Abrufen und Durchsuchen von Kontextinformationen
für verschiedene Risikoarten.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from models import (
    db, ContextTag, 
    ContextGeneral, ContextKfz, ContextGesundheit, ContextGeneralCurrent,
    ContextGeneralHistorical, ContextGeneralRegulatory,
    ContextKfzCurrent, ContextKfzHistorical, ContextKfzRegulatory,
    ContextGesundheitCurrent, ContextGesundheitHistorical, ContextGesundheitRegulatory,
    ContextLandwirtschaft, ContextLandwirtschaftCurrent, ContextLandwirtschaftHistorical, ContextLandwirtschaftRegulatory,
    ContextWetter, ContextWetterCurrent, ContextWetterHistorical, ContextWetterRegulatory,
    ContextSicherheit, ContextSicherheitCurrent, ContextSicherheitHistorical, ContextSicherheitRegulatory
)
import logging
import json
from typing import List, Dict, Any, Optional

logger = logging.getLogger('mcp_server')

def setup_mcp_logging():
    """Setup MCP-specific logging if not already configured"""
    if not logger.handlers:
        import os
        import sys
        
        log_dir = os.environ.get('LOG_DIR')
        
        # Console Handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        # File Handler (if LOG_DIR is set)
        if log_dir:
            try:
                os.makedirs(log_dir, exist_ok=True)
                mcp_log_file = os.path.join(log_dir, 'mcp_server.log')
                file_handler = logging.FileHandler(mcp_log_file, mode='a', encoding='utf-8')
                file_handler.setLevel(logging.INFO)
                file_handler.setFormatter(formatter)
                logger.addHandler(file_handler)
                logger.info(f"MCP Server logging configured: {mcp_log_file}")
            except Exception as e:
                logger.error(f"Failed to setup MCP file logging: {e}")
        
        logger.setLevel(logging.INFO)
        logger.propagate = False

setup_mcp_logging()

mcp_bp = Blueprint('mcp', __name__, url_prefix='/mcp')

CONTEXT_TABLES = {
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

MCP_VERSION = "2024-11-05"
MCP_PROTOCOL = "message-context-protocol"

class MCPError(Exception):
    """Custom MCP Error"""
    def __init__(self, message: str, code: str = "MCP_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)

def validate_mcp_request(data: Dict[str, Any], required_fields: List[str]) -> None:
    """Validiert MCP-Request-Struktur"""
    if not isinstance(data, dict):
        raise MCPError("Request muss ein JSON-Objekt sein", "INVALID_REQUEST_FORMAT")
    
    for field in required_fields:
        if field not in data:
            raise MCPError(f"Erforderliches Feld fehlt: {field}", "MISSING_FIELD")

def get_context_table(table_name: str):
    """Holt die entsprechende Kontext-Tabelle (Tabellenname wird normalisiert)"""
    # Normalize incoming table names (trim + lowercase)
    normalized = (table_name or '').strip().lower()
    if normalized not in CONTEXT_TABLES:
        available = list(CONTEXT_TABLES.keys())
        raise MCPError(f"Unbekannte Kontext-Tabelle: {table_name}. Verfügbar: {available}", "UNKNOWN_TABLE")
    
    return CONTEXT_TABLES[normalized]

def handle_mcp_error(error: Exception) -> tuple:
    """Standardisierte MCP-Fehlerbehandlung"""
    if isinstance(error, MCPError):
        return jsonify({
            'error': {
                'code': error.code,
                'message': error.message,
                'protocol': MCP_PROTOCOL,
                'version': MCP_VERSION
            }
        }), 400
    else:
        logger.error(f"MCP Server Error: {str(error)}")
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Interner Server-Fehler',
                'protocol': MCP_PROTOCOL,
                'version': MCP_VERSION
            }
        }), 500

# ============================================================================
# MCP Server Info Endpoint
# ============================================================================

@mcp_bp.route('/info', methods=['GET'])
def mcp_info():
    """
    MCP Server Information
    ---
    tags:
      - MCP
    summary: Gibt Informationen über den MCP Server zurück
    description: Liefert Server-Informationen, unterstützte Tabellen und Capabilities
    produces:
      - application/json
    responses:
      200:
        description: Server-Informationen erfolgreich abgerufen
        schema:
          type: object
          properties:
            protocol:
              type: string
              example: "message-context-protocol"
            version:
              type: string
              example: "2024-11-05"
            server:
              type: string
              example: "xrisk Context Server"
            description:
              type: string
            capabilities:
              type: array
              items:
                type: string
              example: ["store_context", "retrieve_context", "search_context", "manage_tags"]
            supported_tables:
              type: array
              items:
                type: string
              example: ["allgemein", "kfz", "gesundheit"]
            timestamp:
              type: string
              format: date-time
    """
    try:
        logger.info("MCP Server info endpoint called")
        return jsonify({
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'server': 'xrisk Context Server',
            'description': 'Message Context Protocol Server für Risikobewertungs-Kontexte',
            'capabilities': [
                'store_context',
                'retrieve_context',
                'search_context',
                'manage_tags'
            ],
            'supported_tables': list(CONTEXT_TABLES.keys()),
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
    except Exception as e:
        return handle_mcp_error(e)

# ============================================================================
# Context Storage Endpoints
# ============================================================================

@mcp_bp.route('/context/<table_name>/store', methods=['POST'])
def store_context(table_name: str):
    """
    Speichert Kontextinformationen in der angegebenen Tabelle
    ---
    tags:
      - MCP
    summary: Speichert Kontextinformationen
    description: Speichert neue Kontextinformationen in der angegebenen Kontext-Tabelle
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: path
        name: table_name
        type: string
        required: true
        description: Name der Kontext-Tabelle (z.B. allgemein, kfz, gesundheit)
        example: "allgemein"
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - source
            - content
          properties:
            source:
              type: string
              description: Quellenangabe
              example: "https://example.com/article"
            content:
              type: string
              description: Inhalt der Kontextinformation
              example: "Dies ist der Kontextinhalt..."
            content_type:
              type: string
              enum: [text, html, json]
              default: text
              example: "text"
            confidence_score:
              type: number
              format: float
              minimum: 0.0
              maximum: 1.0
              default: 1.0
              example: 0.95
            tags:
              type: array
              items:
                type: string
              description: Tags zur Kategorisierung
              example: ["tag1", "tag2", "risikobewertung"]
    responses:
      200:
        description: Kontext erfolgreich gespeichert
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            context_id:
              type: integer
              example: 123
            table:
              type: string
            message:
              type: string
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
      400:
        description: Validierungsfehler
        schema:
          type: object
          properties:
            error:
              type: object
              properties:
                code:
                  type: string
                message:
                  type: string
                protocol:
                  type: string
                version:
                  type: string
      500:
        description: Server-Fehler
    """
    try:
        data = request.get_json()
        
        # Validierung
        validate_mcp_request(data, ['source', 'content'])
        
        context_class = get_context_table(table_name)
        
        context = context_class(
            source=data['source'],
            content=data['content'],
            content_type=data.get('content_type', 'text'),
            confidence_score=float(data.get('confidence_score', 1.0))
        )
        
        if 'tags' in data and data['tags']:
            context.add_tags(data['tags'])
        
        db.session.add(context)
        db.session.commit()
        
        logger.info(f"Kontext gespeichert in {table_name}: ID {context.id}")
        
        return jsonify({
            'success': True,
            'context_id': context.id,
            'table': table_name,
            'message': 'Kontext erfolgreich gespeichert',
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return handle_mcp_error(e)

# ============================================================================
# Context Retrieval Endpoints
# ============================================================================

@mcp_bp.route('/context/<table_name>/get/<int:context_id>', methods=['GET'])
def get_context(table_name: str, context_id: int):
    """
    Ruft spezifischen Kontext anhand der ID ab
    ---
    tags:
      - MCP
    summary: Ruft einen Kontext anhand der ID ab
    description: Gibt einen spezifischen Kontext aus der angegebenen Tabelle zurück
    produces:
      - application/json
    parameters:
      - in: path
        name: table_name
        type: string
        required: true
        description: Name der Kontext-Tabelle
        example: "allgemein"
      - in: path
        name: context_id
        type: integer
        required: true
        description: ID des Kontexts
        example: 123
    responses:
      200:
        description: Kontext erfolgreich abgerufen
        schema:
          type: object
          properties:
            success:
              type: boolean
            context:
              type: object
              description: Kontext-Daten
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
      400:
        description: Fehler
      404:
        description: Kontext nicht gefunden
    """
    try:
        context_class = get_context_table(table_name)
        
        context = context_class.query.get(context_id)
        
        if not context:
            raise MCPError(f"Kontext mit ID {context_id} nicht gefunden in Tabelle {table_name}", "CONTEXT_NOT_FOUND")
        
        return jsonify({
            'success': True,
            'context': context.to_dict(),
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        return handle_mcp_error(e)

@mcp_bp.route('/context/<table_name>/list', methods=['GET'])
def list_contexts(table_name: str):
    """
    Listet alle Kontexte einer Tabelle auf (mit Pagination)
    ---
    tags:
      - MCP
    summary: Listet Kontexte einer Tabelle auf
    description: Gibt eine paginierte Liste von Kontexten zurück, optional gefiltert nach Tags und Confidence-Score
    produces:
      - application/json
    parameters:
      - in: path
        name: table_name
        type: string
        required: true
        description: Name der Kontext-Tabelle
        example: "allgemein"
      - in: query
        name: limit
        type: integer
        default: 50
        maximum: 200
        description: Anzahl der Ergebnisse
        example: 50
      - in: query
        name: offset
        type: integer
        default: 0
        description: Offset für Pagination
        example: 0
      - in: query
        name: tags
        type: string
        description: Komma-getrennte Tags zum Filtern
        example: "tag1,tag2"
      - in: query
        name: min_confidence
        type: number
        format: float
        default: 0.0
        description: Mindest-Confidence-Score
        example: 0.5
    responses:
      200:
        description: Liste erfolgreich abgerufen
        schema:
          type: object
          properties:
            success:
              type: boolean
            contexts:
              type: array
              items:
                type: object
            pagination:
              type: object
              properties:
                total:
                  type: integer
                limit:
                  type: integer
                offset:
                  type: integer
                has_more:
                  type: boolean
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
      400:
        description: Fehler
    """
    try:
        context_class = get_context_table(table_name)
        
        limit = min(int(request.args.get('limit', 50)), 200)
        offset = int(request.args.get('offset', 0))
        min_confidence = float(request.args.get('min_confidence', 0.0))
        
        query = context_class.query.filter(context_class.confidence_score >= min_confidence)
        
        if request.args.get('tags'):
            tag_names = [tag.strip() for tag in request.args.get('tags').split(',')]
            query = query.join(context_class.tags).filter(
                ContextTag.name.in_([name.lower() for name in tag_names])
            ).distinct()
        
        total_count = query.count()
        contexts = query.offset(offset).limit(limit).all()
        
        return jsonify({
            'success': True,
            'contexts': [context.to_dict() for context in contexts],
            'pagination': {
                'total': total_count,
                'limit': limit,
                'offset': offset,
                'has_more': offset + limit < total_count
            },
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        return handle_mcp_error(e)

# ============================================================================
# Context Search Endpoints
# ============================================================================

@mcp_bp.route('/context/<table_name>/search', methods=['POST'])
def search_context(table_name: str):
    """
    Sucht Kontexte nach Tags
    ---
    tags:
      - MCP
    summary: Sucht Kontexte nach Tags
    description: Durchsucht eine Kontext-Tabelle nach Kontexten mit bestimmten Tags
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: path
        name: table_name
        type: string
        required: true
        description: Name der Kontext-Tabelle
        example: "allgemein"
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - tags
          properties:
            tags:
              type: array
              items:
                type: string
              description: Tags zum Suchen
              example: ["tag1", "tag2"]
            limit:
              type: integer
              default: 50
              maximum: 200
              description: Maximale Anzahl Ergebnisse
              example: 50
            min_confidence:
              type: number
              format: float
              default: 0.0
              description: Mindest-Confidence-Score
              example: 0.5
    responses:
      200:
        description: Suche erfolgreich durchgeführt
        schema:
          type: object
          properties:
            success:
              type: boolean
            search_results:
              type: array
              items:
                type: object
            search_params:
              type: object
              properties:
                tags:
                  type: array
                limit:
                  type: integer
                min_confidence:
                  type: number
                results_count:
                  type: integer
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
      400:
        description: Validierungsfehler
    """
    try:
        data = request.get_json()
        
        # Validierung
        validate_mcp_request(data, ['tags'])
        
        context_class = get_context_table(table_name)
        
        tag_names = data['tags']
        limit = min(int(data.get('limit', 50)), 200)
        min_confidence = float(data.get('min_confidence', 0.0))
        
        contexts = context_class.search_by_tags(tag_names, limit=limit)
        
        contexts = [ctx for ctx in contexts if ctx.confidence_score >= min_confidence]
        
        return jsonify({
            'success': True,
            'search_results': [context.to_dict() for context in contexts],
            'search_params': {
                'tags': tag_names,
                'limit': limit,
                'min_confidence': min_confidence,
                'results_count': len(contexts)
            },
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        return handle_mcp_error(e)

@mcp_bp.route('/context/search', methods=['POST'])
def search_all_contexts():
    """
    Sucht in allen Kontext-Tabellen nach Tags
    
    Request Body:
    {
        "tags": ["tag1", "tag2", ...],
        "tables": ["allgemein", "kfz", ...],  # Optional: spezifische Tabellen
        "limit_per_table": 25,
        "min_confidence": 0.0
    }
    """
    try:
        data = request.get_json()
        
        # Validierung
        validate_mcp_request(data, ['tags'])
        
        tag_names = data['tags']
        tables = data.get('tables', list(CONTEXT_TABLES.keys()))
        limit_per_table = min(int(data.get('limit_per_table', 25)), 100)
        min_confidence = float(data.get('min_confidence', 0.0))
        
        for table in tables:
            if table not in CONTEXT_TABLES:
                raise MCPError(f"Unbekannte Tabelle: {table}", "UNKNOWN_TABLE")
        
        all_results = {}
        
        for table_name in tables:
            context_class = CONTEXT_TABLES[table_name]
            contexts = context_class.search_by_tags(tag_names, limit=limit_per_table)
            
            contexts = [ctx for ctx in contexts if ctx.confidence_score >= min_confidence]
            
            all_results[table_name] = [context.to_dict() for context in contexts]
        
        total_results = sum(len(results) for results in all_results.values())
        
        return jsonify({
            'success': True,
            'search_results': all_results,
            'search_params': {
                'tags': tag_names,
                'tables': tables,
                'limit_per_table': limit_per_table,
                'min_confidence': min_confidence,
                'total_results': total_results
            },
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        return handle_mcp_error(e)

# ============================================================================
# Tag Management Endpoints
# ============================================================================

@mcp_bp.route('/tags', methods=['GET'])
def list_tags():
    """
    Listet alle verfügbaren Tags auf
    ---
    tags:
      - MCP
    summary: Listet alle verfügbaren Tags auf
    description: Gibt eine Liste aller in der Datenbank vorhandenen Tags zurück
    produces:
      - application/json
    responses:
      200:
        description: Tags erfolgreich abgerufen
        schema:
          type: object
          properties:
            success:
              type: boolean
            tags:
              type: array
              items:
                type: object
            total_count:
              type: integer
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
    """
    try:
        tags = ContextTag.query.all()
        
        return jsonify({
            'success': True,
            'tags': [tag.to_dict() for tag in tags],
            'total_count': len(tags),
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        return handle_mcp_error(e)

@mcp_bp.route('/tags', methods=['POST'])
def create_tag():
    """
    Erstellt einen neuen Tag
    ---
    tags:
      - MCP
    summary: Erstellt einen neuen Tag
    description: Erstellt einen neuen Tag für die Kategorisierung von Kontexten
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
            - name
          properties:
            name:
              type: string
              description: Name des Tags
              example: "risikobewertung"
            description:
              type: string
              description: Beschreibung des Tags (optional)
              example: "Tag für Risikobewertungen"
    responses:
      200:
        description: Tag erfolgreich erstellt
        schema:
          type: object
          properties:
            success:
              type: boolean
            tag:
              type: object
            message:
              type: string
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
      400:
        description: Validierungsfehler oder Tag existiert bereits
    """
    try:
        data = request.get_json()
        
        # Validierung
        validate_mcp_request(data, ['name'])
        
        tag_name = data['name'].strip().lower()
        description = data.get('description')
        
        existing_tag = ContextTag.query.filter_by(name=tag_name).first()
        if existing_tag:
            raise MCPError(f"Tag '{tag_name}' existiert bereits", "TAG_EXISTS")
        
        tag = ContextTag(name=tag_name, description=description)
        db.session.add(tag)
        db.session.commit()
        
        logger.info(f"Neuer Tag erstellt: {tag_name}")
        
        return jsonify({
            'success': True,
            'tag': tag.to_dict(),
            'message': f"Tag '{tag_name}' erfolgreich erstellt",
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return handle_mcp_error(e)

# ============================================================================
# Batch Operations
# ============================================================================

@mcp_bp.route('/context/<table_name>/batch', methods=['POST'])
def batch_store_context(table_name: str):
    """
    Speichert mehrere Kontexte in einem Batch
    
    Request Body:
    {
        "contexts": [
            {
                "source": "Quelle 1",
                "content": "Inhalt 1",
                "tags": ["tag1", "tag2"]
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        # Validierung
        validate_mcp_request(data, ['contexts'])
        
        if not isinstance(data['contexts'], list):
            raise MCPError("'contexts' muss eine Liste sein", "INVALID_CONTEXTS_FORMAT")
        
        context_class = get_context_table(table_name)
        
        created_contexts = []
        
        for i, context_data in enumerate(data['contexts']):
            try:
                validate_mcp_request(context_data, ['source', 'content'])
                
                context = context_class(
                    source=context_data['source'],
                    content=context_data['content'],
                    content_type=context_data.get('content_type', 'text'),
                    confidence_score=float(context_data.get('confidence_score', 1.0))
                )
                
                if 'tags' in context_data and context_data['tags']:
                    context.add_tags(context_data['tags'])
                
                db.session.add(context)
                created_contexts.append({
                    'index': i,
                    'context_id': None,
                    'source': context.source
                })
                
            except Exception as e:
                logger.error(f"Fehler beim Erstellen von Kontext {i}: {str(e)}")
                created_contexts.append({
                    'index': i,
                    'error': str(e),
                    'source': context_data.get('source', 'Unbekannt')
                })
        
        db.session.commit()
        
        for i, created_context in enumerate(created_contexts):
            if 'error' not in created_context:
                context = context_class.query.filter_by(source=created_context['source']).first()
                if context:
                    created_context['context_id'] = context.id
        
        successful_count = len([c for c in created_contexts if 'error' not in c])
        
        return jsonify({
            'success': True,
            'batch_results': created_contexts,
            'summary': {
                'total_processed': len(data['contexts']),
                'successful': successful_count,
                'failed': len(data['contexts']) - successful_count
            },
            'table': table_name,
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return handle_mcp_error(e)

# ============================================================================
# Statistics Endpoints
# ============================================================================

@mcp_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Gibt Statistiken über alle Kontext-Tabellen zurück
    ---
    tags:
      - MCP
    summary: Gibt Statistiken über alle Kontext-Tabellen zurück
    description: Liefert umfassende Statistiken über alle Kontext-Tabellen inklusive Confidence-Scores und neueste Einträge
    produces:
      - application/json
    responses:
      200:
        description: Statistiken erfolgreich abgerufen
        schema:
          type: object
          properties:
            success:
              type: boolean
            statistics:
              type: object
              additionalProperties:
                type: object
                properties:
                  total_contexts:
                    type: integer
                  confidence_stats:
                    type: object
                    properties:
                      min:
                        type: number
                      max:
                        type: number
                      avg:
                        type: number
                  latest_contexts:
                    type: array
                    items:
                      type: object
            global_stats:
              type: object
              properties:
                total_tags:
                  type: integer
                total_tables:
                  type: integer
            protocol:
              type: string
            version:
              type: string
            timestamp:
              type: string
              format: date-time
    """
    try:
        stats = {}
        
        for table_name, context_class in CONTEXT_TABLES.items():
            total_count = context_class.query.count()
            
            confidence_stats = db.session.query(
                db.func.min(context_class.confidence_score).label('min_confidence'),
                db.func.max(context_class.confidence_score).label('max_confidence'),
                db.func.avg(context_class.confidence_score).label('avg_confidence')
            ).first()
            
            latest = context_class.query.order_by(context_class.created_at.desc()).limit(5).all()
            
            stats[table_name] = {
                'total_contexts': total_count,
                'confidence_stats': {
                    'min': float(confidence_stats.min_confidence) if confidence_stats.min_confidence else 0.0,
                    'max': float(confidence_stats.max_confidence) if confidence_stats.max_confidence else 0.0,
                    'avg': float(confidence_stats.avg_confidence) if confidence_stats.avg_confidence else 0.0
                },
                'latest_contexts': [ctx.to_dict() for ctx in latest]
            }
        
        tag_count = ContextTag.query.count()
        
        return jsonify({
            'success': True,
            'statistics': stats,
            'global_stats': {
                'total_tags': tag_count,
                'total_tables': len(CONTEXT_TABLES)
            },
            'protocol': MCP_PROTOCOL,
            'version': MCP_VERSION,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        return handle_mcp_error(e)
