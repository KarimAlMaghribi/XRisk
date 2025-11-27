import { placeholderImage as imgSwitcherMarket } from "../../assests/imgs/placeholder";
import { placeholderImage as imgSwitcherBus } from "../../assests/imgs/placeholder";

interface StickyCaseSwitcherProps {
  variant: "market" | "bus";
  onVariantChange: (variant: "market" | "bus") => void;
}

export function StickyCaseSwitcher({ 
  variant, 
  onVariantChange,
}: StickyCaseSwitcherProps) {
  return (
    <div className="fixed bottom-[24px] right-[24px] z-[55] md:flex hidden gap-[10px] items-center">
      {/* Market Button */}
      <button
        onClick={() => onVariantChange("market")}
        className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm ${
          variant === "market" ? "md:h-[90px] md:w-[160px] h-[60px] w-[100px]" : "md:h-[90px] md:w-[90px] h-[60px] w-[60px]"
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
        className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm ${
          variant === "bus" ? "md:h-[90px] md:w-[160px] h-[60px] w-[100px]" : "md:h-[90px] md:w-[90px] h-[60px] w-[60px]"
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
  );
}