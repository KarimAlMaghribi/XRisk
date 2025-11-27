import svgPaths from "./svg-t9c3p1lid7";
import imgRectangle33 from "figma:asset/2fb22e12698929d8163c2e846418914dcd3c2d2e.png";
import imgRectangle34 from "figma:asset/bd5ef2489f9b4f9b730b2a87634c31cb90a5552a.png";
import imgImage from "figma:asset/fea06be5cea92d665177a3b32ba42a925e4a88c3.png";
import imgImage1 from "figma:asset/b4ecfaf9c6e73e8dd6c209458e50397edd6b1743.png";

function Frame34() {
  return (
    <div className="absolute bottom-[40px] content-stretch flex gap-[10px] items-center right-[40px] z-[4]">
      <div className="relative rounded-[16px] shrink-0 size-[56px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgRectangle33} />
      </div>
      <div className="relative rounded-[16px] shrink-0 size-[48px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgRectangle34} />
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start not-italic relative shrink-0 text-[#e6e5e5] w-full">
      <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 text-[52px] w-full">
        <span>{`Wenn das Wetter `}</span>
        <span className="text-[#ff671f]">{`deinen Markttag `}</span>verhagelt.
      </p>
      <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full">Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative shrink-0 w-[630px] z-[3]">
      <Frame32 />
    </div>
  );
}

function HeroImage() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[24px] shrink-0 w-full" data-name="Hero Image">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] isolate items-start justify-center pb-[40px] pl-[108px] pr-[217px] pt-[24px] relative size-full">
          <Frame34 />
          <Frame9 />
          <div className="absolute inset-0 rounded-bl-[24px] rounded-br-[24px] z-[1]" data-name="Image">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-br-[24px]">
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-bl-[24px] rounded-br-[24px] size-full" src={imgImage} />
              <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-bl-[24px] rounded-br-[24px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSectionTeaser() {
  return (
    <div className="h-[800px] relative shrink-0 w-full" data-name="Hero Section - Teaser">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[800px] items-start justify-center pb-[80px] pt-0 px-[80px] relative w-full">
          <HeroImage />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[0px] text-[18px] w-full">
        <span>{`So funktioniert `}</span>
        <span className="not-italic text-[#ff671f]">x</span>risk
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 text-[40px] w-full">
        <span className="text-[#ff671f]">Zwei Menschen.</span>
        <span>
          {" "}
          <br aria-hidden="true" />
          {`Ein Risiko. `}
        </span>
        <span className="text-[#ff671f]">Eine Lösung.</span>
      </p>
    </div>
  );
}

function SectionHeadline() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-[#353131] w-full" data-name="Section headline">
      <Container />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full">Wenn Künstler auf Wetterexperten treffen, entstehen faire Absicherungen – direkt, ohne Umwege.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Lena, Künstlerin
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">{`"Letztes Wochenende: Sturm. Keine Besucher. 600€ Verlust. Das darf mir nicht nochmal passieren."`}</p>
    </div>
  );
}

function TestimonialImage() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[24px] shrink-0 w-full" data-name="TestimonialImage">
      <div className="flex flex-col justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-end p-[24px] relative size-full">
          <div className="absolute inset-0 opacity-80 rounded-[24px]" data-name="Abblende" />
          <div className="absolute inset-0 rounded-[24px]" data-name="Image">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[24px] size-full" src={imgRectangle33} />
              <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-[24px] to-[rgba(0,0,0,0.8)]" />
            </div>
          </div>
          <Frame />
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] min-w-full relative shrink-0 text-[#e6e5e5] text-[16px] w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Lena verkauft ihre Bilder auf Kunstmärkten. Aber wenn das Wetter nicht mitspielt, bleiben die Besucher weg – und ihre Einnahmen aus. Sie sucht eine Absicherung gegen genau dieses Risiko.
          </p>
        </div>
      </div>
    </div>
  );
}

