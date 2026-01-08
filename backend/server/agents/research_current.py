"""
xrisk - Current Research Agent
Author: Manuel Schott

Research Current for xrisk application
Conducts research on current market conditions and recent trends
"""

from datetime import datetime, timezone
from typing import Dict, List, Optional
from agents.base_agent import AIAgent
from config import Config
import json
import requests


class ResearchCurrent(AIAgent):
    """Agent verantwortlich für die Recherche aktueller Marktinformationen"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.research_type = "current"
        
        from config import Config
        self.mcp_base_url = Config.MCP_BASE_URL
        self.mcp_store_timeout = Config.MCP_STORE_TIMEOUT
    
    def research_current(self, risk_description: str, risk_type: str = "allgemein") -> Dict:
        """
        Recherchiert aktuelle Informationen über das Risiko
        
        Args:
            risk_description (str): Die Risikobeschreibung
            risk_type (str): Art des Risikos (allgemein, kfz, gesundheit)
            
        Returns:
            Dict: Aktuelle Rechercheergebnisse mit Kontextserver-Integration
        """
        max_tokens = Config.AGENT_MAX_TOKENS.get('research_current', 3000)
        system_content = f"""Sie sind ein Experte für aktuelle Marktanalysen und Versicherungsrisiken. 
Ihre Aufgabe ist es, aktuelle Informationen über ein spezifisches Risiko zu recherchieren.

WICHTIG: Halten Sie Ihre Antwort präzise - verwenden Sie weniger als {max_tokens} Tokens.

Recherchieren Sie:
- Aktuelle Marktbedingungen und Trends
- Neueste Entwicklungen in der Branche
- Aktuelle Schadensstatistiken
- Marktvolatilität und Risikofaktoren
- Regulatorische Änderungen

Antworten Sie mit einem JSON-Objekt:
{{
    "sources": ["Liste der verwendeten Quellen"],
    "findings": "Detaillierte Beschreibung der aktuellen Marktbedingungen",
    "tags": ["maximal 3 präzise Tags für die Kategorisierung"]
}}

WICHTIG für Tags:
- Generieren Sie maximal 3 präzise, aussagekräftige Tags
- Verwenden Sie spezifische Begriffe (z.B. "unfall", "motorrad", "statistik")
- Vermeiden Sie generische Tags wie "allgemein" oder "aktuell"
- Tags sollen die Suche und Kategorisierung optimieren"""

        messages = [
            {
                "role": "system",
                "content": system_content
            },
            {
                "role": "user",
                "content": f"Recherchieren Sie aktuelle Marktinformationen und quantifizierbare Evidenz für dieses Risiko: {risk_description}"
            }
        ]
        
        response = self._make_request(messages)
        try:
            # Nutze die zentrale Methode zum Bereinigen der Response
            cleaned_response = self._clean_json_response(response)
            result = json.loads(cleaned_response)
            result.update({
                "type": "current",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "methodology": "KI-gestützte aktuelle Marktanalyse"
            })
            
            context_id = self._store_research_result(result, risk_type, risk_description)
            result["context_id"] = context_id
            
            return result
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")
        except Exception as e:
            raise Exception(f"Research current failed: {str(e)}")
    
    def _store_research_result(self, research_result: Dict, risk_type: str, risk_description: str) -> Optional[int]:
        """
        Speichert Rechercheergebnis im MCP Context Server via REST API
        
        Args:
            research_result: Die Rechercheergebnisse
            risk_type: Art des Risikos (allgemein, kfz, gesundheit)
            risk_description: Die ursprüngliche Risikobeschreibung
            
        Returns:
            Kontext-ID oder None bei Fehler
        """
        try:
            import logging
            logger = logging.getLogger('celery')
            
            # Prepare tags
            ai_tags = research_result.get('tags', [])
            if ai_tags and len(ai_tags) <= 3:
                tags = ai_tags
            else:
                tags = [risk_type, "current"]
                if ai_tags:
                    tags.extend(ai_tags[:1])
                tags = tags[:3]
            
            context_data = {
                "source": f"Research Agent - Current ({', '.join(research_result.get('sources', ['KI-Analyse'])[:2])})",
                "content": json.dumps(research_result, ensure_ascii=False),
                "content_type": "json",
                "confidence_score": self._get_confidence_score(research_result.get('confidence_level', 'medium')),
                "tags": tags
            }
            
            # MCP expects lowercase table names (e.g., 'kfz_current')
            normalized_type = (risk_type or "allgemein").strip().lower()
            table_name = f"{normalized_type}_current"
            response = requests.post(
                f"{self.mcp_base_url}/context/{table_name}/store",
                json=context_data,
                headers={'Content-Type': 'application/json'},
                timeout=self.mcp_store_timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                context_id = data.get('context_id')
                
                logger.info(f"Research result stored in MCP context '{table_name}' with ID {context_id}")
                
                # Log details only when log level is DEBUG
                logger.debug(f"  → Tags: {tags}")
                logger.debug(f"  → Confidence: {research_result.get('confidence_level', 'medium')}")
                logger.debug(f"  → Sources: {research_result.get('sources', [])[:2]}")
                
                return context_id
            else:
                logger.warning(f"Failed to store in MCP context server: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            import logging
            logger = logging.getLogger('celery')
            logger.warning(f"Exception storing in MCP context server: {e}")
            return None
    
    
    def _get_confidence_score(self, confidence_level: str) -> float:
        """
        Konvertiert Confidence Level in numerischen Score
        
        Args:
            confidence_level: Confidence Level (high/medium/low)
            
        Returns:
            Numerischer Confidence Score (0.0-1.0)
        """
        confidence_map = {
            'high': 0.9,
            'medium': 0.7,
            'low': 0.5
        }
        return confidence_map.get(confidence_level.lower(), 0.7)
    
