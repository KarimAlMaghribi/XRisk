import svgPaths from "./svg-46hs940qrm";

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

function Container1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Wert</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">450 €</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #4F4A4A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #4F4A4A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #4F4A4A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #4F4A4A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon1 />
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
    <div className="basis-0 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Kategorie</p>
      <p className="leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">Elektronik</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Container />
      <Container5 />
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">Details</p>
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Button Container">
      <Button />
    </div>
  );
}

function StyledDiv() {
  return (
    <div className="bg-[#e8f5e9] box-border content-stretch flex h-[28px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Styled(div)">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#00a63e] text-[12px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Aktiv
      </p>
    </div>
  );
}

function StyledDiv1() {
  return (
    <div className="bg-[#e8f5e9] box-border content-stretch flex h-[28px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Styled(div)">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#00a63e] text-[12px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        0 Angebote
      </p>
    </div>
  );
}

function StatusContainer() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-14px]" data-name="Status Container">
      <StyledDiv />
      <StyledDiv1 />
    </div>
  );
}

export default function Container7() {
  return (
    <div className="bg-[#fdfcfc] relative rounded-[16px] size-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <Container6 />
          <ButtonContainer />
          <StatusContainer />
        </div>
      </div>
    </div>
  );
}