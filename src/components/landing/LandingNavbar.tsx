import React, { useState, useEffect } from "react";
import imgLogo from "../../assests/imgs/desert_1-min.png";
import { LandingButton } from "./LandingButton";
import { LandingNavLink } from "./LandingNavLink";
import { Menu, X, User } from "lucide-react";

interface LandingNavbarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  isLoggedIn?: boolean;
  onLogin: () => void;
}

export function LandingNavbar({ activeSection, scrollToSection, isLoggedIn = false, onLogin }: LandingNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-md shadow-sm" role="banner">
      <div className="container-grid">
        <nav className="flex items-center justify-between py-4" aria-label="Hauptnavigation">
          <div className="flex gap-6 items-center">
            <img src={imgLogo} alt="XRISK Logo - Zur Startseite" className="h-[48px] w-[55px]" />
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <nav className="bg-surface-frost backdrop-blur-lg flex gap-2 items-center rounded-[100px] shadow-sm p-[4px] px-[8px]" aria-label="Seiten-Navigation">
              <LandingNavLink onClick={() => scrollToSection("testimonial")} isActive={activeSection === "testimonial"} aria-current={activeSection === "testimonial" ? "page" : undefined} aria-label="Zu Abschnitt: So funktioniert's">
                So funktioniert's
              </LandingNavLink>
              <LandingNavLink onClick={() => scrollToSection("was-ist-xrisk")} isActive={activeSection === "was-ist-xrisk"} aria-current={activeSection === "was-ist-xrisk" ? "page" : undefined} aria-label="Zu Abschnitt: Was ist xrisk?">
                Was ist xrisk?
              </LandingNavLink>
              <LandingNavLink onClick={() => scrollToSection("prozess")} isActive={activeSection === "prozess"} aria-current={activeSection === "prozess" ? "page" : undefined} aria-label="Zu Abschnitt: Prozess">
                Prozess
              </LandingNavLink>
              <LandingNavLink onClick={() => scrollToSection("faq")} isActive={activeSection === "faq"} aria-current={activeSection === "faq" ? "page" : undefined} aria-label="Zu Abschnitt: FAQ">
                FAQ
              </LandingNavLink>
            </nav>
            {!isLoggedIn && <LandingButton onClick={onLogin} aria-label="Anmelden oder Registrieren">Anmelden</LandingButton>}
          </div>

          <div className="md:hidden flex gap-2 items-center">
            {!isLoggedIn && (
              <button onClick={onLogin} className="p-2 rounded-lg bg-surface-frost backdrop-blur-lg" aria-label="Anmelden">
                <User className="w-6 h-6 text-primary" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg bg-surface-frost backdrop-blur-lg relative w-[40px] h-[40px]"
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-[80px] bg-white/90 backdrop-blur-xl">
          <div className="container-grid h-full">
            <div className="flex flex-col justify-center items-center h-full p-6 gap-4">
              <button
                onClick={() => handleNavClick("testimonial")}
                className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                  activeSection === "testimonial" ? "bg-[#ff671f] text-white shadow-lg" : "text-primary hover:opacity-70"
                }`}
              >
                So funktioniert's
              </button>
              <button
                onClick={() => handleNavClick("was-ist-xrisk")}
                className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                  activeSection === "was-ist-xrisk" ? "bg-[#ff671f] text-white shadow-lg" : "text-primary hover:opacity-70"
                }`}
              >
                Was ist xrisk?
              </button>
              <button
                onClick={() => handleNavClick("prozess")}
                className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                  activeSection === "prozess" ? "bg-[#ff671f] text-white shadow-lg" : "text-primary hover:opacity-70"
                }`}
              >
                Prozess
              </button>
              <button
                onClick={() => handleNavClick("faq")}
                className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                  activeSection === "faq" ? "bg-[#ff671f] text-white shadow-lg" : "text-primary hover:opacity-70"
                }`}
              >
                FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
