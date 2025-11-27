import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

interface LandingFooterProps {
  onNavigate?: (page: string) => void;
}

export function LandingFooter({ onNavigate }: LandingFooterProps) {
  return (
    <div id="footer" className="bg-[#ff671f] relative w-full section-spacing-top">
      <div className="container-grid">
        <div className="grid-12 md:py-[80px] py-[48px] items-start">
          {/* Logo Column - Full width on mobile, 4 cols on tablet/desktop */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-8 mb-8 md:mb-0">
            <img 
              src={imgLogo} 
              alt="XRISK Logo" 
              className="h-[64px] w-auto" 
            />
          </div>
          
          {/* Navigation Links - 6 cols on mobile (half width), 4 cols on tablet/desktop */}
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
                  window.scrollTo(0, 0);
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
          
          {/* Contact Column - 6 cols on mobile (half width), 4 cols on tablet/desktop */}
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
  );
}