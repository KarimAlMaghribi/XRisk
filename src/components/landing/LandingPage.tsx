import { useState, useEffect } from "react";
import svgPaths from "../../imports/svg-81dejan7f8";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import heroPlaceholder from "../../assests/imgs/desert_1-min.png";
import { RiskInputModal } from "./RiskInputModal";
import { LandingNavbar } from "./LandingNavbar";
import { FAQSection } from "./FAQSection";
import { NeuesteRisikenSection } from "./NeuesteRisikenSection";
import { PersistentCaseSwitcher, DesktopSwitcher } from "./PersistentCaseSwitcher";
import SectionWasIstXrisk from "../../imports/SectionWasIstXrisk";
import SectionTestimonial from "../../imports/SectionWasIstXrisk-4013-1246";
import { ArrowRight } from "lucide-react";
import { LandingButton } from "./LandingButton";

interface LandingPageProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
  onNavigate?: (page: string) => void;
}

export function LandingPage({ onLogin, isLoggedIn = false, onNavigate }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [riskInput, setRiskInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<"market" | "bus">("market");
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  const variants = {
    market: {
      heroImage: heroPlaceholder,
      heroImageMobile: heroPlaceholder,
      headline: (
        <>
          <span>Wenn das Wetter </span>
          <span className="text-[#ff671f]">deinen Markttag </span>
          <span>verhagelt.</span>
        </>
      ),
      subheadline:
        "Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.",
      testimonialImage: heroPlaceholder,
      testimonialName: "Lena, Künstlerin",
      testimonialQuote: "\"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall.\"",
      processImage: heroPlaceholder,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      step1Title: "Sag uns, was du absichern möchtest",
      step1Description:
        "\"Ich verkaufe Kunst auf Wochenmärkten. Wenn es regnet, bleiben die Leute weg und ich verdiene nichts.\"",
      step2Title: "Experten machen dir ein Angebot",
      step2Description:
        "Martin sieht deine Anfrage: \"Als Landwirt kenne ich Wetter. Für eine angemessene Prämie übernehme ich dein Wetterrisiko.\"",
      step3Title: "Du wählst und bist abgesichert",
      step3Description: "Du nimmst Martins Angebot an. Ab sofort weißt du: Falls es regnet, ist Martin für dich da.",
    },
    bus: {
      heroImage: heroPlaceholder,
      heroImageMobile: heroPlaceholder,
      headline: "Mit dem T3 über die Alpen. Aber was, wenn er's nicht schafft?",
      subheadline:
        "Du liebst deinen Bus. Aber er ist alt. Und die Berge sind hoch. Absichern gegen Pannen – damit aus dem Traum kein Albtraum wird.",
      testimonialImage: heroPlaceholder,
      testimonialName: "Marco, T3-Besitzer",
      testimonialQuote:
        "\"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird's teuer und stressig.\"",
      processImage: heroPlaceholder,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      step1Title: "Sag uns, was du absichern möchtest",
      step1Description: "\"Ich habe einen T3 Baujahr 1987. Mein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt.\"",
      step2Title: "Experten machen dir ein Angebot",
      step2Description:
        "Stefan sieht deine Anfrage: \"T3? Kenn ich in- und auswendig. Für eine angemessene Prämie bin ich dein Experte falls was passiert.\"",
      step3Title: "Du wählst und bist abgesichert",
      step3Description: "Du nimmst Stefans Angebot an. Ab sofort weißt du: Falls der Bus liegen bleibt, ist Stefan für dich da.",
    },
  };

  const currentVariant = variants[variant];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "was-ist-xrisk", "prozess", "faq"];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }

      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        const heroElement = document.getElementById("hero");
        const footerElement = document.getElementById("footer");

        if (heroElement && footerElement) {
          const { offsetTop, offsetHeight } = heroElement;
          const footerTop = footerElement.offsetTop;
          const viewportHeight = window.innerHeight;

          const isPastHero = scrollPosition >= offsetTop + offsetHeight;
          const isFooterVisible = scrollPosition + viewportHeight >= footerTop;

          setShowStickyCTA(isPastHero && !isFooterVisible);
        }
      } else {
        setShowStickyCTA(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleRiskRequest = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#fdfcfc] flex flex-col items-start relative w-full">
      <LandingNavbar activeSection={activeSection} scrollToSection={scrollToSection} isLoggedIn={isLoggedIn} onLogin={onLogin} />

      <PersistentCaseSwitcher variant={variant} onVariantChange={setVariant} onRiskRequest={handleRiskRequest} />

      <div id="hero" className="w-full flex justify-center">
        <div className="md:h-[788px] h-[80vh] relative w-full container-hero md:p-[0px] p-[0px]">
          <div className="hidden md:block absolute inset-[-120px] overflow-visible pointer-events-none z-0">
            <ImageWithFallback alt="" className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-30 md:rounded-bl-[24px] md:rounded-br-[24px]" src={currentVariant.heroImage} />
          </div>

          <div className="flex flex-col justify-center overflow-clip size-full relative z-10">
            <div className="box-border content-stretch flex flex-col gap-[10px] md:h-[788px] h-[80vh] items-start justify-center md:pb-[120px] pb-[40px] pt-[0px] relative w-full pr-[0px] pl-[0px] p-[0px]">
              <div className="basis-0 grow min-h-px min-w-px relative md:rounded-bl-[24px] md:rounded-br-[24px] w-full">
                <div className="flex flex-col md:justify-center justify-end size-full">
                  <div className="box-border content-stretch flex flex-col gap-[10px] isolate items-start md:justify-center justify-end md:pb-[40px] pb-[24px] md:pl-[108px] pl-[24px] md:pr-[217px] pr-[24px] pt-[24px] relative size-full">
                    <div className="content-stretch flex flex-col md:gap-[24px] gap-[16px] items-start justify-center relative shrink-0 md:w-[630px] w-full z-[3]">
                      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic relative shrink-0 text-[#e6e5e5] w-full">
                        <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 md:text-[52px] text-[32px] w-full transition-all duration-500">
                          {currentVariant.headline}
                        </p>
                        <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full transition-all duration-500">
                          {currentVariant.subheadline}
                        </p>
                      </div>

                      <div className="md:flex hidden gap-[16px] items-center w-full">
                        <DesktopSwitcher variant={variant} onVariantChange={setVariant} />

                        <div className="bg-surface-frost backdrop-blur-lg border border-white/20 flex-1 rounded-[100px] shadow-sm">
                          <input
                            type="text"
                            value={riskInput}
                            onChange={(e) => setRiskInput(e.target.value)}
                            placeholder="Was möchtest du absichern?"
                            className="button-text text-primary placeholder:text-[#717182] w-full px-[24px] py-[12px] outline-none rounded-[100px] bg-transparent transition-all duration-300 hover:bg-surface-frost-hover focus:bg-surface-frost-hover focus:border-brand/40"
                          />
                        </div>
                        <LandingButton onClick={handleRiskRequest} icon={<ArrowRight className="w-6 h-6" />} hideTextOnMobile={true} className="md:px-[24px] px-[16px]">
                          Risiko anfragen
                        </LandingButton>
                      </div>
                    </div>

                    <div className="absolute inset-0 z-[1] rounded-t-[0px] rounded-b-[24px]">
                      <div aria-hidden="true" className="absolute inset-0 pointer-events-none md:rounded-bl-[24px] md:rounded-br-[24px]">
                        <div className="absolute inset-0 overflow-hidden md:rounded-bl-[24px] md:rounded-br-[24px]">
                          <ImageWithFallback alt="" className="hidden md:block absolute max-w-none object-cover rounded-bl-[24px] rounded-br-[24px] size-full transition-all duration-500 object-center" src={currentVariant.heroImage} />
                          <ImageWithFallback alt="" className="block md:hidden absolute max-w-none object-cover size-full transition-all duration-500 object-[center_center]" src={currentVariant.heroImageMobile} />
                        </div>
                        <div className="absolute bg-gradient-to-b md:from-[rgba(0,0,0,0.2)] md:to-[rgba(0,0,0,0.2)] from-[24.519%] from-[rgba(0,0,0,0)] to-[64.423%] to-[rgba(0,0,0,0.5)] inset-0 md:rounded-bl-[24px] md:rounded-br-[24px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="testimonial" className="w-full section-spacing">
        <SectionTestimonial variant={variant} onVariantChange={setVariant} />
      </div>

      <div className="w-full section-spacing">
        <NeuesteRisikenSection variant={variant} />
      </div>

      <div id="was-ist-xrisk" className="w-full section-spacing">
        <SectionWasIstXrisk />
      </div>

      <div id="prozess" className="w-full section-spacing relative">
        <div className="container-grid">
          <div className="grid-12 relative">
            <div className="col-span-6 flex flex-col gap-8 md:py-6 py-4">
              <div className="flex flex-col gap-4 items-start w-full">
                <div className="flex flex-col gap-2 items-start w-full">
                  <h2 className="display-large text-primary">{currentVariant.processTitle}</h2>
                </div>
                <p className="font-semibold text-primary text-[18px] leading-[1.5]">{currentVariant.processSubtitle}</p>
              </div>
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p1edfde00} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">
                      <span className="text-brand">Schritt 1:</span> {currentVariant.step1Title}
                    </p>
                    <p className="body-base text-primary">{currentVariant.step1Description}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p33705900} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p161d4800} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p2b304d00} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p13e20900} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">
                      <span className="text-brand">Schritt 2:</span> {currentVariant.step2Title}
                    </p>
                    <p className="body-base text-primary">{currentVariant.step2Description}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p2501aa80} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M14 2V8H20" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M16 13H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M16 17H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M10 9H9H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">
                      <span className="text-brand">Schritt 3:</span> {currentVariant.step3Title}
                    </p>
                    <p className="body-base text-primary">{currentVariant.step3Description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block col-span-6">
              <div className="relative rounded-[24px] h-[600px]">
                <div className="hidden md:block absolute inset-[-120px] overflow-visible pointer-events-none">
                  <img alt="" className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-30" src={currentVariant.processImage} />
                </div>

                <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#353131]" id="prozess-testimonial">
                  <img alt={currentVariant.testimonialName} className="absolute inset-0 w-full h-full object-cover" src={currentVariant.processImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection
        title={
          <>
            <span className="text-brand">Deine</span>
            <span> Fragen. </span>
            <span className="text-brand">Unsere</span>
            <span> Antworten.</span>
          </>
        }
        subtitle="Du hast Fragen? Wir haben Antworten. Hier findest du alles Wichtige zu xrisk."
        faqs={[
          {
            question: "Was ist xRisk?",
            answer: (
              <div>
                <p><strong>Ein Marktplatz für Risiken – offen, transparent und menschlich.</strong></p>
                <p>xRisk bringt Menschen mit unterschiedlichen Risikohaltungen zusammen:</p>
                <ul>
                  <li>Optimisten, die Chancen erkennen,</li>
                  <li>Pessimisten, die Sicherheit suchen,</li>
                  <li>Spielerische, die den Nervenkitzel mögen.</li>
                </ul>
                <p>Jede Risikoübernahme funktioniert wie eine Wette auf Wahrscheinlichkeiten – aber mit echtem Nutzen: Du eliminierst Risiko statt zu spekulieren.</p>
                <p>So entsteht ein neuer Markt für kleine und große Risiken.</p>
              </div>
            ),
          },
          {
            question: "Was kostet mich xRisk?",
            answer: (
              <div>
                <p><strong>Starte kostenlos – lerne Risiko spielerisch kennen.</strong></p>
                <p>Aktuell nutzt du xRisk kostenlos.</p>
                <p>Wir testen das System, trainieren unsere KI-Agenten und laden dich ein, Teil der ersten Community zu sein.</p>
                <p>Du kannst sogar gewinnen, wenn du aktiv mitmachst!</p>
                <p>In Zukunft werden wir kostenpflichtige Funktionen anbieten.</p>
              </div>
            ),
          },
          {
            question: "Wie bewertet xRisk mein Risiko?",
            answer: (
              <div>
                <p><strong>KI macht dein Risiko verständlich – in drei einfachen Schritten.</strong></p>
                <ol>
                  <li>Du beschreibst dein Risiko.</li>
                  <li>Unsere KI stellt dir kurze Rückfragen.</li>
                  <li>Die KI analysiert Millionen Datenquellen in deiner Sprache.</li>
                </ol>
                <p><strong>Ergebnis:</strong> eine faire, datenbasierte Risikobewertung und Vorschläge für deine individuelle Risikogebühr.</p>
                <p>Schnell, transparent und günstiger als jede klassische Analyse.</p>
              </div>
            ),
          },
          {
            question: "Wer ist mein Risikopartner?",
            answer: (
              <div>
                <p><strong>Echte Menschen. Echte Unternehmen. Echte Sicherheit.</strong></p>
                <p>Alle Teilnehmer bei xRisk sind verifiziert.</p>
                <ul>
                  <li>Identitätsprüfung mit ID und Selfie</li>
                  <li>Bonitätscheck</li>
                  <li>Transparente Profilbilder</li>
                </ul>
                <p>So siehst du immer, mit wem du dein Risiko teilst – sicher und vertrauenswürdig.</p>
              </div>
            ),
          },
        ]}
        defaultExpanded={0}
      />

      <div id="footer" className="bg-[#ff671f] relative w-full section-spacing-top">
        <div className="container-grid">
          <div className="grid-12 md:py-[80px] py-[48px] items-start">
            <div className="col-span-12 md:col-span-4 flex flex-col gap-8 mb-8 md:mb-0">
              <img src={heroPlaceholder} alt="XRISK Logo" className="h-[64px] w-auto" />
            </div>
            <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
              <p className="font-semibold text-white text-[14px] uppercase tracking-wide opacity-80 mb-2">Rechtliches</p>
              {["Impressum", "Datenschutz", "AGB"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) {
                      if (item === "Impressum") onNavigate("impressum");
                      if (item === "Datenschutz") onNavigate("datenschutz");
                      if (item === "AGB") onNavigate("agb");
                    }
                  }}
                  className="body-base text-white cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
              <p className="font-semibold text-white text-[14px] uppercase tracking-wide opacity-80 mb-2">Kontakt</p>
              <a href="mailto:hello@xrisk.com" className="body-base text-white cursor-pointer hover:opacity-70 transition-opacity">
                hello@xrisk.com
              </a>
            </div>
            <div className="col-span-12 mt-12 pt-8 border-t border-white/20">
              <p className="text-white text-[14px] opacity-60 text-center md:text-left">© 2025 xRisk. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </div>

      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-[rgba(255,103,31,0)] z-50 px-[0px] py-[16px] pt-[16px] pr-[0px] pb-[32px] pl-[0px]">
          <div className="container-grid">
            <div className="flex gap-[16px] items-center justify-center w-full p-[0px]">
              <DesktopSwitcher variant={variant} onVariantChange={setVariant} />

              <div className="bg-surface-frost backdrop-blur-lg border border-white/20 flex-1 rounded-[100px] shadow-sm">
                <input
                  type="text"
                  value={riskInput}
                  onChange={(e) => setRiskInput(e.target.value)}
                  placeholder="Was möchtest du absichern?"
                  className="button-text text-primary placeholder:text-[#717182] w-full px-[24px] py-[12px] outline-none rounded-[100px] bg-transparent transition-all duration-300 hover:bg-surface-frost-hover focus:bg-surface-frost-hover focus:border-brand/40"
                />
              </div>
              <LandingButton onClick={handleRiskRequest} icon={<ArrowRight className="w-6 h-6" />} hideTextOnMobile={true} className="md:px-[24px] px-[16px]">
                Risiko anfragen
              </LandingButton>
            </div>
          </div>
        </div>
      )}

      <RiskInputModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRiskDescription={riskInput}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
      />
    </div>
  );
}
export default LandingPage;
