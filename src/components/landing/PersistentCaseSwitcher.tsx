import { placeholderImage as imgSwitcherMarket } from "../../assests/imgs/placeholder";
import { placeholderImage as imgSwitcherBus } from "../../assests/imgs/placeholder";

interface PersistentCaseSwitcherProps {
  variant: "market" | "bus";
  onVariantChange: (variant: "market" | "bus") => void;
  onRiskRequest?: () => void;
}

export function PersistentCaseSwitcher({ 
  variant, 
  onVariantChange,
  onRiskRequest,
}: PersistentCaseSwitcherProps) {
  return (
    <>
      {/* Mobile only: CTA Button + Switcher - full width bar */}
      <div 
        className="md:hidden fixed bottom-[16px] left-[16px] right-[16px] z-[55] flex gap-[12px] items-center justify-between"
        role="group"
        aria-label="Mobile Navigation"
      >
        {/* CTA Button */}
        <button
          onClick={onRiskRequest}
          className="flex-1 bg-[#ff671f] px-[20px] py-[14px] rounded-[100px] shadow-lg cursor-pointer hover:bg-[#e05a1b] active:scale-95 transition-all border-none"
          aria-label="Risiko beschreiben"
        >
          <span className="button-text text-white text-center block">Risiko beschreiben</span>
        </button>

        {/* Switcher */}
        <div className="flex gap-[10px] items-center shrink-0">
          {/* Market Button */}
          <button
            onClick={() => onVariantChange("market")}
            className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
              variant === "market" 
                ? "h-[48px] w-[84px]" 
                : "h-[48px] w-[48px]"
            }`}
            aria-label="Markt-Variante"
            aria-pressed={variant === "market"}
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
            className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
              variant === "bus" 
                ? "h-[48px] w-[84px]" 
                : "h-[48px] w-[48px]"
            }`}
            aria-label="Bus-Variante"
            aria-pressed={variant === "bus"}
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
    </>
  );
}

// Separate component for desktop switcher in sticky CTA
export function DesktopSwitcher({ 
  variant, 
  onVariantChange,
}: { variant: "market" | "bus"; onVariantChange: (variant: "market" | "bus") => void }) {
  return (
    <div className="flex gap-[10px] items-center shrink-0" role="group" aria-label="Varianten-Switcher">
      {/* Market Button */}
      <button
        onClick={() => onVariantChange("market")}
        className={`relative rounded-[100px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
          variant === "market" 
            ? "h-[48px] w-[88px]" 
            : "h-[48px] w-[48px]"
        }`}
        aria-label="Markt-Variante"
        aria-pressed={variant === "market"}
      >
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[100px]">
          <img 
            alt="Markt" 
            className="absolute max-w-none object-center object-cover rounded-[100px] size-full" 
            src={imgSwitcherMarket} 
          />
          <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[100px] transition-opacity duration-500 ease-in-out ${
            variant === "market" ? "opacity-0" : "opacity-100"
          }`} />
        </div>
      </button>

      {/* Bus Button */}
      <button
        onClick={() => onVariantChange("bus")}
        className={`relative rounded-[100px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
          variant === "bus" 
            ? "h-[48px] w-[88px]" 
            : "h-[48px] w-[48px]"
        }`}
        aria-label="Bus-Variante"
        aria-pressed={variant === "bus"}
      >
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[100px]">
          <img 
            alt="Bus" 
            className="absolute max-w-none object-center object-cover rounded-[100px] size-full" 
            src={imgSwitcherBus} 
          />
          <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[100px] transition-opacity duration-500 ease-in-out ${
            variant === "bus" ? "opacity-0" : "opacity-100"
          }`} />
        </div>
      </button>
    </div>
  );
}