function LeftRow() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow h-[900px] items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline />
      <TestimonialImage />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Martin, Landwirt
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">{`“Ich kenne Wetter. Ich kenne Prognosen. Und ich weiß, wie man Risiken kalkuliert."`}</p>
    </div>
  );
}

function TestimonialImage1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] h-full items-start justify-end p-[24px] relative rounded-[24px] shrink-0 w-[512px]" data-name="TestimonialImage">
      <div className="absolute inset-0 opacity-80 rounded-[24px]" data-name="Abblende" />
      <div className="absolute inset-0 rounded-[24px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[24px] size-full" src={imgImage1} />
          <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-[24px] to-[rgba(0,0,0,0.8)]" />
        </div>
      </div>
      <Frame1 />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] min-w-full relative shrink-0 text-[#e6e5e5] text-[16px] w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Martin bewirtschaftet seit 20 Jahren einen Hof und beobachtet täglich Wetterlagen. Er sieht Potenzial darin, Wetterrisiken zu übernehmen und dabei zu verdienen.
      </p>
    </div>
  );
}

function RightRow() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative self-stretch shrink-0" data-name="Right Row">
      <TestimonialImage1 />
    </div>
  );
}

function SectionWasIstXrisk() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section Was ist xrisk">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[40px] items-start px-[188px] py-[80px] relative w-full">
          <LeftRow />
          <RightRow />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#353131] text-[40px] w-full">Individuelle Risiken, Individuelle Lösungen</p>
    </div>
  );
}

function SectionHeadline1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Lena, Künstlerin
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">{`"Letztes Wochenende: Sturm. Keine Besucher. 600€ Verlust. Das darf mir nicht nochmal passieren."`}</p>
    </div>
  );
}

function TestimonialImage2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] h-[474px] items-start justify-end p-[24px] relative rounded-[24px] shrink-0 w-[729px]" data-name="TestimonialImage">
      <div className="absolute inset-0 opacity-80 rounded-[24px]" data-name="Abblende" />
      <div className="absolute inset-0 rounded-bl-[24px] rounded-tl-[24px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-bl-[24px] rounded-tl-[24px] size-full" src={imgRectangle33} />
          <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-bl-[24px] rounded-tl-[24px] to-[rgba(0,0,0,0.8)]" />
        </div>
      </div>
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#ededed] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Marco, T3-Besitzer
      </p>
    </div>
  );
}

function TestimonialImage3() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="TestimonialImage">
      <div className="flex flex-col justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-end p-[24px] relative size-full">
          <div className="absolute inset-0 opacity-80 rounded-[24px]" data-name="Abblende" />
          <div className="absolute inset-0 rounded-br-[24px] rounded-tr-[24px]" data-name="Image">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-br-[24px] rounded-tr-[24px]">
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-br-[24px] rounded-tr-[24px] size-full" src={imgRectangle34} />
              <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-br-[24px] rounded-tr-[24px] to-[rgba(0,0,0,0.8)]" />
            </div>
          </div>
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex h-[474px] items-start relative shrink-0 w-full">
      <TestimonialImage2 />
      <TestimonialImage3 />
    </div>
  );
}

function LeftRow1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline1 />
      <Frame35 />
    </div>
  );
}

function SectionWasIstXrisk1() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[40px] items-start ml-0 mt-0 overflow-clip px-[188px] py-[80px] relative w-[1440px]" data-name="Section Was ist xrisk">
      <LeftRow1 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
      <SectionWasIstXrisk1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#fdfcfc] text-[40px] w-full">Das Problem mit klassischen Versicherungen</p>
    </div>
  );
}

function SectionHeadline2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container2 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">Teuer. Unpersönlich. Standardlösungen, die oft nicht passen. Versicherungen funktionieren für die Masse – aber nicht für deinen speziellen Fall.</p>
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

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#fdfcfc] text-[24px] w-full">xrisk macht es anders</p>
    </div>
  );
}

function SectionHeadline3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container3 />
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

function LeftRow3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#fdfcfc] text-[24px] w-full">Die Lösung</p>
    </div>
  );
}

function SectionHeadline4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section headline">
      <Container4 />
      <div className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-[16px]">Absicherung, die zu dir passt. Von Menschen, die wissen, wovon sie reden. Faire Preise, weil keine riesigen Verwaltungskosten.</p>
        <p>Keine Standardverträge. Keine versteckten Klauseln. Nur Menschen, die zusammenfinden, weil beide davon profitieren.</p>
      </div>
    </div>
  );
}

function LeftRow4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0" data-name="Left Row">
      <SectionHeadline4 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="basis-0 content-stretch flex gap-[40px] grow items-start min-h-px min-w-px relative shrink-0">
      <LeftRow3 />
      <LeftRow4 />
    </div>
  );
}

function SectionWasIstXrisk2() {
  return (
    <div className="bg-[#ff671f] relative shrink-0 w-full" data-name="Section Was ist xrisk">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[40px] items-start px-[188px] py-[80px] relative w-full">
          <LeftRow2 />
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#353131] text-[40px] w-full">Von der Sorge zur Sicherheit in 3 Schritten</p>
    </div>
  );
}

function SectionHeadline5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section Headline">
      <Container5 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] w-full">Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig</p>
    </div>
  );
}

function MessageCircle() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="message-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="message-circle">
          <path d={svgPaths.p1edfde00} id="Vector" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ChatIcon() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 size-[31px]" data-name="Chat Icon">
      <MessageCircle />
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start leading-[1.3] min-h-px min-w-px relative shrink-0 text-[#353131]" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[24px] w-full">
        <span className="text-[#ff671f]">Schritt 1:</span>
        <span>{` Sag uns, was du absichern möchtest`}</span>
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`"Ich habe eine alte Leica von meinem Opa. Ich will damit 3 Monate durch Europa reisen."`}</p>
    </div>
  );
}

function Step() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Step">
      <ChatIcon />
      <Container6 />
    </div>
  );
}

function Users() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="users">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="users">
          <path d={svgPaths.p33705900} id="Vector" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p161d4800} id="Vector_2" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2b304d00} id="Vector_3" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13e20900} id="Vector_4" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ChatIcon1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 size-[31px]" data-name="Chat Icon">
      <Users />
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start leading-[1.3] min-h-px min-w-px relative shrink-0 text-[#353131]" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[24px] w-full">
        <span className="text-[#ff671f]">{`Schritt 2: `}</span>Experten machen dir ein Angebot
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Thomas sieht deine Anfrage: "Leica M6? Kenn ich gut. Für eine angemessene Prämie bin ich dein Experte falls was passiert."`}</p>
    </div>
  );
}

