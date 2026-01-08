"""
xrisk - Combined Analysis Report Agent
Author: Manuel Schott

Combined Analysis Report Agent for xrisk application
Combines analysis and report generation for small risks (threshold configurable via SMALL_RISK_THRESHOLD_EUR)
"""

import json
import logging
from typing import Dict
from agents.base_agent import AIAgent
from agents.prompt_templates import CombinedPromptTemplate
from config import Config


class CombinedAnalysisReportAgent(AIAgent):
    """Agent responsible for combined analysis and report generation for small risks"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.analysis_parameters = {
            "probability_range": (0, 100),
            "damage_range": (0, 10000000),  # 0 to 10M EUR
            "premium_range": (0, 10000)     # 0 to 10K EUR per month
        }
        self.report_sections = [
            'executive_summary',
            'classification',
            'analysis_summary',
            'recommendations',
            'sources',
            'uncertainties'
        ]
    
    def analyze_and_report(self, risk_description: str, risk_data: Dict) -> Dict:
        """
        Combined analysis and report generation for small risks
        This combines the functionality of AnalysisAgent and ReportAgent in a single call
        
        Args:
            risk_description (str): The risk description
            risk_data (Dict): Risk data including classification, inquiry responses, etc.
            
        Returns:
            Dict: Combined analysis and report results
        """
        formatted_risk_data = self._format_risk_data_for_ai(risk_data)
        
        messages = [
            {
                "role": "system",
                "content": CombinedPromptTemplate.get_system_prompt()
            },
            {
                "role": "user",
                "content": f"""Analysieren Sie dieses Risiko UND berechnen SIE ALLE WERTE basierend auf den folgenden Daten. Verwenden Sie KEINE Beispieldaten - berechnen Sie alles neu:

{formatted_risk_data}

WICHTIG: 
- Analysieren Sie die Risikobeschreibung und Risikodaten sorgfältig
- Berechnen Sie Wahrscheinlichkeiten und Schadenshöhen basierend auf den tatsächlichen Daten
- Nutzen Sie die Recherche-Ergebnisse zur Kontextualisierung der Risikobewertung
- Verwenden Sie die Rückfragen und Antworten für zusätzliche Informationen
- Geben Sie NUR berechnete Werte zurück, keine Beispieldaten

Führen Sie die kombinierte Analyse und Berichterstellung durch."""
            }
        ]
        
        response = self._make_request(messages)
        try:
            cleaned_response = self._clean_json_response(response)
            result = json.loads(cleaned_response)
            
            validated_result = self._validate_combined_result(result)
            return validated_result
            
        except json.JSONDecodeError as e:
            logger = logging.getLogger('celery')
            logger.error(f"JSON Decode Error in CombinedAnalysisReportAgent: {str(e)}")
            logger.error(f"Response was: {response[:500]}")
            raise Exception(f"Failed to parse combined analysis report response: {str(e)}")
        except Exception as e:
            logger = logging.getLogger('celery')
            logger.error(f"Error in CombinedAnalysisReportAgent: {str(e)}")
            raise
    
    def _validate_combined_result(self, result: Dict) -> Dict:
        """
        Validate and sanitize the combined analysis and report result
        
        Args:
            result (Dict): Raw combined result (simplified structure without "Analyse-Zusammenfassung" wrapper)
            
        Returns:
            Dict: Validated result with both analysis and report components
        """
        logger = logging.getLogger('celery')
        
        # Extract values directly from result (no "Analyse-Zusammenfassung" wrapper)
        # Probability
        prob_value = result.get('probability_percentage', 0)
        try:
            prob = float(prob_value)
            result['probability_percentage'] = max(0, min(100, prob))
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid probability value '{prob_value}': {e}. Using default: 0")
            result['probability_percentage'] = 0
        
        # Average Damage per Event
        avg_damage_value = result.get('average_damage_per_event', 0)
        try:
            result['average_damage_per_event'] = max(0, float(avg_damage_value))
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid average damage value '{avg_damage_value}': {e}. Using default: 0")
            result['average_damage_per_event'] = 0
        
        # Expected Damage
        damage_value = result.get('expected_damage', 0)
        try:
            result['expected_damage'] = max(0, float(damage_value))
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid damage value '{damage_value}': {e}. Using default: 0")
            result['expected_damage'] = 0
        
        # Standard Deviation
        std_dev_value = result.get('expected_damage_standard_deviation', 0)
        try:
            result['expected_damage_standard_deviation'] = max(0, float(std_dev_value))
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid standard deviation value '{std_dev_value}': {e}. Using default: 0")
            result['expected_damage_standard_deviation'] = 0
        
        # Maximum Single Loss (PML)
        pml_value = result.get('max_damage_pml', 0)
        try:
            result['max_damage_pml'] = max(0, float(pml_value))
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid PML value '{pml_value}': {e}. Using default: 0")
            result['max_damage_pml'] = 0
        
        # Risk Assessment (Acceptance Risk)
        risk_value = result.get('acceptance_risk_percentage', 50)
        try:
            risk = float(risk_value)
            result['acceptance_risk_percentage'] = max(0, min(100, risk))
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid risk assessment value '{risk_value}': {e}. Using default: 50")
            result['acceptance_risk_percentage'] = 50
        
        # Store analysis with unified field names
        result['analysis'] = {
            'probability_percentage': result['probability_percentage'],
            'average_damage_per_event': result['average_damage_per_event'],
            'expected_damage_standard_deviation': result['expected_damage_standard_deviation'],
            'expected_damage': result['expected_damage'],
            'max_damage_pml': result['max_damage_pml'],
            'risk_assessment_percentage': result['acceptance_risk_percentage']
        }
        
        # Extract and store title and summary if present
        if 'title' in result:
            result['analysis']['title'] = str(result['title']).strip()
        if 'summary' in result:
            result['analysis']['summary'] = str(result['summary']).strip()
        
        return result
    
    def get_analysis_parameters(self) -> Dict:
        """
        Get the analysis parameters and ranges
        
        Returns:
            Dict: Analysis parameters
        """
        return self.analysis_parameters.copy()
    
    def get_report_template(self) -> Dict:
        """
        Get the report template structure
        
        Returns:
            Dict: Report template
        """
        return {
            "sections": self.report_sections,
            "required_fields": [
                "title",
                "summary",
                "probability_percentage",
                "average_damage_per_event",
                "expected_damage",
                "expected_damage_standard_deviation",
                "max_damage_pml",
                "acceptance_risk_percentage"
            ],
            "optional_fields": [
                "report_metadata"
            ]
        }

