import { ReactNode } from "react";
import { LandingButton } from "./LandingButton";
import { LandingInput } from "./LandingInput";

interface StickyCTAProps {
  showStickyCTA: boolean;
  riskInput: string;
  setRiskInput: (value: string) => void;
  onRiskRequest: () => void;
  placeholder: string;
  buttonText: string;
  prefix?: ReactNode;
}

export function StickyCTA({
  showStickyCTA,
  riskInput,
  setRiskInput,
  onRiskRequest,
  placeholder,
  buttonText,
  prefix,
}: StickyCTAProps) {
  return (
    <div
      className={`fixed bottom-[40px] left-0 right-0 z-40 w-full transition-all duration-300 ${
        showStickyCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px] pointer-events-none"
      }`}
    >
      <div className="container-grid">
        <div className="flex gap-[16px] items-center justify-center w-full">
          {prefix}
          <LandingInput
            value={riskInput}
            onChange={setRiskInput}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          <LandingButton onClick={onRiskRequest}>
            {buttonText}
          </LandingButton>
        </div>
      </div>
    </div>
  );
}
