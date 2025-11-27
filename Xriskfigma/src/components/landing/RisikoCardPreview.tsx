interface RisikoCardPreviewProps {
  title: string;
  category: string;
  premium: string;
  coverage: string;
  progress?: number; // 0-5, how many progress bars are filled
}

export function RisikoCardPreview({
  title,
  category,
  premium,
  coverage,
  progress = 2,
}: RisikoCardPreviewProps) {
  return (
    <div className="bg-[#fdfcfc] relative rounded-[16px] h-full" data-name="RisikoCard - Preview">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative size-full gap-[24px]">
          {/* Progress Bar */}
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`basis-0 grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0 ${
                  index < progress ? "bg-[#ff671f]" : "bg-[#d9d9d9]"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
            {/* Title and Category */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#353131] text-[16px] w-full">
                {title}
              </p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[24px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" fill="var(--fill-0, #D9D9D9)" r="12" />
                  </svg>
                </div>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px]">
                  {category}
                </p>
              </div>
            </div>

            {/* Premium and Coverage */}
            <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
              {/* Premium */}
              <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">
                  Prämie
                </p>
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">
                  {premium}
                </p>
              </div>

              {/* Coverage */}
              <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">
                  Deckung
                </p>
                <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px]">
                    {coverage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
