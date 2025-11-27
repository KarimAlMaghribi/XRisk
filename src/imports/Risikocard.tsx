import svgPaths from "./svg-uh0650197e";
import { placeholderImage as imgEllipse4 } from "../assests/imgs/placeholder";

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
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Wert</p>
      <div className="bg-[#d9d9d9] h-[21px] relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] w-full" />
      </div>
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
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Container />
      <Container4 />
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#e6e5e5] text-[16px] text-nowrap whitespace-pre">Details</p>
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

function CustomBadge() {
  return (
    <div className="bg-[#e6e5e5] box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative rounded-[8px] shrink-0" data-name="CustomBadge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">Analyse läuft</p>
    </div>
  );
}

function StatusContainer() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-17px]" data-name="Status Container">
      <CustomBadge />
    </div>
  );
}

function RisikoCardDashboarsAnalyse() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] self-stretch shrink-0" data-name="RisikoCard - Dashboars - Analyse">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container5 />
      <ButtonContainer />
      <StatusContainer />
    </div>
  );
}

function Icon2() {
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

function StyledButton1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Styled(button)">
      <Icon2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <StyledButton1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Wert</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">450 €</p>
    </div>
  );
}

function Icon3() {
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

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon3 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Container6 />
      <Container10 />
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">Details</p>
    </div>
  );
}

function ButtonContainer1() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Button Container">
      <Button1 />
    </div>
  );
}

function ButtonContainer2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Button Container">
      <ButtonContainer1 />
    </div>
  );
}

function CustomBadge1() {
  return (
    <div className="bg-[#e6e5e5] box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative rounded-[8px] shrink-0" data-name="CustomBadge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">Entwurf</p>
    </div>
  );
}

function StatusContainer1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-17px]" data-name="Status Container">
      <CustomBadge1 />
    </div>
  );
}

function RisikoCardDashboarsAnalyse1() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] self-stretch shrink-0" data-name="RisikoCard - Dashboars - Analyse">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container11 />
      <ButtonContainer2 />
      <StatusContainer1 />
    </div>
  );
}

function Icon4() {
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

function StyledButton2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Styled(button)">
      <Icon4 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <StyledButton2 />
    </div>
  );
}

function Container13() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Wert</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">450 €</p>
    </div>
  );
}

function Icon5() {
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

function Container14() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon5 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Container12 />
      <Container16 />
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">Details</p>
    </div>
  );
}

function ButtonContainer3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Button Container">
      <Button2 />
    </div>
  );
}

function RisikoCardDashboarsAktiv() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] self-stretch shrink-0" data-name="RisikoCard - Dashboars - Aktiv">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container17 />
      <ButtonContainer3 />
    </div>
  );
}

function Icon6() {
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

function StyledButton3() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Styled(button)">
      <Icon6 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <StyledButton3 />
    </div>
  );
}

function Container19() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Bestes Angebot</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">45 €</p>
    </div>
  );
}

function Icon7() {
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

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container20 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Container18 />
      <Container22 />
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">Details</p>
    </div>
  );
}

function ButtonContainer4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Button Container">
      <Button3 />
    </div>
  );
}

function CustomBadge2() {
  return (
    <div className="bg-[#ffa726] box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative rounded-[8px] shrink-0" data-name="CustomBadge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3 Angebote</p>
    </div>
  );
}

function StatusContainer2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-17px] w-[77.711px]" data-name="Status Container">
      <CustomBadge2 />
    </div>
  );
}

function RisikoCardPending() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] self-stretch shrink-0" data-name="RisikoCard - Pending">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container23 />
      <ButtonContainer4 />
      <StatusContainer2 />
    </div>
  );
}

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

function Icon8() {
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

function StyledButton4() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Styled(button)">
      <Icon8 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <StyledButton4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame />
      <Container24 />
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

function Container25() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Prämie</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">25 €</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container27 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Frame3 />
      <Container28 />
    </div>
  );
}

function Button4() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">Details</p>
    </div>
  );
}

function ButtonContainer5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Button Container">
      <Button4 />
    </div>
  );
}

function ButtonContainer6() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full" data-name="Button Container">
      <ButtonContainer5 />
    </div>
  );
}

function CustomBadge3() {
  return (
    <div className="bg-[#ffa726] box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative rounded-[8px] shrink-0" data-name="CustomBadge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Noch 2 Tage</p>
    </div>
  );
}

function StatusContainer3() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-17px]" data-name="Status Container">
      <CustomBadge3 />
    </div>
  );
}

