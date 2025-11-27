import { LegalNavbar } from "./LegalNavbar";
import { LandingFooter } from "../landing/LandingFooter";
import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

interface AGBPageProps {
  onNavigateBack: () => void;
  onNavigate?: (page: string) => void;
}

export function AGBPage({ onNavigateBack, onNavigate }: AGBPageProps) {
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
            <h1 className="display-large text-primary mb-8">Allgemeine Geschäftsbedingungen</h1>

            <div className="flex flex-col gap-8">
              {/* Präambel */}
              <section>
                <div className="body-base text-primary space-y-2">
                  <p>Diese Allgemeinen Geschäftsbedingungen (im Folgenden "AGB") regeln die Nutzung der Plattform xRisk und die vertraglichen Beziehungen zwischen der xRisk GmbH (im Folgenden "xRisk" oder "wir") und den Nutzern der Plattform (im Folgenden "Nutzer" oder "Sie").</p>
                  <p className="mt-4"><strong>Stand:</strong> 22. November 2024</p>
                </div>
              </section>

              {/* 1. Geltungsbereich */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 1 Geltungsbereich und Vertragsgegenstand</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Diese AGB gelten für alle Verträge zwischen xRisk und den Nutzern der xRisk-Plattform. Die Plattform ermöglicht es Nutzern, individuelle Risiken mit anderen Nutzern zu teilen und abzusichern.</p>
                  <p>(2) xRisk fungiert als Vermittler zwischen Risikogebern (Personen, die ein Risiko übernehmen) und Risikonehmern (Personen, die sich gegen ein Risiko absichern möchten). xRisk ist nicht selbst Vertragspartei der Risikoübernahme-Verträge.</p>
                  <p>(3) Abweichende AGB des Nutzers werden nicht anerkannt, es sei denn, xRisk stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
                </div>
              </section>

              {/* 2. Vertragsschluss und Registrierung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 2 Vertragsschluss und Registrierung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Zur Nutzung der xRisk-Plattform ist eine Registrierung erforderlich. Mit der Registrierung gibt der Nutzer ein verbindliches Angebot zum Abschluss eines Nutzungsvertrages ab.</p>
                  <p>(2) xRisk kann das Angebot durch Zusendung einer Bestätigungs-E-Mail oder durch Freischaltung des Zugangs annehmen. Mit der Annahme kommt der Nutzungsvertrag zustande.</p>
                  <p>(3) Zur Registrierung sind wahrheitsgemäße und vollständige Angaben erforderlich. Der Nutzer verpflichtet sich, seine Daten aktuell zu halten.</p>
                  <p>(4) Die Nutzung der Plattform ist nur volljährigen, geschäftsfähigen Personen gestattet.</p>
                </div>
              </section>

              {/* 3. Leistungsumfang */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 3 Leistungsumfang</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) xRisk stellt eine technische Plattform zur Verfügung, über die Nutzer:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Risiken beschreiben und zur Absicherung anbieten können (Risikonehmer)</li>
                    <li>Angebote zur Risikoübernahme abgeben können (Risikogeber)</li>
                    <li>Verträge über Risikoübernahmen abschließen können</li>
                    <li>KI-gestützte Risikobewertungen erhalten können</li>
                  </ul>
                  <p>(2) xRisk schuldet keine Verfügbarkeit von 100%. Wartungsarbeiten, technische Störungen oder höhere Gewalt können zu vorübergehenden Einschränkungen führen.</p>
                  <p>(3) xRisk behält sich vor, die Funktionalität der Plattform weiterzuentwickeln, zu ändern oder einzuschränken, sofern dies für den Nutzer zumutbar ist.</p>
                </div>
              </section>

              {/* 4. Verifizierung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 4 Verifizierung und Bonitätsprüfung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) xRisk führt eine Identitätsprüfung aller Nutzer durch. Hierzu ist die Vorlage eines gültigen Ausweisdokuments sowie die Durchführung eines Video-Ident-Verfahrens oder eines vergleichbaren Verfahrens erforderlich.</p>
                  <p>(2) Für Risikogeber kann zusätzlich eine Bonitätsprüfung erforderlich sein. Der Nutzer stimmt dieser Prüfung mit der Registrierung zu.</p>
                  <p>(3) xRisk kann die Nutzung bestimmter Funktionen von einer erfolgreichen Verifizierung abhängig machen.</p>
                </div>
              </section>

              {/* 5. Risikoübernahme-Verträge */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 5 Risikoübernahme-Verträge</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Über die Plattform können Nutzer Verträge über die Übernahme von Risiken abschließen. Vertragsparteien dieser Verträge sind ausschließlich Risikogeber und Risikonehmer; xRisk ist nicht Vertragspartei.</p>
                  <p>(2) Die konkreten Vertragsbedingungen (insbesondere Risikobeschreibung, Prämie, Leistungsfall, Laufzeit) werden zwischen den Vertragsparteien individuell vereinbart.</p>
                  <p>(3) xRisk stellt lediglich die technische Infrastruktur für den Vertragsabschluss und die Abwicklung zur Verfügung.</p>
                  <p>(4) Für die Erfüllung der Risikoübernahme-Verträge sind ausschließlich die jeweiligen Vertragsparteien verantwortlich.</p>
                </div>
              </section>

              {/* 6. KI-Risikobewertung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 6 KI-Risikobewertung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) xRisk bietet eine KI-gestützte Risikobewertung an, die Nutzern bei der Einschätzung und Preisfindung für Risiken unterstützt.</p>
                  <p>(2) Die KI-Bewertung stellt lediglich eine unverbindliche Empfehlung dar. Sie ersetzt keine professionelle Beratung und begründet keine Haftung von xRisk für die Richtigkeit oder Vollständigkeit.</p>
                  <p>(3) Die endgültige Entscheidung über den Abschluss eines Risikoübernahme-Vertrags und die Konditionen liegt ausschließlich bei den Nutzern.</p>
                </div>
              </section>

              {/* 7. Zahlungsabwicklung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 7 Zahlungsabwicklung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Die Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe. Es gelten die AGB und Datenschutzbestimmungen von Stripe.</p>
                  <p>(2) Bei Vertragsabschluss wird die vereinbarte Risikogebühr (Prämie) vom Risikonehmer an den Risikogeber gezahlt.</p>
                  <p>(3) Der potenzielle Leistungsbetrag wird auf der Kreditkarte des Risikogebers reserviert. Im Leistungsfall wird dieser Betrag freigegeben und an den Risikonehmer ausgezahlt.</p>
                  <p>(4) xRisk erhebt für die Vermittlung und Abwicklung eine Gebühr, deren Höhe auf der Plattform transparent ausgewiesen wird.</p>
                </div>
              </section>

              {/* 8. Leistungsfall */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 8 Leistungsfall und Streitbeilegung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Der Eintritt eines Leistungsfalls wird gemäß den individuellen Vertragsbedingungen zwischen Risikogeber und Risikonehmer festgestellt.</p>
                  <p>(2) Der Risikonehmer ist verpflichtet, den Leistungsfall gemäß den Vertragsbedingungen nachzuweisen.</p>
                  <p>(3) Bei Streitigkeiten über das Vorliegen eines Leistungsfalls können die Parteien einen unabhängigen Gutachter oder Schlichter einschalten. xRisk kann hierfür eine Liste qualifizierter Dienstleister zur Verfügung stellen.</p>
                  <p>(4) Im Streitfall kann xRisk die Auszahlung bis zur Klärung zurückhalten.</p>
                </div>
              </section>

              {/* 9. Pflichten des Nutzers */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 9 Pflichten des Nutzers</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Der Nutzer ist verpflichtet:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Wahrheitsgemäße und vollständige Angaben zu machen</li>
                    <li>Seine Zugangsdaten geheim zu halten und vor dem Zugriff Dritter zu schützen</li>
                    <li>xRisk unverzüglich zu informieren, wenn Anhaltspunkte dafür bestehen, dass Zugangsdaten missbraucht wurden</li>
                    <li>Keine Inhalte zu veröffentlichen, die gegen geltendes Recht verstoßen</li>
                    <li>Die Rechte Dritter (insbesondere Urheberrechte, Markenrechte, Persönlichkeitsrechte) zu beachten</li>
                  </ul>
                  <p>(2) Der Nutzer ist für alle Aktivitäten verantwortlich, die unter Verwendung seiner Zugangsdaten vorgenommen werden.</p>
                </div>
              </section>

              {/* 10. Haftung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 10 Haftung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) xRisk haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung von xRisk oder eines gesetzlichen Vertreters oder Erfüllungsgehilfen beruhen.</p>
                  <p>(2) Für sonstige Schäden haftet xRisk nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), jedoch der Höhe nach beschränkt auf die bei Vertragsschluss vorhersehbaren vertragstypischen Schäden.</p>
                  <p>(3) Die Haftung für einfache Fahrlässigkeit ist ausgeschlossen, soweit nicht Kardinalpflichten betroffen sind.</p>
                  <p>(4) xRisk haftet nicht für die Erfüllung der zwischen den Nutzern geschlossenen Risikoübernahme-Verträge.</p>
                  <p>(5) Die vorstehenden Haftungsbeschränkungen gelten nicht bei arglistigem Verschweigen eines Mangels und bei Übernahme einer Garantie.</p>
                </div>
              </section>

              {/* 11. Laufzeit und Kündigung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 11 Laufzeit und Kündigung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Der Nutzungsvertrag wird auf unbestimmte Zeit geschlossen.</p>
                  <p>(2) Beide Parteien können den Nutzungsvertrag jederzeit mit einer Frist von 14 Tagen kündigen.</p>
                  <p>(3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor, wenn:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Der Nutzer gegen wesentliche Pflichten aus diesen AGB verstößt</li>
                    <li>Der Nutzer falsche Angaben gemacht hat</li>
                    <li>Der Nutzer die Plattform missbräuchlich nutzt</li>
                  </ul>
                  <p>(4) Bei Kündigung des Nutzungsvertrags bleiben bestehende Risikoübernahme-Verträge zwischen Nutzern hiervon unberührt und sind weiterhin zu erfüllen.</p>
                </div>
              </section>

              {/* 12. Datenschutz */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 12 Datenschutz</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); onNavigate?.("datenschutz"); }} className="text-[#ff671f] hover:underline">Datenschutzerklärung</a>.</p>
                </div>
              </section>

              {/* 13. Änderungen der AGB */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 13 Änderung der AGB</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) xRisk behält sich vor, diese AGB zu ändern, sofern dies zur Anpassung an geänderte Rechtslage, höchstrichterliche Rechtsprechung oder Marktgegebenheiten erforderlich ist.</p>
                  <p>(2) Änderungen werden dem Nutzer mindestens 4 Wochen vor ihrem Inkrafttreten per E-Mail mitgeteilt.</p>
                  <p>(3) Widerspricht der Nutzer der Geltung der neuen AGB nicht innerhalb von 4 Wochen nach Zugang der Mitteilung, gelten die geänderten AGB als angenommen. xRisk wird den Nutzer in der Änderungsmitteilung auf diese Folge hinweisen.</p>
                </div>
              </section>

              {/* 14. Schlussbestimmungen */}
              <section>
                <h2 className="heading-2 text-primary mb-4">§ 14 Schlussbestimmungen</h2>
                <div className="body-base text-primary space-y-2">
                  <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften des Staates, in dem der Nutzer seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.</p>
                  <p>(2) Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag Berlin. Gleiches gilt, wenn der Nutzer keinen allgemeinen Gerichtsstand in Deutschland hat.</p>
                  <p>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.</p>
                </div>
              </section>

              {/* Kontakt */}
              <section className="mt-8 p-6 bg-[#fff5f0] rounded-lg border border-[#ff671f]/20">
                <h2 className="heading-2 text-primary mb-4">Fragen zu den AGB?</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Bei Fragen zu unseren Allgemeinen Geschäftsbedingungen können Sie uns jederzeit kontaktieren:</p>
                  <p className="mt-4"><strong>E-Mail:</strong> legal@xrisk.com</p>
                  <p><strong>Telefon:</strong> +49 (0) 30 1234567</p>
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