import { LegalNavbar } from "./LegalNavbar";
import { LandingFooter } from "../landing/LandingFooter";
import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

interface ImpressumPageProps {
  onNavigateBack: () => void;
  onNavigate?: (page: string) => void;
}

export function ImpressumPage({ onNavigateBack, onNavigate }: ImpressumPageProps) {
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
            <h1 className="display-large text-primary mb-8">Impressum</h1>

            <div className="flex flex-col gap-8">
              {/* Angaben gemäß § 5 TMG */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Angaben gemäß § 5 TMG</h2>
                <div className="body-base text-primary space-y-2">
                  <p><strong>xRisk GmbH</strong></p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p>Deutschland</p>
                </div>
              </section>

              {/* Vertreten durch */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Vertreten durch</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Geschäftsführer: Max Mustermann, Lisa Musterfrau</p>
                </div>
              </section>

              {/* Kontakt */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Kontakt</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Telefon: +49 (0) 30 1234567</p>
                  <p>E-Mail: hello@xrisk.com</p>
                </div>
              </section>

              {/* Registereintrag */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Registereintrag</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Eintragung im Handelsregister</p>
                  <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
                  <p>Registernummer: HRB 123456 B</p>
                </div>
              </section>

              {/* Umsatzsteuer-ID */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Umsatzsteuer-ID</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                  <p>DE123456789</p>
                </div>
              </section>

              {/* Aufsichtsbehörde */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Aufsichtsbehörde</h2>
                <div className="body-base text-primary space-y-2">
                  <p><strong>Deutschland:</strong></p>
                  <p>Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)</p>
                  <p>Graurheindorfer Straße 108</p>
                  <p>53117 Bonn</p>
                  <p className="mt-4"><strong>Schweiz:</strong></p>
                  <p>Eidgenössische Finanzmarktaufsicht (FINMA)</p>
                  <p>Laupenstrasse 27</p>
                  <p>3003 Bern</p>
                </div>
              </section>

              {/* Verantwortlich für den Inhalt */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Max Mustermann</p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                </div>
              </section>

              {/* EU-Streitschlichtung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">EU-Streitschlichtung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#ff671f] hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                </div>
              </section>

              {/* Verbraucherstreitbeilegung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                </div>
              </section>

              {/* Haftungsausschluss */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Haftungsausschluss</h2>
                
                <h3 className="heading-3 text-primary mb-3 mt-6">Haftung für Inhalte</h3>
                <div className="body-base text-primary space-y-2">
                  <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
                  <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                </div>

                <h3 className="heading-3 text-primary mb-3 mt-6">Haftung für Links</h3>
                <div className="body-base text-primary space-y-2">
                  <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
                </div>

                <h3 className="heading-3 text-primary mb-3 mt-6">Urheberrecht</h3>
                <div className="body-base text-primary space-y-2">
                  <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
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