function Step1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Step">
      <ChatIcon1 />
      <Container7 />
    </div>
  );
}

function FileText() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="file-text">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="file-text">
          <path d={svgPaths.p2501aa80} id="Vector" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M14 2V8H20" id="Vector_2" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 13H8" id="Vector_3" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 17H8" id="Vector_4" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 9H9H8" id="Vector_5" stroke="var(--stroke-0, #FF671F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ChatIcon2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 size-[31px]" data-name="Chat Icon">
      <FileText />
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start leading-[1.3] min-h-px min-w-px relative shrink-0 text-[#353131]" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[24px] w-full">
        <span className="text-[#ff671f]">Schritt 3:</span>
        <span>{` Du wählst und bist abgesichert`}</span>
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Du nimmst Thomas' Angebot an. Ab sofort weißt du: Falls was passiert, ist Thomas für dich da.`}</p>
    </div>
  );
}

function Step2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Step">
      <ChatIcon2 />
      <Container8 />
    </div>
  );
}

function StepContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Step Container">
      <Step />
      <Step1 />
      <Step2 />
    </div>
  );
}

function StepsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Steps Container">
      <StepContainer />
    </div>
  );
}

function TextContentContainer() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px px-0 py-[24px] relative shrink-0" data-name="Text Content Container">
      <SectionHeadline5 />
      <StepsContainer />
    </div>
  );
}

