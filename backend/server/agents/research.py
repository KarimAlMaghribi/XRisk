"""
xrisk - Research Agent
Author: Manuel Schott

Research Agent for xrisk application
Orchestrates research across different domains using specialized agents
"""

from datetime import datetime, timezone
from typing import Dict
import logging
import concurrent.futures
import time
from agents.base_agent import AIAgent
from agents.research_current import ResearchCurrent
from agents.research_historical import ResearchHistorical
from agents.research_regulatory import ResearchRegulatory
from performance_logger import perf_timer

logger = logging.getLogger('celery')


class ResearchAgent(AIAgent):
    """Agent responsible for orchestrating research across different domains"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.research_types = ['current', 'historical', 'regulatory']
        
        self.current_agent = ResearchCurrent(api_key)
        self.historical_agent = ResearchHistorical(api_key)
        self.regulatory_agent = ResearchRegulatory(api_key)
    
    def research_current(self, risk_description: str, risk_type: str = "allgemein") -> Dict:
        """
        Recherchiert aktuelle Informationen über das Risiko
        
        Args:
            risk_description (str): Die Risikobeschreibung
            risk_type (str): Art des Risikos (allgemein, kfz, gesundheit)
            
        Returns:
            Dict: Aktuelle Rechercheergebnisse
        """
        return self.current_agent.research_current(risk_description, risk_type)
    
    def research_historical(self, risk_description: str, risk_type: str = "allgemein") -> Dict:
        """
        Recherchiert historische/statistische Daten
        
        Args:
            risk_description (str): Die Risikobeschreibung
            risk_type (str): Art des Risikos (allgemein, kfz, gesundheit)
            
        Returns:
            Dict: Historische Rechercheergebnisse
        """
        return self.historical_agent.research_historical(risk_description, risk_type)
    
    def research_regulatory(self, risk_description: str, risk_type: str = "allgemein") -> Dict:
        """
        Recherchiert regulatorische/rechtliche Aspekte
        
        Args:
            risk_description (str): Die Risikobeschreibung
            risk_type (str): Art des Risikos (allgemein, kfz, gesundheit)
            
        Returns:
            Dict: Regulatorische Rechercheergebnisse
        """
        return self.regulatory_agent.research_regulatory(risk_description, risk_type)
    
    def conduct_comprehensive_research(self, risk_description: str, risk_type: str = "allgemein") -> Dict:
        """
        Führt alle Arten von Recherchen für ein Risiko durch (parallel mit Timeout)
        
        Args:
            risk_description (str): Die Risikobeschreibung
            risk_type (str): Art des Risikos (allgemein, kfz, gesundheit)
            
        Returns:
            Dict: Umfassende Rechercheergebnisse
        """
        results = {}
        
        research_functions = {
            "current": lambda: self._safe_research("current", self.current_agent.research_current, risk_description, risk_type),
            "historical": lambda: self._safe_research("historical", self.historical_agent.research_historical, risk_description, risk_type),
            "regulatory": lambda: self._safe_research("regulatory", self.regulatory_agent.research_regulatory, risk_description, risk_type)
        }
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_type = {
                executor.submit(func): research_type 
                for research_type, func in research_functions.items()
            }
            
            for future in concurrent.futures.as_completed(future_to_type):
                research_type = future_to_type[future]
                try:
                    results[research_type] = future.result()
                    logger.info(f"Research {research_type} completed successfully")
                except Exception as e:
                    logger.error(f"Research {research_type} failed: {str(e)}")
                    raise Exception(f"Research {research_type} fehlgeschlagen: {str(e)}")
        
        return {
            **results,
            "overall_confidence": "medium",
            "research_timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def _safe_research(self, research_name: str, research_func, risk_description: str, risk_type: str = "allgemein") -> Dict:
        """
        Führt Research durch - bei Fehler Exception werfen (kein Fallback!)
        
        Args:
            research_name (str): Name des Research-Agents (current, historical, regulatory)
            research_func: Die Research-Funktion
            risk_description (str): Die Risikobeschreibung
            risk_type (str): Art des Risikos
            
        Returns:
            Dict: Research-Ergebnisse
            
        Raises:
            Exception: Bei Fehlern (kein Fallback, Workflow wird pausiert)
        """
        with perf_timer(f"Research Agent - {research_name.capitalize()}"):
            return research_func(risk_description, risk_type)
    
    def get_research_methodology(self) -> Dict:
        """
        Gibt Informationen über die Recherchemethodik zurück
        
        Returns:
            Dict: Recherchemethodik-Informationen
        """
        return {
            "research_types": self.research_types,
            "specialized_agents": {
                "current": "ResearchCurrent",
                "historical": "ResearchHistorical", 
                "regulatory": "ResearchRegulatory"
            },
            "data_sources": {
                "current": ["Nachrichten-APIs", "Marktberichte", "Branchendatenbanken"],
                "historical": ["Statistische Datenbanken", "Versicherungsdaten", "Historische Berichte"],
                "regulatory": ["Rechtsdatenbanken", "Regulatorische Dokumente", "Compliance-Quellen"]
            },
            "quality_indicators": [
                "Quellenvertrauenswürdigkeit",
                "Datenaktualität",
                "Stichprobengröße",
                "Methodiktransparenz"
            ]
        }
