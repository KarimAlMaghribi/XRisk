function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#fdfcfc] text-[40px] w-full">Das Problem mit klassischen Versicherungen</p>
    </div>
  );
}

function SectionHeadline() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">Teuer. Unpersönlich. Standardlösungen, die oft nicht passen. Versicherungen funktionieren für die Masse – aber nicht für deinen speziellen Fall.</p>
    </div>
  );
}

function LeftRow() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#fdfcfc] text-[24px] w-full">xrisk macht es anders</p>
    </div>
  );
}

function SectionHeadline1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container1 />
      <div className="font-['Roboto:Regular',sans-serif] font-normal leading-[0] relative shrink-0 text-[#e6e5e5] text-[0px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[1.3] mb-[16px] text-[16px]">{`Wir verbinden dich mit Menschen, die sich mit deinem Thema auskennen. Du schilderst dein Risiko. `}</p>
        <ol className="list-decimal mb-[16px]" start="1">
          <li className="mb-0 ms-[calc(1.5*1*var(--list-marker-font-size,0))]">
            <span className="leading-[1.3] text-[16px]">{`Die KI Analysiert. `}</span>
          </li>
          <li className="mb-0 ms-[calc(1.5*1*var(--list-marker-font-size,0))]">
            <span className="leading-[1.3] text-[16px]">{`Interessierte bieten an. `}</span>
          </li>
          <li className="ms-[calc(1.5*1*var(--list-marker-font-size,0))]">
            <span className="leading-[1.3] text-[16px]">Du wählst.</span>
          </li>
        </ol>
        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Keine Konzerne. Nur echte Menschen.
        </p>
      </div>
    </div>
  );
}

function LeftRow1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#fdfcfc] text-[24px] w-full">Die Lösung</p>
    </div>
  );
}

function SectionHeadline2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container2 />
      <div className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-[16px]">Absicherung, die zu dir passt. Von Menschen, die wissen, wovon sie reden. Faire Preise, weil keine riesigen Verwaltungskosten.</p>
        <p>Keine Standardverträge. Keine versteckten Klauseln. Nur Menschen, die zusammenfinden, weil beide davon profitieren.</p>
      </div>
    </div>
  );
}

function LeftRow2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 content-stretch flex gap-[40px] grow items-start min-h-px min-w-px relative shrink-0">
      <LeftRow1 />
      <LeftRow2 />
    </div>
  );
}

export default function SectionWasIstXrisk() {
  return (
    <div className="bg-[#ff671f] relative size-full" data-name="Section Was ist xrisk">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[40px] items-start px-[188px] py-[80px] relative size-full">
          <LeftRow />
          <Frame />
        </div>
      </div>
    </div>
  );
}