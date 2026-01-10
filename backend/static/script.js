// Global variables
let currentRiskUuid = null;
let currentUserUuid = null;
let currentStatus = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateUserUuid();
    setDefaultDates();
    setupEventListeners();
});

// Generate a new user UUID
function generateUserUuid() {
    currentUserUuid = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    document.getElementById('userUuid').value = currentUserUuid;
}

// Set default dates (start: today, end: 1 year from today)
function setDefaultDates() {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    
    document.getElementById('startDate').value = today.toISOString().split('T')[0];
    document.getElementById('endDate').value = nextYear.toISOString().split('T')[0];
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('generateUuid').addEventListener('click', generateUserUuid);
    document.getElementById('riskForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('submitInquiries').addEventListener('click', submitInquiries);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const selectedEndpoint = document.getElementById('endpointSelect').value;
    
    if (!selectedEndpoint) {
        showError('Bitte wählen Sie einen REST-Endpunkt aus.');
        return;
    }
    
    const data = {
        user_uuid: formData.get('userUuid'),
        initial_prompt: formData.get('riskDescription'),
        start_date: formData.get('startDate'),
        end_date: formData.get('endDate')
    };
    
    showLoading('Verarbeite Anfrage...');
    
    try {
        let response;
        
        switch(selectedEndpoint) {
            case '/risk/validate':
                response = await callAPI('/risk/validate', 'POST', data);
                if (response.risk_uuid) {
                    currentRiskUuid = response.risk_uuid;
                    currentStatus = 'validated';
                    showSuccess('Risiko erfolgreich validiert!');
                    showStatus('Bereit für den nächsten Schritt: Klassifizierung');
                }
                break;
                
            case '/risk/classification':
                if (!currentRiskUuid) {
                    showError('Bitte validieren Sie zuerst das Risiko.');
                    return;
                }
                response = await callAPI('/risk/classification', 'POST', {
                    user_uuid: currentUserUuid,
                    risk_uuid: currentRiskUuid
                });
                if (response.risk_type) {
                    currentStatus = 'classified';
                    showSuccess(`Risiko klassifiziert als: ${response.risk_type}`);
                    showStatus('Bereit für den nächsten Schritt: Rückfragen');
                }
                break;
                
            case '/risk/inquiry':
                if (!currentRiskUuid) {
                    showError('Bitte validieren und klassifizieren Sie zuerst das Risiko.');
                    return;
                }
                response = await callAPI('/risk/inquiry', 'POST', {
                    user_uuid: currentUserUuid,
                    risk_uuid: currentRiskUuid
                });
                if (response.inquiries) {
                    currentStatus = response.status;
                    if (response.inquiries.length > 0) {
                        showInquiries(response.inquiries);
                    } else {
                        showSuccess('Keine zusätzlichen Informationen erforderlich.');
                        showStatus('Bereit für den nächsten Schritt: Recherche');
                    }
                }
                break;
                
            case '/risk/research':
                if (!currentRiskUuid) {
                    showError('Bitte führen Sie zuerst alle vorherigen Schritte durch.');
                    return;
                }
                response = await callAPI('/risk/research', 'POST', {
                    user_uuid: currentUserUuid,
                    risk_uuid: currentRiskUuid
                });
                if (response.status === 'researched') {
                    currentStatus = 'researched';
                    showSuccess('Recherche abgeschlossen!');
                    showResearchResults(response);
                    showStatus('Bereit für den nächsten Schritt: Analyse');
                }
                break;
                
            case '/risk/analysis':
                if (!currentRiskUuid) {
                    showError('Bitte führen Sie zuerst alle vorherigen Schritte durch.');
                    return;
                }
                response = await callAPI('/risk/analysis', 'POST', {
                    user_uuid: currentUserUuid,
                    risk_uuid: currentRiskUuid
                });
                if (response.status === 'analyzed') {
                    currentStatus = 'analyzed';
                    showSuccess('Risikoanalyse abgeschlossen!');
                    showAnalysisResults(response.analysis);
                    showStatus('Bereit für den nächsten Schritt: Bericht');
                }
                break;
                
            case '/risk/report':
                if (!currentRiskUuid) {
                    showError('Bitte führen Sie zuerst alle vorherigen Schritte durch.');
                    return;
                }
                response = await callAPI('/risk/report', 'POST', {
                    user_uuid: currentUserUuid,
                    risk_uuid: currentRiskUuid
                });
                if (response.status === 'completed') {
                    currentStatus = 'completed';
                    showSuccess('Bericht erstellt!');
                    showReport(response.report);
                }
                break;
        }
        
    } catch (error) {
        showError(`Fehler: ${error.message}`);
    }
}

// Call API endpoint
async function callAPI(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(endpoint, options);
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.error || 'API-Fehler');
    }
    
    return result;
}

// Note: Automatic progression removed - each step must be manually executed

// Show inquiries
function showInquiries(inquiries) {
    const inquirySection = document.getElementById('inquirySection');
    const inquiryContent = document.getElementById('inquiryContent');
    
    inquiryContent.innerHTML = '';
    
    inquiries.forEach((inquiry, index) => {
        const inquiryItem = document.createElement('div');
        inquiryItem.className = 'inquiry-item';
        inquiryItem.innerHTML = `
            <div class="inquiry-question">Frage ${index + 1}: ${inquiry}</div>
            <textarea class="inquiry-response" data-index="${index}" placeholder="Ihre Antwort..."></textarea>
        `;
        inquiryContent.appendChild(inquiryItem);
    });
    
    inquirySection.style.display = 'block';
}

