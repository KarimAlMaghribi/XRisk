import { LegalNavbar } from "./LegalNavbar";
import { LandingFooter } from "../landing/LandingFooter";
import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

interface DatenschutzPageProps {
  onNavigateBack: () => void;
  onNavigate?: (page: string) => void;
}

export function DatenschutzPage({ onNavigateBack, onNavigate }: DatenschutzPageProps) {
  return (
    <div className="bg-[#fdfcfc] min-h-screen">
      {/* Navbar */}
      <LegalNavbar 
        logo={imgLogo}
        onLogoClick={onNavigateBack}
      />

      {/* Content */}
      <div className="container-grid pt-[120px] section-spacing-bottom">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <h1 className="display-large text-primary mb-8">Datenschutzerklärung</h1>

            <div className="flex flex-col gap-8">
              {/* Einleitung */}
              <section>
                <div className="body-base text-primary space-y-2">
                  <p>Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten.</p>
                  <p className="mt-4"><strong>Stand:</strong> 22. November 2024</p>
                </div>
              </section>

              {/* Verantwortlicher */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Verantwortlicher</h2>
                <div className="body-base text-primary space-y-2">
                  <p><strong>xRisk GmbH</strong></p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p>Deutschland</p>
                  <p className="mt-4"><strong>E-Mail:</strong> datenschutz@xrisk.com</p>
                  <p><strong>Impressum:</strong> <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); onNavigate?.("impressum"); }} className="text-[#ff671f] hover:underline">Link zum Impressum</a></p>
                </div>
              </section>

              {/* Übersicht der Verarbeitungen */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Übersicht der Verarbeitungen</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.</p>
                  
                  <h3 className="heading-3 text-primary mb-3 mt-6">Arten der verarbeiteten Daten</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Bestandsdaten (z.B. Namen, Adressen)</li>
                    <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
                    <li>Inhaltsdaten (z.B. Eingaben in Onlineformularen)</li>
                    <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten)</li>
                    <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
                    <li>Bonitätsdaten (z.B. Kreditwürdigkeit)</li>
                    <li>Vertragsdaten (z.B. Vertragsgegenstand, Laufzeit)</li>
                    <li>Zahlungsdaten (z.B. Bankverbindungen, Rechnungen)</li>
                  </ul>

                  <h3 className="heading-3 text-primary mb-3 mt-6">Kategorien betroffener Personen</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Kommunikationspartner</li>
                    <li>Nutzer (z.B. Webseitenbesucher, Nutzer von Onlinediensten)</li>
                    <li>Geschäfts- und Vertragspartner</li>
                    <li>Interessenten</li>
                  </ul>

                  <h3 className="heading-3 text-primary mb-3 mt-6">Zwecke der Verarbeitung</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Erbringung vertraglicher Leistungen und Kundenservice</li>
                    <li>Kontaktanfragen und Kommunikation</li>
                    <li>Sicherheitsmaßnahmen</li>
                    <li>Reichweitenmessung</li>
                    <li>Verwaltung und Beantwortung von Anfragen</li>
                    <li>Feedback</li>
                    <li>Marketing</li>
                    <li>Profile mit nutzerbezogenen Informationen</li>
                    <li>Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit</li>
                  </ul>
                </div>
              </section>

              {/* Maßgebliche Rechtsgrundlagen */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Maßgebliche Rechtsgrundlagen</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)</strong> - Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.</li>
                    <li><strong>Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)</strong> - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich.</li>
                    <li><strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO)</strong> - Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.</li>
                    <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)</strong> - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich.</li>
                  </ul>
                </div>
              </section>

              {/* Sicherheitsmaßnahmen */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Sicherheitsmaßnahmen</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.</p>
                  <p>Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.</p>
                  <p><strong>TLS-Verschlüsselung (https):</strong> Um Ihre via unserem Online-Angebot übermittelten Daten zu schützen, nutzen wir eine TLS-Verschlüsselung. Sie erkennen derart verschlüsselte Verbindungen an dem Präfix https:// in der Adresszeile Ihres Browsers.</p>
                </div>
              </section>

              {/* Weitergabe von personenbezogenen Daten */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Übermittlung von personenbezogenen Daten</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass die Daten an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt oder sie ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten können z.B. mit IT-Aufgaben beauftragte Dienstleister oder Anbieter von Diensten und Inhalten, die in eine Webseite eingebunden werden, gehören. In solchen Fällen beachten wir die gesetzlichen Vorgaben und schließen insbesondere entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.</p>
                </div>
              </section>

              {/* Bereitstellung des Onlineangebotes */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Bereitstellung des Onlineangebotes und Webhosting</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu übermitteln.</p>
                  
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Verarbeitete Datenarten:</strong> Nutzungsdaten, Meta-/Kommunikationsdaten</li>
                    <li><strong>Betroffene Personen:</strong> Nutzer</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit, Informationstechnische Infrastruktur</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)</li>
                  </ul>
                </div>
              </section>

              {/* Zahlungsdienstleister */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Zahlungsdienstleister</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Im Rahmen von Vertrags- und sonstigen Rechtsbeziehungen, aufgrund gesetzlicher Pflichten oder sonst auf Grundlage unserer berechtigten Interessen bieten wir den betroffenen Personen effiziente und sichere Zahlungsmöglichkeiten an und setzen hierzu neben Banken und Kreditinstituten weitere Zahlungsdienstleister ein (zusammenfassend "Zahlungsdienstleister").</p>
                  <p>Zu den durch die Zahlungsdienstleister verarbeiteten Daten gehören Bestandsdaten, wie z.B. der Name und die Adresse, Bankdaten, wie z.B. Kontonummern oder Kreditkartennummern, Passwörter, TANs und Prüfsummen sowie die Vertrags-, Summen- und empfängerbezogenen Angaben.</p>
                  
                  <div className="mt-4 p-4 bg-[#fff5f0] border-l-4 border-[#ff671f] rounded">
                    <p className="font-semibold text-primary mb-2">Stripe Payment Gateway</p>
                    <p>Wir nutzen Stripe als Zahlungsdienstleister. Stripe wird von Stripe Inc., 510 Townsend Street, San Francisco, CA 94103, USA betrieben.</p>
                    <p className="mt-2">Datenschutzerklärung: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#ff671f] hover:underline">https://stripe.com/privacy</a></p>
                  </div>
                </div>
              </section>

              {/* Kontakt und Anfragenverwaltung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Kontakt- und Anfragenverwaltung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular, E-Mail, Telefon oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und Geschäftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet soweit dies zur Beantwortung der Kontaktanfragen und etwaiger angefragter Maßnahmen erforderlich ist.</p>
                  
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Verarbeitete Datenarten:</strong> Kontaktdaten, Inhaltsdaten, Nutzungsdaten, Meta-/Kommunikationsdaten</li>
                    <li><strong>Betroffene Personen:</strong> Kommunikationspartner</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Kontaktanfragen und Kommunikation, Verwaltung und Beantwortung von Anfragen, Feedback</li>
                    <li><strong>Rechtsgrundlagen:</strong> Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)</li>
                  </ul>
                </div>
              </section>

              {/* Betroffenenrechte */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Rechte der betroffenen Personen</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:</p>
                  
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.</li>
                    <li><strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.</li>
                    <li><strong>Auskunftsrecht:</strong> Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.</li>
                    <li><strong>Recht auf Berichtigung:</strong> Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.</li>
                    <li><strong>Recht auf Löschung und Einschränkung der Verarbeitung:</strong> Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.</li>
                    <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.</li>
                    <li><strong>Beschwerde bei Aufsichtsbehörde:</strong> Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die Vorgaben der DSGVO verstößt.</li>
                  </ul>
                </div>
              </section>

              {/* Begriffsdefinitionen */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Begriffsdefinitionen</h2>
                <div className="body-base text-primary space-y-4">
                  <p>In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser Datenschutzerklärung verwendeten Begrifflichkeiten.</p>
                  
                  <div>
                    <p className="font-semibold">Personenbezogene Daten:</p>
                    <p>"Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden "betroffene Person") beziehen.</p>
                  </div>

                  <div>
                    <p className="font-semibold">Verantwortlicher:</p>
                    <p>Als "Verantwortlicher" wird die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet, bezeichnet.</p>
                  </div>

                  <div>
                    <p className="font-semibold">Verarbeitung:</p>
                    <p>"Verarbeitung" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}