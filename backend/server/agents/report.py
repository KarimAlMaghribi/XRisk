"""
xrisk - Report Agent
Author: Manuel Schott

Report Agent for xrisk application
Generates comprehensive risk assessment reports
"""

import json
from typing import Dict
from agents.base_agent import AIAgent
from agents.prompt_templates import ReportPromptTemplate
from config import Config


class ReportAgent(AIAgent):
    """Agent responsible for generating comprehensive risk assessment reports"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.report_sections = [
            'executive_summary',
            'classification',
            'analysis_summary',
            'recommendations',
            'sources',
            'uncertainties'
        ]
    
    def generate_report(self, risk_data: Dict) -> Dict:
        """
        Generate a comprehensive risk assessment report
        
        Args:
            risk_data (Dict): Complete risk assessment data
            
        Returns:
            Dict: Structured report
        """
        formatted_risk_data = self._format_risk_data_for_ai(risk_data)
        
        messages = [
            {
                "role": "system",
                "content": ReportPromptTemplate.get_system_prompt()
            },
            {
                "role": "user",
                "content": f"""Erstellen Sie einen Bericht für diese Risikobewertung. VERWENDEN SIE DIE WERTE AUS DEN ANALYSE-DATEN:

{formatted_risk_data}

WICHTIG:
- Die bereits berechneten Analyse-Werte müssen Sie DIREKT übernehmen (siehe Abschnitt "BEREITS BERECHNETE ANALYSE-WERTE")
- Die Wahrscheinlichkeit bezieht sich auf den GESAMTEN Versicherungszeitraum, nicht pro Jahr
- Nutzen Sie die Recherche-Ergebnisse zur Kontextualisierung der Risikobewertung
- Geben Sie NUR echte Werte zurück, keine Beispieldaten"""
            }
        ]
        
        response = self._make_request(messages)
        try:
            # Nutze die zentrale Methode zum Bereinigen der Response
            cleaned_response = self._clean_json_response(response)
            report = json.loads(cleaned_response)
            return self._validate_report(report, risk_data)
        except json.JSONDecodeError as e:
            import logging
            logger = logging.getLogger('celery')
            logger.error(f"JSON Decode Error in ReportAgent: {str(e)}")
            logger.error(f"Response was: {response[:500]}")
            raise Exception(f"Failed to parse report response: {str(e)}")
    
    def _validate_report(self, report: Dict, risk_data: Dict) -> Dict:
        """
        Validate and enhance the generated report
        
        Args:
            report (Dict): Generated report
            risk_data (Dict): Original risk data
            
        Returns:
            Dict: Validated and enhanced report
        """
        # Normalize known alternate keys (German → English)
        if 'Analyse-Zusammenfassung' in report and 'analysis_summary' not in report:
            report['analysis_summary'] = report.get('Analyse-Zusammenfassung')
        # Fill missing sections with safe defaults instead of failing hard
        for section in self.report_sections:
            if section not in report:
                report[section] = self._get_default_section(section, risk_data)
        
        report['report_metadata'] = {
            'generated_at': risk_data.get('last_updated', 'Unknown'),
            'risk_uuid': risk_data.get('risk_uuid', 'Unknown'),
            'status': risk_data.get('status', 'Unknown'),
            'report_version': '1.0'
        }
        
        return report
    
    def _get_default_report(self, risk_data: Dict) -> Dict:
        """
        Generate a default report when AI generation fails
        
        Args:
            risk_data (Dict): Risk assessment data
            
        Returns:
            Dict: Default report structure
        """
        return {
            "executive_summary": "Risk assessment completed with default analysis",
            "classification": risk_data.get('risk_type', 'Unknown'),
            "analysis_summary": "Analysis completed with default values due to generation error",
            "recommendations": [
                "Review risk assessment manually",
                "Consider additional coverage options",
                "Regular risk monitoring recommended"
            ],
            "sources": ["AI analysis", "Default calculations"],
            "uncertainties": [
                "Limited data availability",
                "Market volatility",
                "Regulatory changes"
            ],
            "report_metadata": {
                'generated_at': risk_data.get('last_updated', 'Unknown'),
                'risk_uuid': risk_data.get('risk_uuid', 'Unknown'),
                'status': risk_data.get('status', 'Unknown'),
                'report_version': '1.0',
                'generation_method': 'default'
            }
        }
    
    def _get_default_section(self, section: str, risk_data: Dict) -> str:
        """
        Get default content for a report section
        
        Args:
            section (str): Section name
            risk_data (Dict): Risk data
            
        Returns:
            str: Default section content
        """
        defaults = {
            'executive_summary': 'Risk assessment completed successfully',
            'classification': risk_data.get('risk_type', 'Unknown'),
            'analysis_summary': 'Analysis completed with available data',
            'recommendations': ['Regular monitoring recommended'],
            'sources': ['AI analysis'],
            'uncertainties': ['Limited data availability']
        }
        return defaults.get(section, 'Information not available')
    
    def generate_executive_summary(self, risk_data: Dict) -> str:
        """
        Generate a focused executive summary
        
        Args:
            risk_data (Dict): Risk assessment data
            
        Returns:
            str: Executive summary
        """
        analysis = risk_data.get('analysis', {})
        probability = analysis.get('probability_percentage', 0)
        expected_damage = analysis.get('expected_damage', 0)
        max_damage = analysis.get('max_damage_pml', 0)
        
        summary = f"""
Risk Assessment Summary:
- Risk Type: {risk_data.get('risk_type', 'Unknown')}
- Probability (Coverage Period): {probability}%
- Expected Damage (Coverage Period): €{expected_damage:,}
- Maximum Single Loss (PML): €{max_damage:,}
- Status: {risk_data.get('status', 'Unknown')}
        """.strip()
        
        return summary
    
    def get_report_template(self) -> Dict:
        """
        Get the report template structure
        
        Returns:
            Dict: Report template
        """
        return {
            "sections": self.report_sections,
            "required_fields": [
                "executive_summary",
                "classification",
                "analysis_summary",
                "recommendations"
            ],
            "optional_fields": [
                "sources",
                "uncertainties",
                "report_metadata"
            ]
        }
