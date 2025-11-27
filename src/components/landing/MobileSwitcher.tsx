import { useState, useEffect, useRef } from "react";
import imgSwitcherMarket from "figma:asset/2fb22e12698929d8163c2e846418914dcd3c2d2e.png";
import imgSwitcherBus from "figma:asset/bd5ef2489f9b4f9b730b2a87634c31cb90a5552a.png";

interface MobileSwitcherProps {
  variant: "market" | "bus";
  onVariantChange: (variant: "market" | "bus") => void;
}

export function MobileSwitcher({ 
  variant, 
  onVariantChange,
}: MobileSwitcherProps) {
  const [isSticky, setIsSticky] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        // Wenn der Placeholder den oberen Rand erreicht oder gescrollt wurde, wird sticky unten
        setIsSticky(window.scrollY > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={placeholderRef} className="md:hidden flex gap-[10px] items-center relative">
      {/* Actual Switcher */}
      <div 
        className={`flex gap-[10px] items-center transition-all duration-300 ${
          isSticky 
            ? 'fixed bottom-[24px] left-[24px] z-[55]' 
            : ''
        }`}
      >
        {/* Market Button */}
        <button
          onClick={() => onVariantChange("market")}
          className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg ${
            variant === "market" ? "h-[60px] w-[100px]" : "h-[60px] w-[60px]"
          }`}
          aria-label="Markt-Variante"
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
            <img 
              alt="Markt" 
              className="absolute max-w-none object-center object-cover rounded-[16px] size-full" 
              src={imgSwitcherMarket} 
            />
            <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[16px] transition-opacity duration-500 ease-in-out ${
              variant === "market" ? "opacity-0" : "opacity-100"
            }`} />
          </div>
        </button>

        {/* Bus Button */}
        <button
          onClick={() => onVariantChange("bus")}
          className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg ${
            variant === "bus" ? "h-[60px] w-[100px]" : "h-[60px] w-[60px]"
          }`}
          aria-label="Bus-Variante"
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
            <img 
              alt="Bus" 
              className="absolute max-w-none object-center object-cover rounded-[16px] size-full" 
              src={imgSwitcherBus} 
            />
            <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[16px] transition-opacity duration-500 ease-in-out ${
              variant === "bus" ? "opacity-0" : "opacity-100"
            }`} />
          </div>
        </button>
      </div>
    </div>
  );
}