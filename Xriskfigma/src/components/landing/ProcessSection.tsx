import svgPaths from "../../imports/svg-81dejan7f8";

interface ProcessStep {
  icon: string;
  title: string;
  description: string;
}

interface ProcessSectionProps {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
  image: string;
}

export function ProcessSection({ title, subtitle, steps, image }: ProcessSectionProps) {
  const renderIcon = (iconName: string) => {
    if (iconName === "user") {
      return <path d={svgPaths.p1edfde00} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />;
    } else if (iconName === "sparkles") {
      return (
        <>
          <path d={svgPaths.p33705900} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p161d4800} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2b304d00} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13e20900} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </>
      );
    } else if (iconName === "shield") {
      return (
        <>
          <path d={svgPaths.p2501aa80} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M14 2V8H20" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 13H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 17H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 9H9H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </>
      );
    }
    return null;
  };

  return (
    <div id="prozess" className="w-full section-spacing">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-6 flex flex-col gap-8 py-6">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col gap-2 items-start w-full">
                <h2 className="display-large text-primary" dangerouslySetInnerHTML={{ __html: title }} />
              </div>
              <p className="text-lg-medium text-primary">{subtitle}</p>
            </div>
            <div className="flex flex-col gap-6 items-start w-full">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        {renderIcon(step.icon)}
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">{step.title}</p>
                    <p className="body-base text-primary">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-6">
            <div className="box-border flex flex-col gap-[10px] h-full items-start justify-end p-6 rounded-[24px] w-full relative">
              <div className="absolute bg-gradient-to-b from-[rgba(29,27,27,0)] from-30% to-[#353131] to-[80.288%] inset-0 opacity-80 rounded-[24px]" />
              <div className="absolute inset-0 rounded-[24px] shadow-[10px_14px_34px_0px_rgba(0,0,0,0.12)]">
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-cover rounded-[24px] w-full h-full"
                  src={image}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
