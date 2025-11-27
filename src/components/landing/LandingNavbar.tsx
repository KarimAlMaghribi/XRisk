import { placeholderImage as imgLogo } from "../../assests/imgs/placeholder";
import { LandingButton } from "./LandingButton";
import { LandingNavLink } from "./LandingNavLink";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingNavbarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  isLoggedIn?: boolean;
  onLogin: () => void;
  userType?: string;
  onUserTypeChange?: (type: "risikogeber" | "risikonehmer") => void;
}

export function LandingNavbar({
  activeSection,
  scrollToSection,
  isLoggedIn = false,
  onLogin,
  userType: _userType,
  onUserTypeChange: _onUserTypeChange,
}: LandingNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Verhindere Scrollen wenn Mobile Menu offen ist
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup beim Unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full" role="banner">
      <div className="container-grid">
        <nav className="flex items-center justify-between py-4 px-[0px] py-[16px] relative z-50" aria-label="Hauptnavigation">
          {/* Left Side: Logo */}
          <div className="flex gap-6 items-center">
            <img
              src={imgLogo}
              alt="XRISK Logo - Zur Startseite"
              className="h-[48px] w-[55px]"
            />
          </div>

          {/* Desktop: Right Side Navigation Menu + Login Button */}
          <div className="hidden md:flex gap-6 items-center">
            {/* Navigation Menu */}
            <nav className="bg-surface-frost backdrop-blur-lg flex gap-2 items-center rounded-[100px] shadow-sm p-[4px] px-[8px] py-[0px]" aria-label="Seiten-Navigation">
              <LandingNavLink
                onClick={() => scrollToSection("testimonial")}
                isActive={activeSection === "testimonial"}
                aria-current={activeSection === "testimonial" ? "page" : undefined}
                aria-label="Zu Abschnitt: So funktioniert's"
              >
                So funktioniert's
              </LandingNavLink>
              <LandingNavLink
                onClick={() => scrollToSection("was-ist-xrisk")}
                isActive={activeSection === "was-ist-xrisk"}
                aria-current={activeSection === "was-ist-xrisk" ? "page" : undefined}
                aria-label="Zu Abschnitt: Was ist xrisk?"
              >
                Was ist xrisk?
              </LandingNavLink>
              <LandingNavLink
                onClick={() => scrollToSection("prozess")}
                isActive={activeSection === "prozess"}
                aria-current={activeSection === "prozess" ? "page" : undefined}
                aria-label="Zu Abschnitt: Prozess"
              >
                Prozess
              </LandingNavLink>
              <LandingNavLink
                onClick={() => scrollToSection("faq")}
                isActive={activeSection === "faq"}
                aria-current={activeSection === "faq" ? "page" : undefined}
                aria-label="Zu Abschnitt: FAQ"
              >
                FAQ
              </LandingNavLink>
            </nav>

            {/* Login Button */}
            {!isLoggedIn && (
              <LandingButton onClick={onLogin} aria-label="Anmelden oder Registrieren">
                Anmelden
              </LandingButton>
            )}
          </div>

          {/* Mobile: User Icon + Burger/X Menu Button */}
          <div className="md:hidden flex gap-2 items-center">
            {!isLoggedIn && (
              <button
                onClick={() => { onLogin(); }}
                className="p-2 rounded-lg bg-surface-frost backdrop-blur-lg"
                aria-label="Anmelden"
              >
                <User className="w-6 h-6 text-primary" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-frost backdrop-blur-lg relative w-[40px] h-[40px]"
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMobileMenuOpen}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="x"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-primary" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay - Fullscreen mit Frost Effect */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 pt-[80px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Frost Glass Overlay über gesamte Viewport */}
            <div className="absolute inset-0 backdrop-blur-[47px] bg-[rgba(245,245,245,0.85)]">
              <div className="container-grid h-full">
                <div className="flex flex-col justify-center items-center h-full p-6">
                  <motion.nav 
                    className="flex flex-col gap-6 w-full max-w-md" 
                    aria-label="Mobile Navigation"
                    initial="closed"
                    animate="open"
                    variants={{
                      open: {
                        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                      },
                      closed: {
                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                      }
                    }}
                  >
                    <motion.button
                      onClick={() => handleNavClick("testimonial")}
                      className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                        activeSection === "testimonial" 
                          ? "bg-[#ff671f] text-white shadow-lg" 
                          : "text-primary hover:opacity-70"
                      }`}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: 20 }
                      }}
                    >
                      So funktioniert's
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavClick("was-ist-xrisk")}
                      className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                        activeSection === "was-ist-xrisk" 
                          ? "bg-[#ff671f] text-white shadow-lg" 
                          : "text-primary hover:opacity-70"
                      }`}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: 20 }
                      }}
                    >
                      Was ist xrisk?
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavClick("prozess")}
                      className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                        activeSection === "prozess" 
                          ? "bg-[#ff671f] text-white shadow-lg" 
                          : "text-primary hover:opacity-70"
                      }`}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: 20 }
                      }}
                    >
                      Prozess
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavClick("faq")}
                      className={`text-center py-4 px-6 rounded-[16px] transition-all text-[20px] ${
                        activeSection === "faq" 
                          ? "bg-[#ff671f] text-white shadow-lg" 
                          : "text-primary hover:opacity-70"
                      }`}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: 20 }
                      }}
                    >
                      FAQ
                    </motion.button>
                  </motion.nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}