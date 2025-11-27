import { LandingButton } from "./LandingButton";

interface CTASectionProps {
  title: string;
  content: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function CTASection({ title, content, buttonText, onButtonClick }: CTASectionProps) {
  return (
    <div className="w-full section-spacing">
      <div className="bg-[#ff671f] py-16 relative shrink-0 w-full rounded-[24px]">
        <div className="container-grid">
          <div className="grid-12 items-center">
            {/* Left Side - Title */}
            <div className="col-span-6 flex flex-col gap-6 text-[#e6e5e5]">
              <div
                className="display-large text-inverse"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <div
                className="text-lg-medium text-inverse"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* Right Side - CTA Button */}
            {buttonText && onButtonClick && (
              <div className="col-span-6 flex items-center justify-center">
                <button
                  className="bg-surface px-8 py-4 rounded-[100px] shadow-md cursor-pointer hover:bg-surface-variant border-none button-text text-brand"
                  style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  onClick={onButtonClick}
                >
                  {buttonText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
