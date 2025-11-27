import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LegalNavbarProps {
  logo: string;
  onLogoClick: () => void;
}

export function LegalNavbar({ logo, onLogoClick }: LegalNavbarProps) {
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

  return (
    <header className="fixed top-0 z-50 w-full" role="banner">
      <div className="container-grid">
        <nav className="flex items-center justify-between py-4 px-[24px] py-[16px] relative z-50" aria-label="Hauptnavigation">
          {/* Left Side: Logo */}
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              onLogoClick();
            }}
            className="flex gap-6 items-center cursor-pointer"
            aria-label="Zurück zur Startseite"
          >
            <img
              src={logo}
              alt="XRISK Logo - Zur Startseite"
              className="h-[48px] w-[55px]"
            />
          </button>

          {/* Desktop: Right Side - Zurück Button */}
          <div className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                onLogoClick();
              }}
              className="bg-surface-frost backdrop-blur-lg px-[24px] py-[12px] rounded-[100px] shadow-sm hover:opacity-70 transition-opacity button-text text-primary"
            >
              Zurück zur Startseite
            </button>
          </div>

          {/* Mobile: Burger/X Menu Button */}
          <div className="md:hidden flex gap-2 items-center">
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
                  <motion.div 
                    className="flex flex-col gap-6 w-full max-w-md" 
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
                      onClick={() => {
                        window.scrollTo(0, 0);
                        onLogoClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-center py-4 px-6 rounded-[16px] transition-all text-[20px] bg-[#ff671f] text-white shadow-lg"
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: 20 }
                      }}
                    >
                      Zurück zur Startseite
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
