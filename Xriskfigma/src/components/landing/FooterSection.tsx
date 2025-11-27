import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

interface FooterSectionProps {
  title: string;
  content: string;
}

export function FooterSection({ title, content }: FooterSectionProps) {
  return (
    <div className="bg-[#ff671f] relative w-full section-spacing-top">
      <div className="container-grid">
        <div className="grid-12 pb-[140px] pt-16">
          <div className="col-span-6 lg:col-span-4 flex flex-col gap-8">
            <p className="display-large text-white">Logo</p>
            <div className="flex flex-col gap-4 items-start">
              {["Impressum", "Datenschutz", "AGB", "Kontakt"].map((item) => (
                <p
                  key={item}
                  className="body-base text-white cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="col-span-3 lg:col-span-4 flex flex-col gap-[10px]">
            <img src={imgLogo} alt="XRISK Logo" className="h-[48px] w-[55px]" />
          </div>

          <div className="col-span-3 lg:col-span-4 flex flex-col gap-[10px]">
            <p className="heading-3 text-inverse mb-4">{title}</p>
            <div className="body-sm text-inverse" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </div>
  );
}
