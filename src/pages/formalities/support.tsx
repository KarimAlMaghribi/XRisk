import { Typography } from "@mui/material";

function FooterSupportDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="support">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Support
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="developers">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Developers
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Unser Entwickler-Support stellt sicher, dass technische Teams die bestmögliche Unterstützung bei der Integration und Nutzung unserer Plattform erhalten. Ob es um APIs, Webhooks oder individuelle Anpassungen geht – Entwickler finden hier detaillierte Anleitungen, Codebeispiele und direkten Zugang zu unserem technischen Support. Unser Ziel ist es, eine nahtlose und effiziente Implementierung unserer Chat-Anwendung zu ermöglichen..
        </Typography>
        <br/>
        <br/>
        <div id="documentation">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Documentation
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Unsere umfassende Dokumentation bietet eine detaillierte Anleitung zur Nutzung und Integration unserer Plattform. Von ersten Einrichtungsschritten bis hin zu erweiterten Funktionen – hier finden Entwickler und Unternehmen alle relevanten Informationen. Klar strukturierte Inhalte, Beispiele und häufig gestellte Fragen helfen dabei, Herausforderungen schnell zu lösen und die Anwendung optimal zu nutzen.
        </Typography>
        <br/>
        <br/>
        <div id="integrations">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Integrations
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Unsere Chat-Anwendung lässt sich nahtlos in bestehende Systeme und Tools integrieren. Ob CRM-Systeme, Zahlungsdienste oder Analyseplattformen – wir bieten flexible Schnittstellen, um den Versicherungsprozess effizient in bestehende Workflows einzubinden. Nutzer finden hier eine Übersicht über alle verfügbaren Integrationen sowie Anleitungen zur schnellen Implementierung, damit alles reibungslos funktioniert.
        </Typography>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </>
  );
}

export default FooterSupportDescriptions;
