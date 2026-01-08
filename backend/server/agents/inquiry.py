"""
xrisk - Inquiry Agent
Author: Manuel Schott

Inquiry Agent for xrisk application
Generates precise questions for incomplete risk descriptions
"""

import json
from typing import List
from agents.base_agent import AIAgent
from config import Config


class InquiryAgent(AIAgent):
    """Agent verantwortlich für die Generierung von Rückfragen zu unvollständigen Risikobeschreibungen"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.max_inquiries = 2
    
    def generate_inquiries(self, risk_description: str) -> List[str]:
        """
        Generate up to 2 precise questions for incomplete risk descriptions
        
        Args:
            risk_description (str): The risk description to analyze
            
        Returns:
            List[str]: List of inquiry questions (max 2)
        """
        messages = [
            {
                "role": "system",
                "content": f"""# Rolle und Ziel
Sie sind ein Experte für Versicherungsunderwriting. Analysieren Sie die gegebene Risikobeschreibung und prüfen Sie, ob zusätzliche Informationen benötigt werden.
# Anweisungen
- Halten Sie Ihre Antwort präzise und verwenden Sie weniger als {Config.AGENT_MAX_TOKENS.get('inquiry', 3000)} Tokens.
- Generieren Sie bis zu {self.max_inquiries} kurze, präzise, spezifische Rückfragen, um das Risiko besser zu verstehen.
- Fokussieren Sie auf die Spezifizierung vager Begriffe und stellen Sie für unterschiedliche Risikotypen gezielte Rückfragen.

## Vage Begriffe identifizieren und spezifizieren
Für unspezifische Begriffe, formulieren Sie Rückfragen zu:
- "alte Kamera": Marke, Modell, Baujahr
- "wertvolles Objekt": Art, Standort
- "wichtige Dokumente": Art, Anzahl, Aufbewahrungsort
- "teure Ausrüstung": Art, Marke, Verwendungszweck
- "Erbstück": Art, Alter, Herkunft

## Spezifische Rückfragen für Risikotypen
- Sachschäden: Marke, Modell, Standort, Sicherheitsvorkehrungen
- Haftpflicht: Art der Tätigkeit, Häufigkeit, Risikofaktoren
- Fahrzeuge: Marke, Modell, Baujahr, Nutzung
- Immobilien: Größe, Baujahr, Standort, Nutzung

## Beispiele guter Rückfragen (ohne Wert-Fragen)
- "Welche Marke und welches Modell hat die Kamera?"
- "Welche Sicherheitsvorkehrungen sind vorhanden?"
- "Wie oft wird die Kamera verwendet?"
- "Gibt es besondere Risikofaktoren?"

# Besondere Vorgaben
- Stellen Sie KEINE Fragen zum Wert, da dieser bereits bekannt ist.
- Sollte die Beschreibung bereits vollständig und detailliert sein, antworten Sie mit einer leeren Liste.
- Nach dem Generieren der Fragen validieren Sie Ihre Auswahl kurz: Überprüfen Sie, ob die Rückfragen die Informationslücken tatsächlich adressieren, und bestätigen Sie, dass keine Wert-bezogenen Fragen gestellt wurden.

# Output Format
Antworte NUR mit einem gültigen JSON-Objekt:

Bei Rückfragen:
{{
  "questions": [
    "Frage 1",
    "Frage 2"
  ]
}}

Wenn keine weiteren Fragen notwendig sind:
{{
  "questions": []
}}

WICHTIG: Geben Sie NUR das JSON-Objekt zurück, ohne zusätzlichen Text oder Formatierung."""
            },
            {
                "role": "user",
                "content": f"Analysieren Sie diese Risikobeschreibung und generieren Sie bei Bedarf Rückfragen: {risk_description}"
            }
        ]
        
        response = self._make_request(messages)
        try:
            # Nutze die zentrale Methode zum Bereinigen der Response
            cleaned_response = self._clean_json_response(response)
            result = json.loads(cleaned_response)
            # Extrahiere die questions Liste aus dem JSON
            if isinstance(result, dict) and 'questions' in result:
                inquiries = result['questions']
                if isinstance(inquiries, list) and len(inquiries) <= self.max_inquiries:
                    return inquiries
            # Fallback: Falls die Antwort direkt eine Liste ist
            elif isinstance(result, list) and len(result) <= self.max_inquiries:
                return result
            return []
        except json.JSONDecodeError as e:
            # Log den Fehler für Debugging
            import logging
            logger = logging.getLogger('celery')
            logger.error(f"JSON Decode Error in InquiryAgent: {str(e)}")
            logger.error(f"Response was: {response[:500]}")
            return []
    
    def validate_inquiry_quality(self, inquiry: str) -> bool:
        """
        Validate if an inquiry is of good quality
        
        Args:
            inquiry (str): The inquiry question to validate
            
        Returns:
            bool: True if the inquiry is well-formed
        """
        # Basic validation criteria
        if not inquiry or len(inquiry.strip()) < 10:
            return False
        
        # Check if it's a question
        if not inquiry.strip().endswith('?'):
            return False
        
        # Check for specific, actionable content
        specific_indicators = ['wie viel', 'wo', 'wann', 'wie oft', 'welche', 'was für']
        inquiry_lower = inquiry.lower()
        
        return any(indicator in inquiry_lower for indicator in specific_indicators)
    
