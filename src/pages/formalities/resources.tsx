import { Typography } from "@mui/material";

function FooterResourceDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="resource">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Resources
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="help_center">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Help Center
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Unser Help Center bietet schnelle und unkomplizierte Unterstützung direkt in der Chat-Anwendung. Nutzer können hier häufig gestellte Fragen durchstöbern, Anleitungen zur Nutzung der Plattform finden oder direkt mit einem Support-Mitarbeiter chatten. Unser Ziel ist es, Probleme effizient zu lösen und unseren Kunden jederzeit eine verlässliche Anlaufstelle für ihre Anliegen zu bieten. So bleibt der gesamte Risikoabsicherungprozess einfach und verständlich.
        </Typography>
        <br/>
        <br/>
        <div id="blog">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Blog
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          In unserem Blog teilen wir wertvolle Einblicke in die Versicherungswelt, geben Tipps zur Auswahl der richtigen Tarife und informieren über aktuelle Trends. Nutzer können sich hier über relevante Themen informieren und besser verstehen, welche Optionen am besten zu ihren Bedürfnissen passen. Unser Blog hilft dabei, komplexe Risikenfragen verständlich aufzubereiten und so die Entscheidungsfindung zu erleichtern.
        </Typography>
        <br/>
        <br/>
        <div id="tutorials">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Tutorials
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Mit unseren Tutorials machen wir es Nutzern einfach, alle Funktionen unserer Chat-Anwendung optimal zu nutzen. In interaktiven Schritt-für-Schritt-Anleitungen erklären wir, wie man Risiken inseriert und individuelle Verträge abschließt. Egal ob Anfänger oder erfahrener Nutzer – unsere Tutorials sorgen dafür, dass jeder die Plattform effizient und problemlos verwenden kann.
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

export default FooterResourceDescriptions;
