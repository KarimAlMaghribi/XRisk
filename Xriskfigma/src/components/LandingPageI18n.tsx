import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import svgPaths from "../imports/svg-81dejan7f8";
import imgHero from "figma:asset/8da9f4d8505392858a4876192fdbc43219c9c92b.png";
import imgThomas from "figma:asset/04bf8ed6670921df0ee3f16a7f4299051621dc9e.png";
import imgSarah from "figma:asset/ead073ee4b7600bb3e79d185babd7876f5a36394.png";
import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";
import { RiskInputModal } from "./RiskInputModal";
import { LandingNavbar } from "./landing/LandingNavbar";
import { FAQSection } from "./landing/FAQSection";
import SectionWasIstXrisk from "../imports/SectionWasIstXrisk";

interface LandingPageProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
  onUserTypeChange: (type: "risikogeber" | "risikonehmer") => void;
}

export function LandingPageI18n({ onLogin, isLoggedIn = false, onUserTypeChange }: LandingPageProps) {
  const { t } = useTranslation('common');
  const [activeSection, setActiveSection] = useState("hero");
  const [riskInput, setRiskInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // ... alle anderen useState und useEffect bleiben gleich ...

  const handleRiskRequest = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#fdfcfc] flex flex-col items-start relative w-full">
      <LandingNavbar
        activeSection={activeSection}
        scrollToSection={(id) => {/* scrollToSection logic */}}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        userType="risikogeber"
        onUserTypeChange={onUserTypeChange}
      />

      {/* Hero Section - BEISPIEL mit i18n */}
      <div id="hero" className="w-full">
        <div className="container-hero">
          <div className="h-[720px] relative w-full my-8 overflow-hidden rounded-[24px]">
            <div className="basis-0 grow min-h-px min-w-px relative rounded-[24px] h-full">
              <img 
                alt="" 
                className="absolute inset-0 max-w-none object-cover rounded-[24px] w-full h-full" 
                src={imgHero} 
              />
              <div className="flex flex-col justify-center w-full h-full">
                <div className="box-border flex flex-col items-start justify-center relative w-full h-full p-6">
                  <div className="hero-grid w-full relative z-[3]">
                    <div className="col-span-6 flex flex-col gap-[32px]">
                      <div className="flex flex-col gap-[10px]">
                        {/* ✅ Übersetzter Hero Text */}
                        <p className="display-hero text-inverse [text-shadow:#000000_10px_5px_40px]">
                          <span>{t('hero.headline.line1')} </span>
                          <br />
                          <span>{t('hero.headline.line2')} </span>
                          <span className="text-brand">{t('hero.headline.line3')} </span>
                          <br />
                          <span className="text-brand">{t('hero.headline.line4')}</span>
                        </p>
                        <p className="text-lg-medium text-inverse [text-shadow:#000000_10px_5px_40px]">
                          {t('hero.subheadline')}
                        </p>
                      </div>
                      
                      {/* ✅ Übersetzter CTA */}
                      <div className="flex gap-[16px] items-center">
                        <div className="backdrop-blur-[47px] bg-[rgba(245,245,245,0.85)] border border-[#dddddd] flex-1 rounded-[100px] shadow-[10px_10px_20px_0px_rgba(0,0,0,0.1)]">
                          <input
                            type="text"
                            value={riskInput}
                            onChange={(e) => setRiskInput(e.target.value)}
                            placeholder={t('hero.inputPlaceholder')}
                            className="body-base text-primary placeholder:text-primary bg-transparent w-full px-[24px] py-[16px] outline-none"
                          />
                        </div>
                        <button
                          className="bg-[#ff671f] px-[24px] py-[16px] rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#e05a1b] transition-all border-none"
                          onClick={handleRiskRequest}
                        >
                          <span className="button-text text-white whitespace-nowrap">
                            {t('hero.button')}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-gradient-to-l from-[rgba(29,27,27,0)] from-[34.809%] to-[#353131] to-[76.924%] inset-0 opacity-80 rounded-[24px] z-[2]" />
                  <div className="absolute inset-0 rounded-[24px] z-[1]">
                    <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[24px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weitere Sections mit t('key.path') ... */}

      <RiskInputModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRiskDescription={riskInput}
      />
    </div>
  );
}
