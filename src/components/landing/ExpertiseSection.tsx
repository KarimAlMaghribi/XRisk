interface ExpertiseSectionProps {
  subtitle: string;
  title: string;
  description: string;
  card1Image: string;
  card1Label: string;
  card1Quote: string;
  card2Image: string;
  card2Label: string;
  card2Quote: string;
}

export function ExpertiseSection({
  subtitle,
  title,
  description,
  card1Image,
  card1Label,
  card1Quote,
  card2Image,
  card2Label,
  card2Quote,
}: ExpertiseSectionProps) {
  return (
    <div id="was-ist-xrisk" className="w-full py-16">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-6 flex flex-col gap-10">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col gap-2 items-start w-full">
                <p className="text-lg-medium text-primary">{subtitle}</p>
                <h2 className="display-large text-primary">{title}</h2>
              </div>
              <p className="text-lg-medium text-primary">{description}</p>
            </div>
            <div className="box-border flex flex-col gap-[10px] h-[600px] items-start justify-end p-6 rounded-[24px] w-full relative">
              <div className="absolute bg-gradient-to-b from-[rgba(29,27,27,0)] from-30% to-[#353131] to-[80.288%] inset-0 opacity-80 rounded-[24px]" />
              <div className="absolute inset-0 rounded-[24px] shadow-[10px_14px_34px_0px_rgba(0,0,0,0.12)]">
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-cover rounded-[24px] w-full h-full"
                  src={card1Image}
                />
              </div>
              <p className="text-lg-medium text-inverse relative z-10">{card1Label}</p>
              <p className="heading-3 text-inverse relative z-10">{card1Quote}</p>
            </div>
          </div>

          <div className="col-span-6">
            <div className="box-border flex flex-col gap-[10px] h-[600px] items-start justify-end p-6 rounded-[24px] w-full relative">
              <div className="absolute bg-gradient-to-b from-[rgba(29,27,27,0)] from-30% to-[#353131] to-[80.288%] inset-0 opacity-80 rounded-[24px]" />
              <div className="absolute inset-0 rounded-[24px] shadow-[10px_14px_34px_0px_rgba(0,0,0,0.12)]">
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-cover rounded-[24px] w-full h-full"
                  src={card2Image}
                />
              </div>
              <p className="text-lg-medium text-inverse relative z-10">{card2Label}</p>
              <p className="heading-3 text-inverse relative z-10">{card2Quote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
