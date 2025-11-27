import svgPaths from "./svg-yot5s7zz8y";
import imgEllipse4 from "figma:asset/d16ba8c09db916e04afd07b8a8695019ab55f9ce.png";

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
          <path d={svgPaths.pe1f5000} id="Vector" stroke="var(--stroke-0, #4F4A4A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <Container />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame />
      <Container1 />
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
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse4} width="24" />
      </div>
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame4 />
      <Frame1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Prämie</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">20 - 30 €</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Frame3 />
      <Container5 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Angebot abgeben</p>
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full" data-name="Button Container">
      <Container7 />
    </div>
  );
}

export default function RisikoCardDefault() {
  return (
    <div className="bg-[#fdfcfc] relative rounded-[16px] size-full" data-name="RisikoCard - Default">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative size-full">
          <Container6 />
          <ButtonContainer />
        </div>
      </div>
    </div>
  );
}