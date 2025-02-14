import { Typography } from "@mui/material";

function FooterProductDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="product">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Produkt
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="price">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Preise
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Wir legen Wert auf transparente und faire Preise. In unserer Chat-Anwendung können Risikonehmer direkt Informationen zu den verfügbaren Risiken erhalten und vergleichen. Der Risikogeber kann individuell angepasste Angebote erstellen und Rabatte oder Sonderkonditionen direkt im Chat kommunizieren. So wird der gesamte Preisfindungsprozess unkompliziert und verständlich, damit jeder Kunde die beste Versicherung für sein Budget findet.
        </Typography>
        <br/>
        <br/>
        <div id="overview">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Übersicht
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Damit Nutzer schnell einen Überblick über ihre Optionen erhalten, bietet unsere Anwendung eine klare und strukturierte Darstellung aller relevanten Informationen. Direkt im Chat können Tarife, Leistungen und Vorteile mit Hilder der Chatbot verglichen werden. Risikonehmer können durch gezielte Nachrichten oder interaktive Vorschläge dabei helfen, die perfekte Lösung für den individuellen Bedarf zu finden. So stellen wir sicher, dass jeder Nutzer eine fundierte Entscheidung treffen kann.
        </Typography>
        <br/>
        <br/>
        <div id="browse">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Durchsuchen
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Unsere Anwendung macht es einfach, durch verschiedene Risiken zu stöbern. Nutzer können direkt im Chat Fragen zu bestimmten Tarifen stellen oder durch intelligente Filteroptionen passende Risiken entdecken. Der Risikonehmer kann zudem gezielte Empfehlungen aussprechen, basierend auf den Präferenzen und Bedürfnissen des Risikogebers. So wird der Auswahlprozess effizient und individuell zugeschnitten.
        </Typography>
        <br/>
        <br/>
        <div id="accessibility">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Barrierefreiheit (BETA)
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Jeder sollte in der Lage sein seine/ihre Risiken bereitzustellen – deshalb setzen wir auf eine barrierefreie Nutzung unserer Anwendung. In der BETA-Version unserer Accessibility-Funktionen bieten wir eine optimierte Darstellung für Menschen mit Seh- oder Hörbeeinträchtigungen sowie anpassbare Texte und Kontraste für eine bessere Lesbarkeit. Zudem unterstützen wir sprachgesteuerte Eingaben, damit jeder unsere Anwendung mühelos nutzen kann. Unser Ziel ist es, eine inklusive Plattform zu schaffen, die allen Nutzern eine einfache und verständliche Interaktion ermöglicht.
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

export default FooterProductDescriptions;
