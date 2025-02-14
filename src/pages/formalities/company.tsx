import { Typography } from "@mui/material";

function FooterCompanyDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="company">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Company
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="press">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Press
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Unsere Chat-Anwendung revolutioniert die Art und Weise, wie Risikogeber und Risikonehmer miteinander kommunizieren. In unserem Pressebereich finden Journalisten und Medienvertreter aktuelle Pressemeldungen, Unternehmensupdates und Bildmaterial. Wir stehen für Innovation, Transparenz und eine moderne Lösung im Versicherungsbereich – und freuen uns, unsere Geschichte mit der Welt zu teilen. Presseanfragen sind jederzeit willkommen!
        </Typography>
        <br/>
        <br/>
        <div id="events">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Events
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Wir sind auf Branchenveranstaltungen, Messen und digitalen Konferenzen vertreten, um die Zukunft der Versicherungsbranche aktiv mitzugestalten. In unserem Event-Bereich finden Interessierte Informationen zu bevorstehenden Veranstaltungen, Webinaren und Networking-Möglichkeiten. Wir freuen uns darauf, mit Versicherern, Partnern und Interessenten in den direkten Austausch zu gehen und spannende Einblicke in unsere Lösung zu geben.
        </Typography>
        <br/>
        <br/>
        <div id="request_demo">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            Request Demo
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          Du möchtest unsere Chat-Anwendung in Aktion sehen? Mit unserer Live-Demo zeigen wir, wie Risikogeber und Risikonehmer nahtlos miteinander kommunizieren, Tarife vergleichen und Versicherungsabschlüsse einfach per Chat durchführen können. Unsere Experten führen dich durch die Funktionen und beantworten alle Fragen – unverbindlich und praxisnah. Vereinbare jetzt eine Demo und entdecke, wie unsere Lösung deinen Versicherungsprozess optimieren kann.
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

export default FooterCompanyDescriptions;
