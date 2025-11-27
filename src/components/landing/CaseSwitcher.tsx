import imgSwitcherMarket from "figma:asset/2fb22e12698929d8163c2e846418914dcd3c2d2e.png";
import imgSwitcherBus from "figma:asset/bd5ef2489f9b4f9b730b2a87634c31cb90a5552a.png";

interface CaseSwitcherProps {
  variant: "market" | "bus";
  onVariantChange: (variant: "market" | "bus") => void;
  position?: "hero" | "section";
}

export function CaseSwitcher({ 
  variant, 
  onVariantChange,
  position = "section"
}: CaseSwitcherProps) {
  const positionClasses = position === "hero"
    ? "absolute md:bottom-[48px] bottom-[24px] md:right-[40px] left-[24px] md:left-auto right-auto z-[4] md:flex hidden"
    : "absolute md:top-[24px] md:right-[24px] top-[16px] right-[16px] z-[4]";

  return (
    <div className={`content-stretch flex gap-[10px] items-center ${positionClasses}`}>
      {/* Market Button */}
      <button
        onClick={() => onVariantChange("market")}
        className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer ${
          variant === "market" ? "md:h-[90px] md:w-[160px] h-[60px] w-[100px]" : "md:h-[90px] md:w-[90px] h-[60px] w-[60px]"
        }`}
        aria-label="Markt-Variante"
      >
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
          <img 
            alt="Markt" 
            className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" 
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
        className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer ${
          variant === "bus" ? "md:h-[90px] md:w-[160px] h-[60px] w-[100px]" : "md:h-[90px] md:w-[90px] h-[60px] w-[60px]"
        }`}
        aria-label="Bus-Variante"
      >
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
          <img 
            alt="Bus" 
            className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" 
            src={imgSwitcherBus} 
          />
          <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[16px] transition-opacity duration-500 ease-in-out ${
            variant === "bus" ? "opacity-0" : "opacity-100"
          }`} />
        </div>
      </button>
    </div>
  );
}