function HeroImage1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[24px] self-stretch shrink-0" data-name="Hero Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[24px] size-full" src={imgRectangle33} />
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-name="Content Container">
      <TextContentContainer />
      <HeroImage1 />
    </div>
  );
}

function Section3StepAnleitung() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section 3-Step Anleitung">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[80px] items-start px-[190px] py-[80px] relative w-full">
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#353131] text-[40px] w-full">
        <span className="text-[#ff671f]">Deine</span>
        <span>{` Fragen. `}</span>
        <span className="text-[#ff671f]">Unsere</span>
        <span>{` Antworten.`}</span>
      </p>
    </div>
  );
}

function SectionHeadline6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section Headline">
      <Container9 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] w-full">Du hast Fragen? Wir haben Antworten. Hier findest du alles Wichtige zu xrisk.</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[520px]">
      <SectionHeadline6 />
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-up">
          <path d="M18 15L12 9L6 15" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wie funktioniert xrisk?</p>
      <ChevronUp />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame16 />
      <div className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-[16px]">{`Ein Marktplatz für Risiken – offen, transparent und menschlich. xrisk bringt Menschen mit unterschiedlichen Risikohaltungen zusammen: `}</p>
        <p>Optimisten, die Chancen erkennen, Pessimisten, die Sicherheit suchen, Spielerische, die den Nervenkitzel mögen. Jede Risikoübernahme funktioniert wie eine Wette auf Wahrscheinlichkeiten – aber mit echtem Nutzen: Du eliminierst Risiko statt zu spekulieren. So entsteht ein neuer Markt für kleine und große Risiken.</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[8px] relative shrink-0 w-[504px]">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
      <Frame14 />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down">
          <path d="M6 9L12 15L18 9" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ChevronDown />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Was kostet mich xrisk?</p>
      <Frame4 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame21 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[8px] relative shrink-0 w-[504px]">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
      <Frame22 />
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down">
          <path d="M6 9L12 15L18 9" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ChevronDown1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wie bewertet xrisk mein Risiko?</p>
      <Frame5 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame24 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[8px] relative shrink-0 w-[504px]">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
      <Frame25 />
    </div>
  );
}

function ChevronDown2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down">
          <path d="M6 9L12 15L18 9" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ChevronDown2 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wer ist mein Risikopartner?</p>
      <Frame6 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame26 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[8px] relative shrink-0 w-[504px]">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
      <Frame27 />
    </div>
  );
}

function ChevronDown3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down">
          <path d="M6 9L12 15L18 9" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ChevronDown3 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Was passiert im Schadensfall?</p>
      <Frame7 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame28 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[8px] relative shrink-0 w-[504px]">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
      <Frame29 />
    </div>
  );
}

function ChevronDown4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down">
          <path d="M6 9L12 15L18 9" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ChevronDown4 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wie sicher ist xrisk?</p>
      <Frame8 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame30 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-0 py-[8px] relative shrink-0 w-[504px]">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
            <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
          </svg>
        </div>
      </div>
      <Frame31 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative self-stretch shrink-0">
      <Frame15 />
      <Frame23 />
      <Frame17 />
      <Frame20 />
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
      <Frame12 />
      <Frame10 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[80px] items-start overflow-clip px-[188px] py-[80px] relative shrink-0 w-[1440px]">
      <Frame11 />
    </div>
  );
}

export default function LpRisikogeberArt() {
  return (
    <div className="bg-[#fdfcfc] content-stretch flex flex-col items-start relative size-full" data-name="LP / Risikogeber (Art)">
      <HeroSectionTeaser />
      <SectionWasIstXrisk />
      <Group />
      <SectionWasIstXrisk2 />
      <Section3StepAnleitung />
      <Frame13 />
    </div>
  );
}