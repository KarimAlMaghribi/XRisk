"""
xrisk - Classification Agent
Author: Manuel Schott

Classification Agent for xrisk application
Classifies risk descriptions into predefined categories
"""

from agents.base_agent import AIAgent
from config import Config


class ClassificationAgent(AIAgent):
    """Agent responsible for classifying risks into categories"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.valid_categories = [
            "Allgemein", 
            "KFZ", 
            "Gesundheit", 
            "Landwirtschaft", 
            "Wetter", 
            "Sicherheit"
        ]
    
    def classify_risk(self, risk_description: str) -> str:
        """
        Classify the risk into predefined categories
        
        Args:
            risk_description (str): The risk description to classify
            
        Returns:
            str: Risk category (one of the valid categories)
        """
        messages = [
            {
                "role": "system",
                "content": f"""Klassifizieren Sie die bereitgestellte Risikobeschreibung in eine der folgenden Kategorien:
- Allgemein
- KFZ
- Gesundheit
- Landwirtschaft
- Wetter
- Sicherheit
Geben Sie 'Allgemein' zurück, falls keine Kategorie passt, die Risikobeschreibung fehlt, ungültig oder zu mehrdeutig ist.
Antworten Sie ausschließlich mit dem passenden Kategorienamen als unformatierter String (kein Klartextzusatz, keine Anführungszeichen, keine zusätzlichen Informationen). Ihre Antwort soll weniger als {Config.AGENT_MAX_TOKENS.get('classification', 100)} Tokens lang sein."""
            },
            {
                "role": "user",
                "content": f"Klassifizieren Sie dieses Risiko: {risk_description}"
            }
        ]
        
        response = self._make_request(messages)
        # Clean the response and validate
        category = response.strip()
        
        if category in self.valid_categories:
            return category
        else:
            return "Allgemein"
    
    def get_classification_categories(self) -> list:
        """
        Get the list of valid classification categories
        
        Returns:
            list: List of valid risk categories
        """
        return self.valid_categories.copy()
    
    def get_category_description(self, category: str) -> str:
        """
        Get a description of a specific risk category
        
        Args:
            category (str): The risk category
            
        Returns:
            str: Description of the category
        """
        descriptions = {
            "Allgemein": "General risks that don't fit into specific categories",
            "KFZ": "Vehicle and automotive related risks",
            "Gesundheit": "Health and medical related risks",
            "Landwirtschaft": "Agricultural and farming related risks",
            "Wetter": "Weather and climate related risks",
            "Sicherheit": "Security and safety related risks"
        }
        return descriptions.get(category, "Unknown category")
