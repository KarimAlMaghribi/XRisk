"""
xrisk - Validation Agent
Author: Manuel Schott

Validation Agent for xrisk application
Validates if a given text describes a valid, insurable risk
"""

import json
from typing import Dict
from agents.base_agent import AIAgent
from config import Config


class ValidationAgent(AIAgent):
    """Agent verantwortlich für die Validierung von Risikobeschreibungen"""
    
    def validate_risk(self, risk_description: str) -> Dict:
        """
        Prüfen, ob der Text ein versicherbares Risiko beschreibt
        
        Args:
            risk_description (str): Die zu validierende Risikobeschreibung
            
        Returns:
            Dict: Validierungsergebnis mit 'valid' und 'reason' Schlüsseln
        """
        # Build system message with token limit
        max_tokens = Config.AGENT_MAX_TOKENS.get('validation', 500)
        system_content = f"""Sie sind Experte für Versicherungsrisikobewertung. Ihre Aufgabe ist es zu beurteilen, ob ein gegebener Text ein gültiges, versicherbares Risiko beschreibt.
**Antwortformat und Knappheit**
- Halten Sie Ihre Antwort möglichst kurz (unter {max_tokens} Tokens).
- Antworten Sie stets mit folgendem JSON-Objekt:
{{
"valid": true/false, // (Boolean): Gibt an, ob der Text ein gültiges, versicherbares Risiko beschreibt
"reason": "Begründung Ihrer Entscheidung" // (String): NUR angeben wenn valid false ist!
}}
- Geben Sie das Ergebnis ausschließlich im vorgegebenen JSON-Format zurück, ohne weitere Erklärungen oder Zusatztexte.
**Validierungskriterien**
**Verständlichkeit**: Die Beschreibung muss es ermöglichen, das versicherbare Risiko zu erkennen.
- Auch vage Begriffe wie „alte Kamera" oder „wertvolles Objekt" sind akzeptabel.
- Unverständliche Texte (z. B. ohne sinnvollen Kontext) sind ungültig.
- Der Inquiry Agent fragt später ggf. nach weiteren Details.
**Ungültige Beschreibungen (werden abgelehnt):**
- Kein versicherbares Risiko erkennbar
- Unverständlicher Text
- Illegale oder nicht versicherbare Aktivitäten
- Spekulative Investitionen
- Glücksspiel-bezogene Risiken
**Bei Ablehnung:**
- Formulieren Sie im Feld "reason" eine klare, knappe und hilfreiche Begründung auf Deutsch, wie der Nutzer seine Eingabe verbessern kann.
**Beachten Sie:** Vage Begriffe sind zulässig, da der Inquiry Agent später Details klärt.
**Weitere Hinweise**
- Verarbeiten Sie ausschließlich den übergebenen Text (String).
- Bei leerem, nicht-String oder völlig irrelevanten Input: Setzen Sie "valid": false und geben Sie als "reason" einen hilfreichen Hinweis zum erforderlichen Eingabeformat.
**Beispiele für eine gültige Antwort:**
{{
"valid": false,
"reason": "Beschreibung ist unverständlich und kein versicherbares Risiko."
}}"""

        messages = [
            {
                "role": "system",
                "content": system_content
            },
            {
                "role": "user",
                "content": f"Bitte validieren Sie diese Risikobeschreibung: {risk_description}"
            }
        ]
        
        response = self._make_request(messages)
        try:
            # Nutze die zentrale Methode zum Bereinigen der Response
            cleaned_response = self._clean_json_response(response)
            result = json.loads(cleaned_response)
            
            # Validate that 'valid' field exists
            if 'valid' not in result:
                raise ValueError("Response missing required field 'valid'")
            
            # Add default reason if missing when valid=false
            if result.get('valid') == False and 'reason' not in result:
                result['reason'] = "Die Eingabe konnte nicht als versicherbares Risiko akzeptiert werden. Bitte überarbeiten Sie Ihre Beschreibung."
            
            return result
        except (json.JSONDecodeError, ValueError) as e:
            raise Exception(f"Validation response parsing failed: {str(e)}")
    
