"""
xrisk - REST API Routes
Author: Manuel Schott

REST API endpoints that are not part of specific blueprints
"""

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import RiskAssessment, RiskAcceptance, db
from datetime import datetime, timezone

rest_bp = Blueprint('rest', __name__)

@rest_bp.route('/health')
def health():
    """
    Health check endpoint - always available
    ---
    tags:
      - Health
    summary: Health Check
    description: Überprüft den Status des API-Servers
    produces:
      - application/json
    responses:
      200:
        description: Server ist gesund
        schema:
          type: object
          properties:
            status:
              type: string
              example: "healthy"
            service:
              type: string
              example: "xrisk-api"
    """
    return jsonify({
        'status': 'healthy',
        'service': 'xrisk-api'
    })


@rest_bp.route('/api/risks', methods=['GET'])
@login_required
def get_risks():
    """
    Get all risks that the current user can access
    ---
    tags:
      - Risks
    summary: Get all accessible risks
    description: |
      Returns all risks that belong to the current user OR risks that are available (status='available') 
      and not yet signed (status != 'signed').
    security:
      - sessionAuth: []
    produces:
      - application/json
    responses:
      200:
        description: List of accessible risks
        schema:
          type: object
          properties:
            risks:
              type: array
              items:
                type: object
      401:
        description: Not authenticated
    """
    if not current_user.is_authenticated:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_uuid = current_user.user_uuid
    
    # Get all risks that:
    # 1. Belong to the current user, OR
    # 2. Are available (status='available') and not yet signed (status != 'signed')
    all_risks = RiskAssessment.query.all()
    
    accessible_risks = []
    for risk in all_risks:
        # User's own risks
        if risk.user_uuid == user_uuid:
            accessible_risks.append(risk)
        # Available risks that haven't been signed yet
        elif risk.is_released() and not risk.is_signed():
            accessible_risks.append(risk)
    
    return jsonify({
        'risks': [risk.to_dict() for risk in accessible_risks]
    }), 200


@rest_bp.route('/api/risks/<risk_uuid>', methods=['GET'])
@login_required
def get_risk(risk_uuid):
    """
    Get a specific risk by UUID
    ---
    tags:
      - Risks
    summary: Get a specific risk
    description: |
      Returns a risk if it belongs to the current user OR if it is available (status='available') 
      and not yet signed (status != 'signed').
    security:
      - sessionAuth: []
    parameters:
      - in: path
        name: risk_uuid
        type: string
        required: true
        description: UUID of the risk
    produces:
      - application/json
    responses:
      200:
        description: Risk details
      401:
        description: Not authenticated
      403:
        description: Access denied
      404:
        description: Risk not found
    """
    if not current_user.is_authenticated:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_uuid = current_user.user_uuid
    
    risk = RiskAssessment.query.filter_by(risk_uuid=risk_uuid).first()
    if not risk:
        return jsonify({'error': 'Risk not found'}), 404
    
    # Check if user has access
    if risk.user_uuid != user_uuid and not (risk.is_released() and not risk.is_signed()):
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify(risk.to_dict()), 200


@rest_bp.route('/api/risks/<risk_uuid>', methods=['PUT'])
@login_required
def update_risk(risk_uuid):
    """
    Update a risk (only if it belongs to the current user)
    ---
    tags:
      - Risks
    summary: Update a risk
    description: Updates a risk. Only the owner can update their risks.
    security:
      - sessionAuth: []
    parameters:
      - in: path
        name: risk_uuid
        type: string
        required: true
        description: UUID of the risk
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            initial_prompt:
              type: string
            start_date:
              type: string
              format: date
            end_date:
              type: string
              format: date
            insurance_value:
              type: number
            status:
              type: string
              enum: [available, signed]
              description: |
                Set status to 'available' to make the risk publicly visible for risk takers.
                Set status to 'signed' when accepting a risk takeover offer.
                Only the owner can change the status.
            accepted_by_user_uuid:
              type: string
              description: |
                Required when setting status to 'signed'. The UUID of the user (risk taker) 
                who will accept/take over this risk.
    produces:
      - application/json
    responses:
      200:
        description: Risk updated successfully
      401:
        description: Not authenticated
      403:
        description: Access denied - not the owner
      404:
        description: Risk not found
    """
    if not current_user.is_authenticated:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_uuid = current_user.user_uuid
    
    risk = RiskAssessment.query.filter_by(risk_uuid=risk_uuid).first()
    if not risk:
        return jsonify({'error': 'Risk not found'}), 404
    
    # Only the owner can update
    if risk.user_uuid != user_uuid:
        return jsonify({'error': 'Access denied - only the owner can update this risk'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Update allowed fields
    if 'initial_prompt' in data:
        risk.initial_prompt = data['initial_prompt']
    if 'start_date' in data:
        risk.start_date = datetime.fromisoformat(data['start_date']).date() if data['start_date'] else None
    if 'end_date' in data:
        risk.end_date = datetime.fromisoformat(data['end_date']).date() if data['end_date'] else None
    if 'insurance_value' in data:
        risk.insurance_value = data['insurance_value']
    
    if 'status' in data:
        new_status = data['status']
        if new_status not in ['available', 'signed']:
            return jsonify({'error': 'Invalid status. Only "available" and "signed" can be set via this endpoint'}), 400
        
        if new_status == 'available':
            risk.mark_as_available()
        elif new_status == 'signed':
            # When marking as signed, accepted_by_user_uuid is required
            if 'accepted_by_user_uuid' not in data:
                return jsonify({'error': 'accepted_by_user_uuid is required when setting status to "signed"'}), 400
            
            accepted_by_user_uuid = data['accepted_by_user_uuid']
            
            existing_acceptance = RiskAcceptance.query.filter_by(
                risk_uuid=risk_uuid,
                user_uuid=accepted_by_user_uuid
            ).first()
            
            if not existing_acceptance:
                acceptance = RiskAcceptance(
                    risk_uuid=risk_uuid,
                    owner_user_uuid=risk.user_uuid,
                    user_uuid=accepted_by_user_uuid
                )
                db.session.add(acceptance)
            
            risk.mark_as_signed()
    
    risk.last_updated = datetime.now(timezone.utc)
    db.session.commit()
    
    return jsonify(risk.to_dict()), 200


@rest_bp.route('/api/risks/<risk_uuid>', methods=['DELETE'])
@login_required
def delete_risk(risk_uuid):
    """
    Delete a risk (only if it belongs to the current user)
    ---
    tags:
      - Risks
    summary: Delete a risk
    description: Deletes a risk. Only the owner can delete their risks.
    security:
      - sessionAuth: []
    parameters:
      - in: path
        name: risk_uuid
        type: string
        required: true
        description: UUID of the risk
    produces:
      - application/json
    responses:
      200:
        description: Risk deleted successfully
      401:
        description: Not authenticated
      403:
        description: Access denied - not the owner
      404:
        description: Risk not found
    """
    if not current_user.is_authenticated:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_uuid = current_user.user_uuid
    
    risk = RiskAssessment.query.filter_by(risk_uuid=risk_uuid).first()
    if not risk:
        return jsonify({'error': 'Risk not found'}), 404
    
    if risk.user_uuid != user_uuid:
        return jsonify({'error': 'Access denied - only the owner can delete this risk'}), 403
    
    # Also delete any acceptances for this risk
    RiskAcceptance.query.filter_by(risk_uuid=risk_uuid).delete()
    
    db.session.delete(risk)
    db.session.commit()
    
    return jsonify({'message': 'Risk deleted successfully'}), 200
