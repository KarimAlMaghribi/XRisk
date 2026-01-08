"""
xrisk - Base AI Agent
Author: Manuel Schott

Base AI Agent class for xrisk application
"""

import openai
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional
from config import Config
from agents.model_config import ModelConfigWrapper

# Hole den bereits in app.py initialisierten OpenAI_API Logger
logger = logging.getLogger('OpenAI_API')

# Falls der Logger noch keine Handler hat (z.B. bei direktem Import ohne app.py)
if not logger.handlers:
    import sys
    from logging_config import setup_logger
    
    try:
        from config import Config
        log_dir = Config.LOG_DIR
    except:
        log_dir = os.environ.get('LOG_DIR', '/app/logs')
    
    # Verwende zentrale Logging-Konfiguration
    logger = setup_logger('OpenAI_API', 'openai_api.log', log_dir)
    logger.info(f"OpenAI API Logger configured (fallback) with daily rotation")


class AIAgent:
    """Basisklasse für alle AI-Agenten"""
    
    def __init__(self, api_key: str):
        """
        AI-Agent mit OpenAI API-Schlüssel initialisieren
        
        Args:
            api_key (str): OpenAI API-Schlüssel
        """
        agent_name = self.__class__.__name__
        logger.info(f"Initializing {agent_name}")
        
        if not api_key or api_key == "your_openai_api_key_here":
            logger.error(f"Invalid API key provided for {agent_name}")
            raise ValueError("OpenAI API-Schlüssel ist erforderlich und muss auf einen gültigen Schlüssel gesetzt werden")
        
        masked_key = api_key[:8] + "..." + api_key[-4:] if len(api_key) > 12 else "***"
        logger.info(f"{agent_name} using API key: {masked_key}")
        
        try:
            self.client = openai.OpenAI(api_key=api_key)
            logger.info(f"{agent_name} successfully initialized")
        except Exception as e:
            logger.error(f"Failed to initialize {agent_name}: {str(e)}")
            raise Exception(f"Fehler beim Initialisieren des OpenAI-Clients: {str(e)}")
    
    def _make_request(self, messages: List[Dict], model: str = None) -> str:
        """
        Make a request to OpenAI API with comprehensive logging
        
        Args:
            messages (List[Dict]): List of message dictionaries
            model (str): OpenAI model to use (if None, uses agent-specific config)
            
        Returns:
            str: Response content from OpenAI
            
        Raises:
            Exception: If API request fails
        """
        agent_name = self.__class__.__name__.lower()
        
        agent_config_map = {
            'validationagent': 'validation',
            'classificationagent': 'classification',
            'inquiryagent': 'inquiry',
            'researchagent': 'research',
            'researchcurrent': 'research_current',
            'researchhistorical': 'research_historical',
            'researchregulatory': 'research_regulatory',
            'analysisagent': 'analysis',
            'reportagent': 'report',
            'combinedanalysisreportagent': 'combined_analysis_report'
        }
        
        config_key = agent_config_map.get(agent_name, agent_name)
        
        if model is None:
            model = Config.AGENT_MODELS.get(config_key, Config.OPENAI_MODEL)
        
        temperature = Config.AGENT_TEMPERATURES.get(config_key, Config.OPENAI_TEMPERATURE)
        max_tokens = Config.AGENT_MAX_TOKENS.get(config_key, Config.OPENAI_MAX_TOKENS)
        use_flex = Config.AGENT_USE_FLEX.get(config_key, False)
        
        request_id = f"req_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        import inspect
        frame = inspect.currentframe()
        calling_frame = frame.f_back.f_back
        calling_file = calling_frame.f_code.co_filename.split('/')[-1] if calling_frame else 'unknown'
        calling_method = calling_frame.f_code.co_name if calling_frame else 'unknown'
        
        logger.info(f"[{request_id}] ===== {agent_name.upper()} - OpenAI API Request =====")
        logger.info(f"[{request_id}] Agent: {agent_name}")
        logger.info(f"[{request_id}] Called from: {calling_file}:{calling_method}")
        logger.info(f"[{request_id}] Model: {model}")
        logger.info(f"[{request_id}] Temperature: {temperature}")
        logger.info(f"[{request_id}] Max Tokens: {max_tokens}")
        logger.info(f"[{request_id}] Config Use Flex: {use_flex}")
        
        logger.info(f"[{request_id}] Messages count: {len(messages)}")
        for i, msg in enumerate(messages):
            role = msg.get('role', 'unknown')
            content = msg.get('content', '')
            logger.info(f"[{request_id}] Message {i+1} ({role}): {content}")
            
        try:
            model_config = ModelConfigWrapper(model)
            model_info = model_config.get_model_info()
            
            # Only use service_tier if BOTH config allows it AND model supports it
            model_supports_flex = model_info.get('supports_service_tier', False)
            effective_service_tier = Config.OPENAI_SERVICE_TIER if (use_flex and model_supports_flex) else None
            
            if use_flex and not model_supports_flex:
                logger.warning(f"[{request_id}] Agent configured to use flex, but model {model} does not support service_tier. Ignoring flex setting.")
            
            logger.info(f"[{request_id}] Effective Service Tier: {effective_service_tier if effective_service_tier else 'None'}")
            
            request_params = model_config.get_request_params(
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                service_tier=effective_service_tier
            )
            
            logger.info(f"[{request_id}] Model capabilities: {model_info}")
            
            safe_params = {k: v for k, v in request_params.items() if k != 'messages'}
            logger.info(f"[{request_id}] Request parameters: {json.dumps(safe_params, indent=2)}")
            
            start_time = datetime.now()
            response = self.client.chat.completions.create(
                **request_params
            )
            end_time = datetime.now()
            
            duration = (end_time - start_time).total_seconds()
            
            logger.info(f"[{request_id}] ===== {agent_name.upper()} - OpenAI API Response =====")
            logger.info(f"[{request_id}] OpenAI Request ID: {response.id}")
            logger.info(f"[{request_id}] API call completed in {duration:.2f} seconds")
            logger.info(f"[{request_id}] Response model: {response.model}")
            logger.info(f"[{request_id}] Usage - Prompt tokens: {response.usage.prompt_tokens}")
            logger.info(f"[{request_id}] Usage - Completion tokens: {response.usage.completion_tokens}")
            logger.info(f"[{request_id}] Usage - Total tokens: {response.usage.total_tokens}")
            
            response_content = response.choices[0].message.content
            
            logger.info(f"[{request_id}] Response content: {response_content}")
            logger.info(f"[{request_id}] Response length: {len(response_content)} characters")
            
            finish_reason = response.choices[0].finish_reason
            logger.info(f"[{request_id}] Finish reason: {finish_reason}")
            logger.info(f"[{request_id}] ===== {agent_name.upper()} - Request Complete =====")
            
            return response_content
            
        except Exception as e:
            error_type = type(e).__name__
            error_str = str(e)
            logger.error(f"[{request_id}] OpenAI API error: {error_str}")
            logger.error(f"[{request_id}] Error type: {error_type}")
            logger.error(f"[{request_id}] Failed request parameters: {json.dumps(safe_params, indent=2)}")
            
            import traceback
            logger.error(f"[{request_id}] Full traceback: {traceback.format_exc()}")
            
            # Automatisches Retry NUR bei OpenAI API Fehlern (Timeout oder 5xx) MIT service_tier
            # NICHT bei eigenen Server-Fehlern!
            
            # Prüfe ob es ein OPENAI-spezifischer Error ist (hat "Error code:" im String)
            is_openai_error = 'Error code:' in error_str or error_type in [
                'APIError', 'APIConnectionError', 'APITimeoutError', 
                'InternalServerError', 'Timeout', 'RateLimitError'
            ]
            
            # Prüfe ob es ein Timeout oder Server Error ist
            is_timeout_or_server_error = (
                'Error code: 500' in error_str or
                'Error code: 502' in error_str or
                'Error code: 503' in error_str or
                'Error code: 504' in error_str or
                'timeout' in error_str.lower() or
                'timed out' in error_str.lower()
            )
            
            # Retry NUR wenn: OpenAI Error + (Timeout oder Server Error) + service_tier verwendet
            should_retry = is_openai_error and is_timeout_or_server_error and 'service_tier' in request_params
            
            if should_retry:
                logger.warning(f"[{request_id}] Detected server error or timeout with service_tier. Waiting 5 seconds before retry...")
                logger.info(f"[{request_id}] User-Message: Etwas ist schief gegangen, lassen Sie mich etwas anderes versuchen...")
                
                # Warte 5 Sekunden
                import time
                time.sleep(5)
                
                # Erstelle neue Parameter ohne service_tier
                retry_params = {k: v for k, v in request_params.items() if k != 'service_tier'}
                
                try:
                    logger.info(f"[{request_id}] Retry ohne service_tier nach 5 Sekunden: {json.dumps({k: v for k, v in retry_params.items() if k != 'messages'}, indent=2)}")
                    
                    # Retry ohne service_tier
                    response = self.client.chat.completions.create(
                        **retry_params
                    )
                    
                    end_time = datetime.now()
                    duration = (end_time - start_time).total_seconds()
                    
                    logger.info(f"[{request_id}] ===== {agent_name.upper()} - OpenAI API Response (RETRY) =====")
                    logger.info(f"[{request_id}] Retry successful after removing service_tier")
                    logger.info(f"[{request_id}] OpenAI Request ID: {response.id}")
                    logger.info(f"[{request_id}] API call completed in {duration:.2f} seconds (inkl. 5s Wartezeit)")
                    logger.info(f"[{request_id}] Response model: {response.model}")
                    logger.info(f"[{request_id}] Usage - Prompt tokens: {response.usage.prompt_tokens}")
                    logger.info(f"[{request_id}] Usage - Completion tokens: {response.usage.completion_tokens}")
                    logger.info(f"[{request_id}] Usage - Total tokens: {response.usage.total_tokens}")
                    
                    response_content = response.choices[0].message.content
                    logger.info(f"[{request_id}] Response content: {response_content}")
                    logger.info(f"[{request_id}] Response length: {len(response_content)} characters")
                    logger.info(f"[{request_id}] Finish reason: {response.choices[0].finish_reason}")
                    logger.info(f"[{request_id}] ===== {agent_name.upper()} - Retry Complete =====")
                    
                    return response_content
                    
                except Exception as retry_error:
                    logger.error(f"[{request_id}] Retry also failed: {str(retry_error)}")
                    raise Exception(f"OpenAI API error nach Retry: {str(retry_error)}")
            
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def get_agent_config(self) -> Dict:
        """
        Get the configuration for this specific agent
        
        Returns:
            Dict: Agent-specific configuration
        """
        agent_name = self.__class__.__name__.lower()
        
        agent_config_map = {
            'validationagent': 'validation',
            'classificationagent': 'classification',
            'inquiryagent': 'inquiry',
            'researchagent': 'research',
            'researchcurrent': 'research_current',
            'researchhistorical': 'research_historical',
            'researchregulatory': 'research_regulatory',
            'analysisagent': 'analysis',
            'reportagent': 'report',
            'combinedanalysisreportagent': 'combined_analysis_report'
        }
        
        config_key = agent_config_map.get(agent_name, agent_name)
        
        use_flex = Config.AGENT_USE_FLEX.get(config_key, False)
        return {
            'agent_name': agent_name,
            'config_key': config_key,
            'model': Config.AGENT_MODELS.get(config_key, Config.OPENAI_MODEL),
            'temperature': Config.AGENT_TEMPERATURES.get(config_key, Config.OPENAI_TEMPERATURE),
            'max_tokens': Config.AGENT_MAX_TOKENS.get(config_key, Config.OPENAI_MAX_TOKENS),
            'use_flex': use_flex,
            'service_tier': Config.OPENAI_SERVICE_TIER if use_flex else None
        }
    
    def _clean_json_response(self, response: str) -> str:
        """
        Clean AI response by removing markdown formatting (backticks)
        
        Args:
            response (str): Raw response from AI
            
        Returns:
            str: Cleaned response ready for JSON parsing
        """
        cleaned_response = response.strip()
        
        if cleaned_response.startswith('```'):
            lines = cleaned_response.split('\n')
            if lines[0].startswith('```'):
                lines = lines[1:]
            if lines and lines[-1].strip() == '```':
                lines = lines[:-1]
            cleaned_response = '\n'.join(lines)
        
        return cleaned_response.strip()
    
    def _validate_response(self, response: str, expected_type: str = "json") -> bool:
        """
        Validate the response format
        
        Args:
            response (str): Response to validate
            expected_type (str): Expected response type
            
        Returns:
            bool: True if valid, False otherwise
        """
        if expected_type == "json":
            try:
                import json
                cleaned = self._clean_json_response(response)
                json.loads(cleaned)
                return True
            except json.JSONDecodeError:
                return False
        return True
    
    def _format_risk_data_for_ai(self, risk_data: Dict) -> str:
        """
        Formatiert Risikodaten in eine für die KI gut lesbare Textform
        
        Args:
            risk_data (Dict): Rohe Risikodaten aus der Datenbank
            
        Returns:
            str: Formatierter Text mit allen relevanten Informationen
        """
        sections = []
        
        # 1. Basisdaten des Risikos
        sections.append("# RISIKO-GRUNDINFORMATIONEN")
        risk_desc = risk_data.get('initial_prompt', 'Nicht angegeben')
        sections.append(f"Risikobeschreibung: {risk_desc}")
        
        risk_type = risk_data.get('risk_type', 'Nicht angegeben')
        sections.append(f"Risikoart: {risk_type if risk_type else 'Nicht angegeben'}")
        
        # Versicherungszeitraum
        start_date = risk_data.get('start_date', 'Nicht angegeben')
        end_date = risk_data.get('end_date', 'Nicht angegeben')
        sections.append(f"Versicherungszeitraum: von {start_date} bis {end_date}")
        
        # Versicherungswert
        insurance_val = risk_data.get('insurance_value', 0)
        sections.append(f"Versicherungswert: {insurance_val:,} EUR")
        sections.append("")
        
        # 2. Rückfragen und Antworten (nur beantwortete)
        clarifications = risk_data.get('inquiry', [])
        if clarifications:
            answered_clarifications = [
                c for c in clarifications 
                if c.get('answer') and c.get('answer').strip()
            ]
            if answered_clarifications:
                sections.append("## RÜCKFRAGEN UND ANTWORTEN")
                for i, clarification in enumerate(answered_clarifications, 1):
                    question = clarification.get('question', 'Keine Frage')
                    answer = clarification.get('answer', '')
                    sections.append(f"Rückfrage {i}: {question}")
                    sections.append(f"Antwort {i}: {answer}")
                    sections.append("")
        
        # 3. Research-Ergebnisse (textuell aufbereitet)
        # Support both structures: nested 'research' dict or separate fields
        if 'research' in risk_data and risk_data['research']:
            research = risk_data['research']
            current = research.get('current')
            historical = research.get('historical')
            regulatory = research.get('regulatory')
        else:
            current = risk_data.get('research_current')
            historical = risk_data.get('research_historical')
            regulatory = risk_data.get('research_regulatory')
        
        if current or historical or regulatory:
            sections.append("## RECHERCHE-ERGEBNISSE")
            
            # Current Research (aktuelle Informationen)
            if current and current.get('key_findings'):
                sections.append("### Aktuelle Markt- und Brancheninformationen")
                sections.append(f"Zusammenfassung: {current.get('summary', 'Keine Zusammenfassung verfügbar')}")
                sections.append("Wichtigste Erkenntnisse:")
                for finding in current.get('key_findings', []):
                    sections.append(f"  • {finding}")
                if current.get('trends'):
                    sections.append("Aktuelle Trends:")
                    for trend in current.get('trends', []):
                        sections.append(f"  • {trend}")
                sections.append("")
            
            # Historical Research (historische/statistische Daten)
            if historical and historical.get('key_findings'):
                sections.append("### Historische und Statistische Daten")
                sections.append(f"Zusammenfassung: {historical.get('summary', 'Keine Zusammenfassung verfügbar')}")
                sections.append("Wichtigste historische Erkenntnisse:")
                for finding in historical.get('key_findings', []):
                    sections.append(f"  • {finding}")
                if historical.get('statistics'):
                    sections.append("Relevante Statistiken:")
                    for stat in historical.get('statistics', []):
                        sections.append(f"  • {stat}")
                sections.append("")
            
            # Regulatory Research (rechtliche/regulatorische Aspekte)
            if regulatory and regulatory.get('key_findings'):
                sections.append("### Regulatorische und Rechtliche Aspekte")
                sections.append(f"Zusammenfassung: {regulatory.get('summary', 'Keine Zusammenfassung verfügbar')}")
                sections.append("Wichtigste rechtliche Erkenntnisse:")
                for finding in regulatory.get('key_findings', []):
                    sections.append(f"  • {finding}")
                if regulatory.get('regulations'):
                    sections.append("Relevante Vorschriften:")
                    for reg in regulatory.get('regulations', []):
                        sections.append(f"  • {reg}")
                sections.append("")
        
        # 4. Bereits durchgeführte Analyse (falls vorhanden)
        analysis = risk_data.get('analysis', {})
        if analysis:
            sections.append("## BEREITS BERECHNETE ANALYSE-WERTE")
            sections.append("WICHTIG: Diese Werte wurden bereits berechnet und müssen DIREKT übernommen werden:")
            
            # Title and summary if present
            if 'title' in analysis:
                sections.append(f"  • Titel: {analysis['title']}")
            if 'summary' in analysis:
                sections.append(f"  • Kurzfassung: {analysis['summary']}")
            
            if 'probability_percentage' in analysis:
                sections.append(f"  • Wahrscheinlichkeit mindestens ein Schaden im Versicherungszeitraum: {analysis['probability_percentage']}%")
            if 'average_damage_per_event' in analysis:
                sections.append(f"  • Durchschnittliche Schadenhöhe pro Ereignis: {analysis['average_damage_per_event']:,} EUR")
            if 'expected_damage_standard_deviation' in analysis:
                sections.append(f"  • Standardabweichung der Schadenhöhe: {analysis['expected_damage_standard_deviation']:,} EUR")
            if 'expected_damage' in analysis:
                sections.append(f"  • Erwarteter Schaden im Versicherungszeitraum: {analysis['expected_damage']:,} EUR")
            if 'max_damage_pml' in analysis:
                sections.append(f"  • Maximaler Einzelschaden (PML): {analysis['max_damage_pml']:,} EUR")
            if 'risk_assessment_percentage' in analysis:
                sections.append(f"  • Übernahmerisiko: {analysis['risk_assessment_percentage']}%")
            sections.append("")
        
        return "\n".join(sections)