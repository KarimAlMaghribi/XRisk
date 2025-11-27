import { LandingButton } from "./LandingButton";
import { LandingInput } from "./LandingInput";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  placeholder?: string;
  buttonText: string;
  riskInput?: string;
  setRiskInput?: (value: string) => void;
  onRiskRequest: () => void;
  backgroundImage: string;
  hideInput?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  placeholder = "",
  buttonText,
  riskInput = "",
  setRiskInput = () => {},
  onRiskRequest,
  backgroundImage,
  hideInput = false,
}: HeroSectionProps) {
  return (
    <section id="hero" className="w-full">
      <div className="container-hero">
        <div className="md:h-[720px] h-[500px] relative w-full md:my-8 my-0">
          <div className="basis-0 grow min-h-px min-w-px relative md:rounded-[24px] rounded-none h-full">
            <div className="flex flex-col justify-center w-full h-full">
              <div className="box-border flex flex-col items-start justify-center relative w-full h-full md:p-6 p-6">
                {/* Text content aligned to grid with 6/6 split */}
                <div className="hero-grid w-full h-full items-center">
                  <div className="col-span-6 flex flex-col gap-[10px] justify-center text-white z-[3]">
                    <div>
                      <h1
                        className="display-hero text-inverse [text-shadow:#000000_10px_5px_40px] mb-4"
                        dangerouslySetInnerHTML={{ __html: title }}
                      />
                      <p className="text-lg-medium text-inverse [text-shadow:#000000_10px_5px_40px]">
                        {subtitle}
                      </p>
                    </div>

                    {/* CTA Element in Hero */}
                    {hideInput ? (
                      <div className="flex gap-[16px] items-start mt-4">
                        <LandingButton onClick={onRiskRequest} className="px-8 py-4">
                          {buttonText}
                        </LandingButton>
                      </div>
                    ) : (
                      <div className="flex gap-[16px] items-center">
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
                    )}
                  </div>
                </div>
                <div className="absolute bg-gradient-to-l from-[rgba(29,27,27,0)] from-[34.809%] to-[#353131] to-[76.924%] inset-0 opacity-80 md:rounded-[24px] rounded-none z-[2]" />
                <div className="absolute inset-0 md:rounded-[24px] rounded-none z-[1]">
                  <img
                    alt=""
                    className="absolute inset-0 max-w-none object-cover md:rounded-[24px] rounded-none w-full h-full"
                    src={backgroundImage}
                  />
                  <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 md:rounded-[24px] rounded-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}