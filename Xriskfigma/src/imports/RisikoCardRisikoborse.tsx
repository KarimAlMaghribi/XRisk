import svgPaths from "./svg-bthu9btyeo";

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-[256px]">
      <div className="basis-0 bg-[#ff671f] grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0" />
      <div className="basis-0 bg-[#ff671f] grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0" />
      <div className="basis-0 bg-[#d9d9d9] grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0" />
      <div className="basis-0 bg-[#d9d9d9] grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0" />
      <div className="basis-0 bg-[#d9d9d9] grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0" />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M7.5 8.25V12.75" id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10.5 8.25V12.75" id="Vector_2" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3357c900} id="Vector_3" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M2.25 4.5H15.75" id="Vector_4" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p19dfc880} id="Vector_5" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function StyledButton() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Styled(button)">
      <Icon />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <StyledButton />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">
      <p className="relative shrink-0">{`{Vorname}`}</p>
      <p className="relative shrink-0">{`{Nachname}`}</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="12" />
        </svg>
      </div>
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Container />
      <Frame1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Prämie</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">20 - 30 €</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Frame3 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Angebot abgeben</p>
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full" data-name="Button Container">
      <Container6 />
    </div>
  );
}

export default function RisikoCardRisikoborse() {
  return (
    <div className="bg-[#fdfcfc] relative rounded-[16px] size-full" data-name="RisikoCard - Risikobörse">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <Frame />
          <Container5 />
          <ButtonContainer />
        </div>
      </div>
    </div>
  );
}