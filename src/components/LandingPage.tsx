import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-81dejan7f8";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { placeholderImage } from "../assests/imgs/placeholder";
import { RiskInputModal } from "./RiskInputModal";
import { LandingNavbar } from "./landing/LandingNavbar";
import { FAQSection } from "./landing/FAQSection";
import { NeuesteRisikenSection } from "./landing/NeuesteRisikenSection";
import { PersistentCaseSwitcher, DesktopSwitcher } from "./landing/PersistentCaseSwitcher";
import SectionWasIstXrisk from "../imports/SectionWasIstXrisk";
import SectionTestimonial from "../imports/SectionWasIstXrisk-4013-1246";
import { ArrowRight } from "lucide-react";
import { LandingButton } from "./landing/LandingButton";

// Landing Page Component
interface LandingPageProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
  onNavigate?: (page: string) => void;
}

const imgHeroMarketDesktop = placeholderImage;
const imgHeroMarketMobile = placeholderImage;
const imgHeroBusDesktop = placeholderImage;
const imgHeroBusMobile = placeholderImage;
const imgMartin = placeholderImage;
const imgLogo = placeholderImage;
// Testimonial images
const imgLena = placeholderImage;
const imgMarco = placeholderImage;

export function LandingPage({ onLogin, isLoggedIn = false, onNavigate }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [riskInput, setRiskInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<VariantType>("market");
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  // Variant configurations
  const variants = {
    market: {
      heroImage: imgHeroMarketDesktop,
      heroImageMobile: imgHeroMarketMobile,
      headline: (
        <>
          <span>Wenn das Wetter </span>
          <span className="text-[#ff671f]">deinen Markttag </span>
          <span>verhagelt.</span>
        </>
      ),
      subheadline: "Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.",
      testimonialImage: imgLena,
      testimonialName: "Lena, Künstlerin",
      testimonialQuote: "\"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall.\"",
      processImage: imgLena,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      step1Title: "Sag uns, was du absichern möchtest",
      step1Description: "\"Ich verkaufe Kunst auf Wochenmärkten. Wenn es regnet, bleiben die Leute weg und ich verdiene nichts.\"",
      step2Title: "Experten machen dir ein Angebot",
      step2Description: "Martin sieht deine Anfrage: \"Als Landwirt kenne ich Wetter. Für eine angemessene Prämie übernehme ich dein Wetterrisiko.\"",
      step3Title: "Du wählst und bist abgesichert",
      step3Description: "Du nimmst Martins Angebot an. Ab sofort weißt du: Falls es regnet, ist Martin für dich da.",
    },
    bus: {
      heroImage: imgHeroBusDesktop,
      heroImageMobile: imgHeroBusMobile,
      headline: "Mit dem T3 über die Alpen. Aber was, wenn er's nicht schafft?",
      subheadline: "Du liebst deinen Bus. Aber er ist alt. Und die Berge sind hoch. Absichern gegen Pannen – damit aus dem Traum kein Albtraum wird.",
      testimonialImage: imgMarco,
      testimonialName: "Marco, T3-Besitzer",
      testimonialQuote: "\"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird's teuer und stressig.\"",
      processImage: imgMarco,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      step1Title: "Sag uns, was du absichern möchtest",
      step1Description: "\"Ich habe einen T3 Baujahr 1987. Mein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt.\"",
      step2Title: "Experten machen dir ein Angebot",
      step2Description: "Stefan sieht deine Anfrage: \"T3? Kenn ich in- und auswendig. Für eine angemessene Prämie bin ich dein Experte falls was passiert.\"",
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

      // Show sticky CTA only on desktop if scrolled past hero section
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        const heroElement = document.getElementById("hero");
        const footerElement = document.getElementById("footer");
        
        if (heroElement && footerElement) {
          const { offsetTop, offsetHeight } = heroElement;
          const footerTop = footerElement.offsetTop;
          const viewportHeight = window.innerHeight;
          
          // Show CTA if past hero AND footer is not yet visible in viewport
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
      {/* Import LandingNavbar component - fixed at top, over hero */}
      <LandingNavbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
      />

      {/* Persistent Case Switcher */}
      <PersistentCaseSwitcher 
        variant={variant}
        onVariantChange={setVariant}
        onRiskRequest={handleRiskRequest}
      />

      {/* Hero Section - Full Height, starts at 0 (navigation overlays it) */}
      <div id="hero" className="w-full flex justify-center">
        <div className="md:h-[788px] h-[80vh] relative w-full container-hero md:p-[0px] p-[0px]">
          {/* Blurred Background Layer - außerhalb overflow-clip - nur Desktop */}
          <div className="hidden md:block absolute inset-[-120px] overflow-visible pointer-events-none z-0">
            {/* Desktop Blur */}
            <ImageWithFallback 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-30 md:rounded-bl-[24px] md:rounded-br-[24px]" 
              src={currentVariant.heroImage} 
            />
          </div>
          
          <div className="flex flex-col justify-center overflow-clip size-full relative z-10">
            <div className="box-border content-stretch flex flex-col gap-[10px] md:h-[788px] h-[80vh] items-start justify-center md:pb-[120px] pb-[40px] pt-[0px] relative w-full pr-[0px] pl-[0px] p-[0px]">
              <div className="basis-0 grow min-h-px min-w-px relative md:rounded-bl-[24px] md:rounded-br-[24px] w-full">
                <div className="flex flex-col md:justify-center justify-end size-full">
                  <div className="box-border content-stretch flex flex-col gap-[10px] isolate items-start md:justify-center justify-end md:pb-[40px] pb-[24px] md:pl-[108px] pl-[24px] md:pr-[217px] pr-[24px] pt-[24px] relative size-full">
                    
                    {/* Text Content - Desktop: Left aligned, Mobile: Center aligned */}
                    <div className="content-stretch flex flex-col md:gap-[24px] gap-[16px] items-start justify-center relative shrink-0 md:w-[630px] w-full z-[3]">
                      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic relative shrink-0 text-[#e6e5e5] w-full">
                        <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 md:text-[52px] text-[32px] w-full transition-all duration-500">
                          {currentVariant.headline}
                        </p>
                        <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full transition-all duration-500">
                          {currentVariant.subheadline}
                        </p>
                      </div>
                      
                      {/* CTA Bar - direkt im Hero */}
                      <div className="md:flex hidden gap-[16px] items-center w-full">
                        {/* Desktop Switcher im Hero */}
                        <DesktopSwitcher 
                          variant={variant}
                          onVariantChange={setVariant}
                        />
                        
                        <div className="bg-surface-frost backdrop-blur-lg border border-white/20 flex-1 rounded-[100px] shadow-sm">
                          <input
                            type="text"
                            value={riskInput}
                            onChange={(e) => setRiskInput(e.target.value)}
                            placeholder="Was möchtest du absichern?"
                            className="button-text text-primary placeholder:text-[#717182] w-full px-[24px] py-[12px] outline-none rounded-[100px] bg-transparent transition-all duration-300 hover:bg-surface-frost-hover focus:bg-surface-frost-hover focus:border-brand/40"
                          />
                        </div>
                        <LandingButton
                          onClick={handleRiskRequest}
                          icon={<ArrowRight className="w-6 h-6" />}
                          hideTextOnMobile={true}
                          className="md:px-[24px] px-[16px]"
                        >
                          Risiko anfragen
                        </LandingButton>
                      </div>
                    </div>

                    {/* Background Image */}
                    <div className="absolute inset-0 z-[1] rounded-t-[0px] rounded-b-[24px]">
                      <div aria-hidden="true" className="absolute inset-0 pointer-events-none md:rounded-bl-[24px] md:rounded-br-[24px]">
                        <div className="absolute inset-0 overflow-hidden md:rounded-bl-[24px] md:rounded-br-[24px]">
                          {/* Desktop Image */}
                          <ImageWithFallback 
                            alt="" 
                            className="hidden md:block absolute max-w-none object-cover rounded-bl-[24px] rounded-br-[24px] size-full transition-all duration-500 object-center" 
                            src={currentVariant.heroImage} 
                          />
                          {/* Mobile Image - Person zentriert */}
                          <ImageWithFallback 
                            alt="" 
                            className="block md:hidden absolute max-w-none object-cover size-full transition-all duration-500 object-[center_center]" 
                            src={currentVariant.heroImageMobile} 
                          />
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

      {/* Testimonial Section - So funktioniert xrisk */}
      <div id="testimonial" className="w-full section-spacing">
        <SectionTestimonial variant={variant} onVariantChange={setVariant} />
      </div>

      {/* NEW: Neueste Risiken Section */}
      <div className="w-full section-spacing">
        <NeuesteRisikenSection variant={variant} />
      </div>

      {/* Section Was ist xrisk - Orangene Section */}
      <div id="was-ist-xrisk" className="w-full section-spacing">
        <SectionWasIstXrisk />
      </div>

      {/* Section 3-Step Anleitung - Grid 6/6 */}
      <div id="prozess" className="w-full section-spacing relative">
        <div className="container-grid">
          <div className="grid-12 relative">
            
            {/* Left Column - Text - 6 cols desktop, 12 cols mobile/tablet */}
            <div className="col-span-6 flex flex-col gap-8 md:py-6 py-4">
              <div className="flex flex-col gap-4 items-start w-full">
                <div className="flex flex-col gap-2 items-start w-full">
                  <h2 className="display-large text-primary">
                    {currentVariant.processTitle}
                  </h2>
                </div>
                <p className="font-semibold text-primary text-[18px] leading-[1.5]">
                  {currentVariant.processSubtitle}
                </p>
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
                    <p className="body-base text-primary">
                      {currentVariant.step1Description}
                    </p>
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
                    <p className="body-base text-primary">
                      {currentVariant.step2Description}
                    </p>
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
                    <p className="body-base text-primary">
                      {currentVariant.step3Description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image - nur Desktop sichtbar */}
            <div className="hidden md:block col-span-6">
              <div className="relative rounded-[24px] h-[600px]">
                {/* Blurred Background Layer - nur Desktop */}
                <div className="hidden md:block absolute inset-[-120px] overflow-visible pointer-events-none">
                  <img 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-30" 
                    src={currentVariant.processImage} 
                  />
                </div>
                
                {/* Main Image Container with clipping */}
                <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#353131]" id="prozess-testimonial">
                  <img 
                    alt={currentVariant.testimonialName} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    src={currentVariant.processImage} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Grid 6/6 */}
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
          {
            question: "Was passiert im Schadensfall?",
            answer: (
              <div>
                <p><strong>Klare Regeln. Faire Abwicklung.</strong></p>
                <p>Du und dein Risikopartner legt im Vertrag fest, wann ein Leistungsfall eintritt und wie er belegt wird.</p>
                <p>Ein unabhängiger Dienstleister prüft den Fall neutral.</p>
                <p>Falls es Unklarheiten gibt, sorgt ein Schlichtungsverfahren für eine schnelle und faire Entscheidung.</p>
              </div>
            ),
          },
          {
            question: "Wie sicher ist xRisk?",
            answer: (
              <div>
                <p><strong>Vertrauen durch Regulierung und Technik.</strong></p>
                <p>xRisk arbeitet unter Aufsicht der <strong>BaFin (Deutschland)</strong> und <strong>FINMA (Schweiz)</strong>.</p>
                <p>Zahlungen werden über <strong>Stripe</strong> abgewickelt – einen der sichersten globalen Zahlungsdienste.</p>
                <ul>
                  <li>Risikogebühr: vom Risikogeber gezahlt</li>
                  <li>Leistungsbetrag: auf Karte des Risikonehmers reserviert</li>
                </ul>
                <p>So sind alle Zahlungen doppelt geschützt.</p>
              </div>
            ),
          },
          {
            question: "Was sagen andere über xRisk?",
            answer: (
              <div>
                <p><strong>Echte Stimmen. Echte Begeisterung.</strong></p>
                <p><em>„Wenn ich auf die Website komme, verstehe ich sofort, worum es geht. Die Fallbeispiele machen Lust, xRisk auszuprobieren. Sehr überzeugend!"</em></p>
                <p>— Externer Fachmann, Oktober 2025</p>
              </div>
            ),
          },
          {
            question: "Warum xRisk?",
            answer: (
              <div>
                <p><strong>Weil Risiko Vertrauen braucht.</strong></p>
                <ul>
                  <li><strong>Einfach</strong> – jeder versteht, wie es funktioniert.</li>
                  <li><strong>Fair</strong> – KI sorgt für Transparenz.</li>
                  <li><strong>Mutig</strong> – neue Wege für neue Generationen.</li>
                </ul>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
                  <LandingButton onClick={onLogin}>
                    Jetzt registrieren
                  </LandingButton>
                  <LandingButton onClick={onLogin} variant="outline">
                    Beta-Version testen
                  </LandingButton>
                </div>
              </div>
            ),
          },
        ]}
        defaultExpanded={0}
      />

      {/* Footer - Full width background with grid container */}
      <div id="footer" className="bg-[#ff671f] relative w-full section-spacing-top">
        <div className="container-grid">
          <div className="grid-12 md:py-[80px] py-[48px] items-start">
            {/* Logo Column */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-8 mb-8 md:mb-0">
              <img 
                src={imgLogo} 
                alt="XRISK Logo" 
                className="h-[64px] w-auto" 
              />
            </div>
            
            {/* Navigation Links */}
            <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
              <p className="font-semibold text-white text-[14px] uppercase tracking-wide opacity-80 mb-2">
                Rechtliches
              </p>
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
            
            {/* Contact Column */}
            <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
              <p className="font-semibold text-white text-[14px] uppercase tracking-wide opacity-80 mb-2">
                Kontakt
              </p>
              <a 
                href="mailto:hello@xrisk.com" 
                className="body-base text-white cursor-pointer hover:opacity-70 transition-opacity"
              >
                hello@xrisk.com
              </a>
              <div className="flex gap-4 mt-4">
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="col-span-12 mt-12 pt-8 border-t border-white/20">
              <p className="text-white text-[14px] opacity-60 text-center md:text-left">
                © 2025 xRisk. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-[rgba(255,103,31,0)] z-50 px-[0px] py-[16px] pt-[16px] pr-[0px] pb-[32px] pl-[0px]">
          <div className="container-grid">
            <div className="flex gap-[16px] items-center justify-center w-full p-[0px]">
              {/* Desktop Switcher - links */}
              <DesktopSwitcher 
                variant={variant}
                onVariantChange={setVariant}
              />
              
              <div className="bg-surface-frost backdrop-blur-lg border border-white/20 flex-1 rounded-[100px] shadow-sm">
                <input
                  type="text"
                  value={riskInput}
                  onChange={(e) => setRiskInput(e.target.value)}
                  placeholder="Was möchtest du absichern?"
                  className="button-text text-primary placeholder:text-[#717182] w-full px-[24px] py-[12px] outline-none rounded-[100px] bg-transparent transition-all duration-300 hover:bg-surface-frost-hover focus:bg-surface-frost-hover focus:border-brand/40"
                />
              </div>
              <LandingButton
                onClick={handleRiskRequest}
                icon={<ArrowRight className="w-6 h-6" />}
                hideTextOnMobile={true}
                className="md:px-[24px] px-[16px]"
              >
                Risiko anfragen
              </LandingButton>
            </div>
          </div>
        </div>
      )}

      {/* Risk Input Modal */}
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