import { useState, useEffect } from "react";
import { LandingNavbar } from "./landing/LandingNavbar";
import { HeroSection } from "./landing/HeroSection";
import { MarketplacePreviewSection } from "./landing/MarketplacePreviewSection";
import { ExpertiseSection } from "./landing/ExpertiseSection";
import { ProcessSection } from "./landing/ProcessSection";
import { FAQSection } from "./landing/FAQSection";
import { CTASection } from "./landing/CTASection";
import { FooterSection } from "./landing/FooterSection";
import { communityRisks } from "../lib/community-mock-data";
import imgHeroImage from "figma:asset/4dc3b792d36796fe4af5981ece473a0bf59002d8.png";
import imgHeroImage1 from "figma:asset/6801e0080f468c28a449cecf6698c2995a9ed561.png";
import imgHeroImage2 from "figma:asset/013e60f9dba635c7628c40e9ea4fc3f373c327f7.png";

interface RisktakerLandingPageProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
  onUserTypeChange: (type: "risikogeber" | "risikonehmer") => void;
}

export function RisktakerLandingPage({
  onLogin,
  isLoggedIn = false,
  onUserTypeChange,
}: RisktakerLandingPageProps) {
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleTakeRisk = () => {
    // Navigate to login if not logged in, otherwise scroll to top
    if (isLoggedIn) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onLogin();
    }
  };

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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      question: "Wie funktioniert xrisk?",
      answer:
        "Du beschreibst dein Risiko in wenigen Worten. Unsere KI stellt bei Bedarf Fragen, bewertet dein individuelles Risiko und findet den passenden Risikopartner für dich. Du siehst alle Details transparent und entscheidest, ob du den Vertrag abschließt.",
    },
    {
      question: "Was kostet mich xrisk?",
      answer:
        "Die Nutzung von xrisk ist für Risikonehmer kostenlos. Du verdienst mit jeder übernommenen Prämie.",
    },
    {
      question: "Wie wird mein Risiko bewertet?",
      answer:
        "Unsere KI analysiert Gegenstand, Zeitraum, Kontext und historische Daten. Das Ergebnis ist eine objektive Risikobewertung auf einer 5-Punkte-Skala.",
    },
    {
      question: "Wer ist mein Risikopartner?",
      answer:
        "Dein Risikopartner ist ein verifizierter Experte aus deiner Region – eine Werkstatt, ein Handwerker oder ein spezialisierter Dienstleister, der dein Risiko versteht.",
    },
    {
      question: "Was passiert im Schadensfall?",
      answer:
        "Im Schadensfall meldest du dich direkt bei deinem Risikopartner. Er kümmert sich um die Lösung – schnell und direkt, ohne Bürokratie.",
    },
    {
      question: "Bin ich rechtlich abgesichert?",
      answer:
        "Ja. Der Vertrag zwischen dir und deinem Risikopartner ist rechtlich bindend. Bei Unstimmigkeiten steht dir unser Support zur Verfügung.",
    },
  ];

  return (
    <div className="bg-[#fdfcfc] flex flex-col items-start relative w-full">
      <LandingNavbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        userType="risikonehmer"
        onUserTypeChange={onUserTypeChange}
      />

      <HeroSection
        title='Deine <span class="text-[#ff671f]">Werkstatt</span> kann mehr als nur reparieren.'
        subtitle="Mit xrisk wirst du Risikopartner – und verdienst präventiv. Kassiere eine Prämie für jedes Risiko, das du übernimmst. Passiert nichts, behältst du sie. Passiert doch etwas, bist du bereits der Partner und übernimmst die Lösung."
        buttonText="Risiko übernehmen"
        onRiskRequest={handleTakeRisk}
        backgroundImage={imgHeroImage}
        hideInput={true}
      />

      <MarketplacePreviewSection
        title="Faire Prämien durch intelligente Bewertung"
        description="Unsere KI analysiert dein individuelles Risiko und berechnet eine faire Prämie – objektiv und transparent. Dabei fließen drei Faktoren ein: die Absicherungssumme, das ermittelte Risiko basierend auf Gegenstand, Zeitraum und Kontext sowie der potenzielle Aufwand im Risikofall. So zahlst du nie zu viel und dein Risikopartner bekommt eine angemessene Vergütung."
        previewRisks={communityRisks}
      />

      <ExpertiseSection
        subtitle="Warum xrisk anders ist"
        title="Wir verbinden Risiken mit der richtigen Expertise."
        description="Unsere KI analysiert dein individuelles Risiko und berechnet eine faire Prämie – objektiv und transparent. Dabei fließen drei Faktoren ein: die Absicherungssumme, das ermittelte Risiko basierend auf Gegenstand, Zeitraum und Kontext sowie der potenzielle Aufwand im Risikofall."
        card1Image={imgHeroImage1}
        card1Label="Anabell, 25 - Risikogeber"
        card1Quote='"Ich verleihe meine Siebträger-Espressomaschine und habe Angst, das sie kaputt gehen könnte."'
        card2Image={imgHeroImage2}
        card2Label="Peter, 30 - Risikonehmer"
        card2Quote='"Ich habe mich auf die Reperatur von Espressomaschienen Spezialisiert"'
      />

      <ProcessSection
        title='In 3 Schritten zum <span class="text-brand">Risikopartner</span>'
        subtitle="Keine komplizierten Onboarding-Prozesse. Registriere dich, lege fest welche Risiken du managen kannst, und starte mit deinem ersten Match."
        steps={[
          {
            icon: "user",
            title: "Profil anlegen",
            description:
              "Registriere dich und beschreibe deine Expertise. Welche Risiken kannst du einschätzen und im Ernstfall lösen? Fahrzeuge, Elektronik, Immobilien?",
          },
          {
            icon: "sparkles",
            title: "Risiken erhalten",
            description:
              "Unsere KI matcht dich mit passenden Risikoanfragen. Du siehst alle Details, die KI-Bewertung und einen Prämienvorschlag.",
          },
          {
            icon: "shield",
            title: "Risiko übernehmen",
            description:
              "Passt das Risiko zu dir? Dann übernimmst du es mit einem Klick. Der Vertrag kommt direkt zwischen dir und dem Kunden zustande.",
          },
        ]}
        image={imgHeroImage2}
      />

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
        faqs={faqs}
      />

      <CTASection
        title="Bereit, Risikopartner zu werden?"
        content="Melde dich jetzt an und starte mit deinem ersten Risiko. Verdiene präventiv und löse Probleme direkt."
        buttonText="Risiko übernehmen"
        onButtonClick={handleTakeRisk}
      />

      <FooterSection
        title="Das ist Versicherung, wie sie sein sollte."
        content='<p class="mb-4">Versicherung war gestern ein notwendiges Übel. Wir haben sie neu erfunden: individuell statt kollektiv, intelligent statt bürokratisch.</p><p class="mb-4">Bei xrisk sichert dich kein anonymer Konzern ab, sondern ein konkreter Experte – eine Werkstatt für dein Auto, ein Handwerker für deine Wohnung. Menschen, die dein Risiko wirklich verstehen.</p><p>Unsere KI bewertet dein individuelles Risiko fair und transparent. Dein Risikopartner verdient, wenn nichts passiert – und löst das Problem sofort, wenn doch etwas passiert.</p>'
      />
    </div>
  );
}
