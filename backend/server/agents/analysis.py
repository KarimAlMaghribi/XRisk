"""
xrisk - Analysis Agent
Author: Manuel Schott

Analysis Agent for xrisk application
Analyzes risk probability and potential damage
"""

import json
import logging
import re
from typing import Dict
from agents.base_agent import AIAgent
from agents.prompt_templates import AnalysisPromptTemplate
from config import Config


class AnalysisAgent(AIAgent):
    """Agent responsible for analyzing risk probability and potential damage"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.analysis_parameters = {
            "probability_range": (0, 100),
            "damage_range": (0, 10000000),  # 0 to 10M EUR
            "premium_range": (0, 10000)     # 0 to 10K EUR per month
        }
    
    def analyze_risk(self, risk_description: str, research_data: Dict) -> Dict:
        """
        Analyze risk probability and potential damage
        
        Args:
            risk_description (str): The risk description
            research_data (Dict): Research data from previous steps
            
        Returns:
            Dict: Risk analysis results
        """
        messages = [
            {
                "role": "system",
                "content": AnalysisPromptTemplate.get_system_prompt()
            },
            {
                "role": "user",
                "content": f"Analysieren Sie dieses Risiko: {risk_description}\n\nRecherchedaten: {json.dumps(research_data, indent=2)}"
            }
        ]
        
        response = self._make_request(messages)
        try:
            analysis = self._extract_json_from_response(response)
            logging.info(f"Successfully parsed analysis: {analysis}")
            return self._validate_analysis(analysis)
        except (json.JSONDecodeError, ValueError, TypeError) as e:
            logging.error(f"Analysis parsing error: {e}")
            logging.error(f"Raw response: {response}")
            logging.error(f"Error type: {type(e)}")
            raise Exception(f"Failed to parse analysis response: {str(e)}")
    
    def _normalize_json_string(self, json_str: str) -> str:
        """
        Normalize JSON string to fix common issues like single quotes, trailing commas
        
        Args:
            json_str (str): JSON string that may have syntax issues
            
        Returns:
            str: Normalized JSON string
        """
        json_str = re.sub(r'//.*?$', '', json_str, flags=re.MULTILINE)
        json_str = re.sub(r'/\*.*?\*/', '', json_str, flags=re.DOTALL)
        json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)
        json_str = re.sub(r"'(\w+)'\s*:", r'"\1":', json_str)
        
        def replace_single_quotes(match):
            inner = match.group(1)
            result = []
            i = 0
            while i < len(inner):
                if inner[i] == '\\' and i + 1 < len(inner):
                    if inner[i + 1] == "'":
                        result.append("'")
                        i += 2
                    else:
                        result.append(inner[i])
                        result.append(inner[i + 1])
                        i += 2
                elif inner[i] == '"':
                    result.append('\\"')
                    i += 1
                elif inner[i] == '\\':
                    result.append('\\\\')
                    i += 1
                else:
                    result.append(inner[i])
                    i += 1
            return '"' + ''.join(result) + '"'
        
        pattern = r"'((?:[^'\\]|\\.)*)'"
        json_str = re.sub(pattern, replace_single_quotes, json_str)
        
        return json_str
    
    def _extract_json_from_response(self, response: str) -> Dict:
        """
        Extract JSON from AI response, handling cases where response contains extra text
        
        Args:
            response (str): Raw response from AI
            
        Returns:
            Dict: Parsed JSON data
        """
        logging.info(f"Raw AI response for analysis: {response}")
        
        response = self._clean_json_response(response)
        
        start_idx = response.find('{')
        end_idx = response.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response[start_idx:end_idx]
            logging.info(f"Extracted JSON string: {json_str}")
            
            try:
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                logging.warning(f"Initial JSON parse failed: {e}, attempting to normalize...")
                try:
                    normalized = self._normalize_json_string(json_str)
                    logging.info(f"Normalized JSON string: {normalized}")
                    return json.loads(normalized)
                except json.JSONDecodeError as e2:
                    logging.error(f"Normalized JSON parse also failed: {e2}")
                    logging.error(f"Original string: {json_str[:500]}")
                    raise
        else:
            logging.warning("No JSON object found in response, trying alternative parsing methods")
            json_start = response.find('[')
            json_end = response.find(']') + 1
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                logging.info(f"Found JSON array: {json_str}")
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError as e:
                    logging.warning(f"Array JSON parse failed: {e}, attempting to normalize...")
                    try:
                        normalized = self._normalize_json_string(json_str)
                        return json.loads(normalized)
                    except json.JSONDecodeError:
                        raise
            
            try:
                return json.loads(response)
            except json.JSONDecodeError as e:
                logging.warning(f"Full response JSON parse failed: {e}, attempting to normalize...")
                try:
                    normalized = self._normalize_json_string(response)
                    return json.loads(normalized)
                except json.JSONDecodeError as e2:
                    logging.error("Failed to parse as JSON after normalization, returning empty dict")
                    logging.error(f"Original response: {response[:500]}")
                    raise
    
    def _validate_analysis(self, analysis: Dict) -> Dict:
        """
        Validate and sanitize analysis results
        
        Args:
            analysis (Dict): Raw analysis results
            
        Returns:
            Dict: Validated analysis results
        """
        prob_value = analysis.get('probability_percentage', 0)
        try:
            analysis['probability_percentage'] = max(0, min(100, float(prob_value)))
        except (ValueError, TypeError) as e:
            logging.warning(f"Invalid probability_percentage '{prob_value}': {e}. Using default: 0")
            analysis['probability_percentage'] = 0
            
        avg_damage_value = analysis.get('average_damage_per_event', 0)
        try:
            analysis['average_damage_per_event'] = max(0, float(avg_damage_value))
        except (ValueError, TypeError) as e:
            logging.warning(f"Invalid average_damage_per_event '{avg_damage_value}': {e}. Using default: 0")
            analysis['average_damage_per_event'] = 0
        
        std_dev_value = analysis.get('expected_damage_standard_deviation', 0)
        try:
            analysis['expected_damage_standard_deviation'] = max(0, float(std_dev_value))
        except (ValueError, TypeError) as e:
            logging.warning(f"Invalid expected_damage_standard_deviation '{std_dev_value}': {e}. Using default: 0")
            analysis['expected_damage_standard_deviation'] = 0
        
        damage_value = analysis.get('expected_damage', 0)
        try:
            analysis['expected_damage'] = max(0, float(damage_value))
        except (ValueError, TypeError) as e:
            logging.warning(f"Invalid expected_damage '{damage_value}': {e}. Using default: 0")
            analysis['expected_damage'] = 0
        
        if 'max_damage_pml' in analysis:
            pml_value = analysis.get('max_damage_pml', 0)
            try:
                analysis['max_damage_pml'] = max(0, float(pml_value))
            except (ValueError, TypeError) as e:
                logging.warning(f"Invalid max_damage_pml '{pml_value}': {e}. Using default: 0")
                analysis['max_damage_pml'] = 0
        
        # Preserve title and summary fields if present
        if 'title' in analysis:
            analysis['title'] = str(analysis['title']).strip()
        if 'summary' in analysis:
            analysis['summary'] = str(analysis['summary']).strip()
        
        return analysis
    
    def get_analysis_parameters(self) -> Dict:
        """
        Get the analysis parameters and ranges
        
        Returns:
            Dict: Analysis parameters
        """
        return self.analysis_parameters.copy()
