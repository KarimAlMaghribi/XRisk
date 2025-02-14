import { Typography } from "@mui/material";

export const Privacy = () => {
  return (
      <div>
          <br/>
          <br/>
          <div id="privacy">
          <Typography
              color="black" 
              variant="h4"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              Datenschutz
          </Typography>
          </div>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              Einleitung
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          Der Schutz deiner persönlichen Daten ist uns besonders wichtig. In dieser Datenschutzerklärung erläutern wir, welche Daten wir erfassen, wie wir sie verwenden und welche Rechte du als Nutzer hast. Unsere Chat-Anwendung wurde mit höchsten Sicherheitsstandards entwickelt, um deine Daten zu schützen und eine transparente Nutzung zu gewährleisten.
          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              Welche Daten wir erheben
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          Bei der Nutzung unserer Anwendung erfassen wir verschiedene Arten von Daten, darunter:
          <ul>
              <li>Persönliche Daten: Name, E-Mail-Adresse oder Kontaktinformationen, falls du diese im Chat bereitstellst.</li>
              <li>Kommunikationsdaten: Nachrichten, die zwischen Versicherern und Nutzern ausgetauscht werden, um eine optimale Beratung zu gewährleisten.</li>
              <li>Technische Daten: IP-Adresse, Gerätetyp und Browserinformationen zur Verbesserung der Benutzererfahrung und zur Sicherheitsüberwachung.</li>

          </ul>

          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              Wie wir deine Daten nutzen
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          Wir nutzen deine Daten ausschließlich, um dir eine sichere und effiziente Nutzung unserer Chat-Anwendung zu ermöglichen. Dazu gehören:
          <ul>
              <li>Bereitstellung und Verbesserung unserer Plattform </li>
              <li>Kommunikation zwischen Versicherern und Kunden</li>
              <li>Personalisierte Angebote basierend auf deinen Angaben</li>
              <li>Einhaltung gesetzlicher Anforderungen und Sicherheit</li>
          </ul>
          Deine Daten werden niemals ohne deine Zustimmung für Werbezwecke an Dritte weitergegeben.
          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              Speicherung und Löschung von Daten
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          Wir speichern deine Daten nur so lange, wie es für die Erbringung unserer Dienste notwendig oder gesetzlich vorgeschrieben ist. Auf Wunsch kannst du jederzeit eine Löschung deiner persönlichen Daten beantragen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              Deine Rechte
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          Als Nutzer hast du das Recht auf:
          <ul>
              <li>Auskunft: Welche Daten wir über dich gespeichert haben. </li>
              <li>Berichtigung: Falls deine Daten fehlerhaft oder unvollständig sind.</li>
              <li>Die Entfernung deiner Daten, sofern dies gesetzlich zulässig ist.</li>
              <li>Du kannst der Verarbeitung deiner Daten widersprechen, insbesondere für Marketingzwecke.</li>
          </ul>
          Bei Fragen zur Datennutzung oder zur Ausübung deiner Rechte kannst du uns jederzeit kontaktieren.
          </Typography>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
      </div>
      )
}

export default Privacy;
