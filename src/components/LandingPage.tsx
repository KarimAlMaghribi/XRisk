import { useState, useEffect } from "react";
import { RiskInputModal } from "./RiskInputModal";
import { LandingNavbar } from "./landing/LandingNavbar";
import { FAQSection } from "./landing/FAQSection";
import { NeuesteRisikenSection } from "./landing/NeuesteRisikenSection";
import { PersistentCaseSwitcher, DesktopSwitcher } from "./landing/PersistentCaseSwitcher";
import { HeroSection } from "./landing/HeroSection";
import { ProcessSection } from "./landing/ProcessSection";
import { StickyCTA } from "./landing/StickyCTA";
import SectionWasIstXrisk from "../imports/SectionWasIstXrisk";
import SectionTestimonial from "../imports/SectionWasIstXrisk-4013-1246";
import { LandingButton } from "./landing/LandingButton";

// Landing Page Component
interface LandingPageProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
  onNavigate?: (page: string) => void;
}

type VariantType = 'market' | 'bus';

const imgHeroMarketDesktop = "/assets/landing/hero-market-desktop.svg";
const imgHeroBusDesktop = "/assets/landing/hero-bus-desktop.svg";
const imgLogo = "/assets/landing/logo.svg";
// Testimonial images
const imgLena = "/assets/landing/testimonial-lena.svg";
const imgMarco = "/assets/landing/testimonial-marco.svg";

export function LandingPage({ onLogin, isLoggedIn = false, onNavigate }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [riskInput, setRiskInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<VariantType>("market");
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  // Variant configurations
  const variants: Record<VariantType, {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    testimonialImage: string;
    testimonialName: string;
    testimonialQuote: string;
    processTitle: string;
    processSubtitle: string;
    processImage: string;
    processSteps: { icon: "user" | "sparkles" | "shield"; title: string; description: string }[];
  }> = {
    market: {
      heroTitle: "Wenn das Wetter <span class=\"text-brand\">deinen Markttag</span> verhagelt.",
      heroSubtitle:
        "Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.",
      heroImage: imgHeroMarketDesktop,
      testimonialImage: imgLena,
      testimonialName: "Lena, Künstlerin",
      testimonialQuote: "\"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall.\"",
      processImage: imgLena,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      processSteps: [
        {
          icon: "user",
          title: "Schritt 1: Sag uns, was du absichern möchtest",
          description: "\"Ich verkaufe Kunst auf Wochenmärkten. Wenn es regnet, bleiben die Leute weg und ich verdiene nichts.\"",
        },
        {
          icon: "sparkles",
          title: "Schritt 2: Experten machen dir ein Angebot",
          description:
            "Martin sieht deine Anfrage: \"Als Landwirt kenne ich Wetter. Für eine angemessene Prämie übernehme ich dein Wetterrisiko.\"",
        },
        {
          icon: "shield",
          title: "Schritt 3: Du wählst und bist abgesichert",
          description: "Du nimmst Martins Angebot an. Ab sofort weißt du: Falls es regnet, ist Martin für dich da.",
        },
      ],
    },
    bus: {
      heroTitle: "Mit dem T3 über die Alpen. Aber was, wenn er's nicht schafft?",
      heroSubtitle:
        "Du liebst deinen Bus. Aber er ist alt. Und die Berge sind hoch. Absichern gegen Pannen – damit aus dem Traum kein Albtraum wird.",
      heroImage: imgHeroBusDesktop,
      testimonialImage: imgMarco,
      testimonialName: "Marco, T3-Besitzer",
      testimonialQuote:
        "\"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird's teuer und stressig.\"",
      processImage: imgMarco,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      processSteps: [
        {
          icon: "user",
          title: "Schritt 1: Sag uns, was du absichern möchtest",
          description: "\"Ich habe einen T3 Baujahr 1987. Mein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt.\"",
        },
        {
          icon: "sparkles",
          title: "Schritt 2: Experten machen dir ein Angebot",
          description:
            "Stefan sieht deine Anfrage: \"T3? Kenn ich in- und auswendig. Für eine angemessene Prämie bin ich dein Experte falls was passiert.\"",
        },
        {
          icon: "shield",
          title: "Schritt 3: Du wählst und bist abgesichert",
          description: "Du nimmst Stefans Angebot an. Ab sofort weißt du: Falls der Bus liegen bleibt, ist Stefan für dich da.",
        },
      ],
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
      <HeroSection
        title={currentVariant.heroTitle}
        subtitle={currentVariant.heroSubtitle}
        placeholder="Was möchtest du absichern?"
        buttonText="Risiko anfragen"
        riskInput={riskInput}
        setRiskInput={setRiskInput}
        onRiskRequest={handleRiskRequest}
        backgroundImage={currentVariant.heroImage}
        ctaPrefix={
          <div className="md:flex hidden">
            <DesktopSwitcher variant={variant} onVariantChange={setVariant} />
          </div>
        }
      />

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
      <ProcessSection
        title={currentVariant.processTitle}
        subtitle={currentVariant.processSubtitle}
        steps={currentVariant.processSteps}
        image={currentVariant.processImage}
      />

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
      <StickyCTA
        showStickyCTA={showStickyCTA}
        riskInput={riskInput}
        setRiskInput={setRiskInput}
        onRiskRequest={handleRiskRequest}
        placeholder="Was möchtest du absichern?"
        buttonText="Risiko anfragen"
        prefix={
          <div className="md:flex hidden">
            <DesktopSwitcher variant={variant} onVariantChange={setVariant} />
          </div>
        }
      />

      {/* Risk Input Modal */}
      <RiskInputModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRiskDescription={riskInput}
      />
    </div>
  );
}