function RisikoCardUernommenesRisiko() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col h-[349px] items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0" data-name="RisikoCard - Üernommenes Risiko">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container29 />
      <ButtonContainer6 />
      <StatusContainer3 />
    </div>
  );
}

function Frame12() {
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

function Icon9() {
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

function StyledButton5() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Styled(button)">
      <Icon9 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <StyledButton5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame12 />
      <Container30 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">
      <p className="relative shrink-0">{`{Vorname}`}</p>
      <p className="relative shrink-0">{`{Nachname}`}</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse4} width="24" />
      </div>
      <Frame13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame5 />
      <Frame14 />
    </div>
  );
}

function Container31() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Prämie</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">25 €</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Frame15 />
      <Container34 />
    </div>
  );
}

function Button5() {
  return (
    <div className="basis-0 box-border content-stretch flex grow h-[46px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">Details</p>
    </div>
  );
}

function ButtonContainer7() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Button Container">
      <Button5 />
    </div>
  );
}

function ButtonContainer8() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full" data-name="Button Container">
      <ButtonContainer7 />
    </div>
  );
}

function CustomBadge4() {
  return (
    <div className="bg-[#e6e5e5] box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative rounded-[8px] shrink-0" data-name="CustomBadge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">Abgeschlossen</p>
    </div>
  );
}

function StatusContainer4() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-17px]" data-name="Status Container">
      <CustomBadge4 />
    </div>
  );
}

function RisikoCardUbernommenesRiskoAbgeschlossen() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col h-[349px] items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0" data-name="RisikoCard - Übernommenes Risko - Abgeschlossen">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container35 />
      <ButtonContainer8 />
      <StatusContainer4 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full">
      <RisikoCardDashboarsAnalyse />
      <RisikoCardDashboarsAnalyse1 />
      <RisikoCardDashboarsAktiv />
      <RisikoCardPending />
      <RisikoCardUernommenesRisiko />
      <RisikoCardUbernommenesRiskoAbgeschlossen />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0">
      <p className="[text-shadow:rgba(0,0,0,0.25)_24px_24px_80px] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[22px] text-black w-full">Risikocard - Dashboard</p>
      <Frame8 />
    </div>
  );
}

function Frame16() {
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

function Icon10() {
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

function Container36() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <Container36 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame16 />
      <Container37 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">
      <p className="relative shrink-0">{`{Vorname}`}</p>
      <p className="relative shrink-0">{`{Nachname}`}</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse4} width="24" />
      </div>
      <Frame17 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame6 />
      <Frame18 />
    </div>
  );
}

function Container38() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Prämie</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">20 - 30 €</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container39 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container38 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Frame19 />
      <Container41 />
    </div>
  );
}

function Container43() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Angebot abgeben</p>
    </div>
  );
}

function ButtonContainer9() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full" data-name="Button Container">
      <Container43 />
    </div>
  );
}

function RisikoCardDefault() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col h-[347px] items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0" data-name="RisikoCard - Default">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container42 />
      <ButtonContainer9 />
    </div>
  );
}

function Frame20() {
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

function Icon11() {
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

function Container44() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px]" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[262.25px]" data-name="Container">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen</p>
      <Container44 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame20 />
      <Container45 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">Von Dir</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse4} width="24" />
      </div>
      <Frame21 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame7 />
      <Frame22 />
    </div>
  );
}

function Container46() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Prämie</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">20 - 30 €</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px] w-[52px]">14 Tage</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">Laufzeit</p>
      <Container47 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Container">
      <Frame23 />
      <Container49 />
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-[#e6e5e5] box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#4f4a4a] text-[16px] text-nowrap whitespace-pre">Angebot abgeben</p>
    </div>
  );
}

function ButtonContainer10() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full" data-name="Button Container">
      <Container51 />
    </div>
  );
}

function RisikoCardEigenesAngebot() {
  return (
    <div className="bg-[#fdfcfc] box-border content-stretch flex flex-col h-[347px] items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0" data-name="RisikoCard - Eigenes Angebot">
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container50 />
      <ButtonContainer10 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full">
      <RisikoCardDefault />
      <RisikoCardEigenesAngebot />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-[652.5px]">
      <p className="[text-shadow:rgba(0,0,0,0.25)_24px_24px_80px] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[22px] text-black w-full">Risikocard - Risikobörse</p>
      <Frame9 />
    </div>
  );
}

export default function Risikocard() {
  return (
    <div className="bg-white relative rounded-[2px] size-full" data-name="Risikocard">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[36px] items-start overflow-clip p-[40px] relative size-full">
          <Frame11 />
          <Frame10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}