// Submit inquiry responses
async function submitInquiries() {
    const responses = [];
    const responseElements = document.querySelectorAll('.inquiry-response');
    
    responseElements.forEach(element => {
        responses.push(element.value);
    });
    
    if (responses.some(response => !response.trim())) {
        showError('Bitte beantworten Sie alle Fragen.');
        return;
    }
    
    showLoading('Sende Antworten...');
    
    try {
        const response = await callAPI('/risk/inquiry', 'POST', {
            user_uuid: currentUserUuid,
            risk_uuid: currentRiskUuid,
            responses: responses
        });
        
        if (response.status === 'inquired') {
            currentStatus = 'inquired';
            showSuccess('Antworten erfolgreich gesendet!');
            document.getElementById('inquirySection').style.display = 'none';
            showStatus('Bereit für den nächsten Schritt: Recherche');
        }
    } catch (error) {
        // Deutsche Fehlermeldungen basierend auf Fehlertyp
        let germanErrorMessage = 'Unbekannter Fehler';
        
        if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            germanErrorMessage = 'Netzwerkfehler - Bitte prüfen Sie Ihre Internetverbindung';
        } else if (error.message.includes('timeout')) {
            germanErrorMessage = 'Zeitüberschreitung - Der Server antwortet nicht';
        } else if (error.message.includes('500')) {
            germanErrorMessage = 'Serverfehler - Bitte versuchen Sie es später erneut';
        } else if (error.message.includes('404')) {
            germanErrorMessage = 'Endpunkt nicht gefunden - Bitte kontaktieren Sie den Support';
        } else {
            germanErrorMessage = error.message;
        }
        
        showError(`Fehler beim Senden der Antworten: ${germanErrorMessage}`, true);
    }
}

// Show research results
function showResearchResults(response) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <h3>Rechercheergebnisse</h3>
        <div class="json-display">${JSON.stringify(response, null, 2)}</div>
    `;
    
    resultsSection.style.display = 'block';
}

// Show analysis results
function showAnalysisResults(analysis) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <h3>Risikoanalyse</h3>
        <div class="analysis-results">
            <p><strong>Eintrittswahrscheinlichkeit:</strong> ${analysis.probability_percentage}%</p>
            <p><strong>Erwarteter Gesamtschaden:</strong> €${analysis.expected_damage.toLocaleString()}</p>
            <p><strong>Analysehinweise:</strong> ${analysis.analysis_notes}</p>
        </div>
    `;
    
    resultsSection.style.display = 'block';
}

// Show final report
function showReport(report) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <h3>Abschlussbericht</h3>
        <div class="report-content">
            <h4>Zusammenfassung</h4>
            <p>${report.executive_summary || 'Keine Zusammenfassung verfügbar'}</p>
            
            <h4>Klassifizierung</h4>
            <p>${report.classification || 'Keine Klassifizierung verfügbar'}</p>
            
            <h4>Analyse</h4>
            <p>${report.analysis_summary || 'Keine Analyse verfügbar'}</p>
            
            <h4>Empfehlungen</h4>
            <ul>
                ${(report.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            
            <h4>Quellen</h4>
            <ul>
                ${(report.sources || []).map(source => `<li>${source}</li>`).join('')}
            </ul>
            
            <h4>Unsicherheiten</h4>
            <ul>
                ${(report.uncertainties || []).map(uncertainty => `<li>${uncertainty}</li>`).join('')}
            </ul>
        </div>
    `;
    
    resultsSection.style.display = 'block';
}

// Utility functions
function showLoading(message) {
    const statusContent = document.getElementById('statusContent');
    statusContent.innerHTML = `<div class="loading"></div>${message}`;
}

function showSuccess(message) {
    const statusContent = document.getElementById('statusContent');
    statusContent.innerHTML = `<div class="success">${message}</div>`;
}

function showError(message, showRetry = false) {
    const statusContent = document.getElementById('statusContent');
    
    let errorHtml = `<div class="error">${message}</div>`;
    
    if (showRetry) {
        errorHtml += `
            <div class="error-actions" style="margin-top: 15px;">
                <button class="btn btn-primary" onclick="retryLastAction()" style="margin-right: 10px;">
                    🔄 Erneut versuchen
                </button>
                <button class="btn btn-secondary" onclick="resetForm()">
                    🔄 Formular zurücksetzen
                </button>
            </div>
        `;
    }
    
    statusContent.innerHTML = errorHtml;
}

function showStatus(message) {
    const statusContent = document.getElementById('statusContent');
    statusContent.innerHTML = `<p>${message}</p>`;
}

function retryLastAction() {
    // Versuche die letzte Aktion erneut
    if (currentStatus === 'inquired' || document.getElementById('inquirySection').style.display !== 'none') {
        // Retry inquiry submission
        submitInquiries();
    } else {
        showStatus('Keine wiederholbare Aktion verfügbar. Bitte starten Sie den Prozess neu.');
    }
}

function resetForm() {
    document.getElementById('riskForm').reset();
    generateUserUuid();
    setDefaultDates();
    currentRiskUuid = null;
    currentStatus = null;
    
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('inquirySection').style.display = 'none';
    document.getElementById('statusContent').innerHTML = '<p>Bereit für Risikobewertung</p>';
}
