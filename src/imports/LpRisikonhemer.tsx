import svgPaths from "./svg-5s5xd3vqjb";
import { placeholderImage as imgHeroImage } from "../assests/imgs/placeholder";
import { placeholderImage as imgHeroImage1 } from "../assests/imgs/placeholder";
import { placeholderImage as imgHeroImage2 } from "../assests/imgs/placeholder";
import { placeholderImage as img } from "../assests/imgs/placeholder";

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center not-italic relative shrink-0 text-white w-[630px]">
      <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 text-[0px] text-[52px] w-[521px]">
        <span>{`Deine `}</span>
        <span className="not-italic text-[#ff671f]">{`Werkstatt `}</span>kann mehr als nur reparieren.
      </p>
      <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] min-w-full relative shrink-0 text-[18px] w-[min-content]">Mit xrisk wirst du Risikopartner – und verdienst präventiv. Kassiere eine Prämie für jedes Risiko, das du übernimmst. Passiert nichts, behältst du sie. Passiert doch etwas, bist du bereits der Partner und übernimmst die Lösung.</p>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-[640px] items-start justify-center pl-[108px] pr-[217px] py-0 relative rounded-[24px] shrink-0 w-[1280px]" data-name="Hero Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[24px] size-full" src={imgHeroImage} />
      <div className="absolute bg-gradient-to-t bottom-0 from-[#353131] left-0 right-0 rounded-bl-[24px] rounded-br-[24px] to-[rgba(29,27,27,0)] top-[350px]" />
      <Frame26 />
      <div className="absolute inset-0 pointer-events-none shadow-[10px_14px_24px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="h-[800px] relative shrink-0 w-full" data-name="Hero Section">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[800px] items-start pb-[80px] pt-[85px] px-[80px] relative w-full">
          <HeroImage />
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start justify-center leading-[1.3] min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0 text-[#353131]">
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[40px] w-full">Faire Prämien durch intelligente Bewertung</p>
      <p className="font-['Roboto:Medium',sans-serif] font-medium relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Unsere KI analysiert dein individuelles Risiko und berechnet eine faire Prämie – objektiv und transparent. Dabei fließen drei Faktoren ein: die Absicherungssumme, das ermittelte Risiko basierend auf Gegenstand, Zeitraum und Kontext sowie der potenzielle Aufwand im Risikofall. So zahlst du nie zu viel und dein Risikopartner bekommt eine angemessene Vergütung.
      </p>
    </div>
  );
}

function Cell1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center pl-[16px] pr-[8px] py-[4px] relative rounded-[20px] shrink-0 w-[100px]" data-name="Cell">
      <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[1.3] min-h-px min-w-px relative shrink-0 text-[#353131] text-[14px] text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
        Prämie
      </p>
    </div>
  );
}

function Cell2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[8px] py-0 relative shrink-0 w-[48px]" data-name="Cell">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#353131] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risiko
      </p>
    </div>
  );
}

function Cell3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Cell">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[8px] py-0 relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#353131] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            Kurzbeschreibung
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[287px]">
      <Cell1 />
      <Cell2 />
      <Cell3 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="box-border content-stretch flex items-center px-0 py-[4px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#969696] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame35 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame34 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Frame39 />
    </div>
  );
}

function Chip() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0" data-name="Chip">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        100 €
      </p>
    </div>
  );
}

function Cell5() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-end justify-center px-[8px] py-0 relative shrink-0 w-[100px]" data-name="Cell">
      <Chip />
    </div>
  );
}

function Cell6() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[8px] py-[4px] relative rounded-[20px] shrink-0 w-[48px]" data-name="Cell">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        10 %
      </p>
    </div>
  );
}

function Cell7() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start justify-center px-[8px] py-0 relative shrink-0 w-[130px]" data-name="Cell">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Absicherung von Auszugskosten
      </p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
      <Cell5 />
      <Cell6 />
      <div className="flex flex-row items-center self-stretch">
        <Cell7 />
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[16px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d7d7d7] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame42 />
    </div>
  );
}

function Chip1() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0" data-name="Chip">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50 €
      </p>
    </div>
  );
}

function Cell9() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-end justify-center px-[8px] py-0 relative shrink-0 w-[100px]" data-name="Cell">
      <Chip1 />
    </div>
  );
}

function Cell10() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[8px] py-[4px] relative rounded-[20px] shrink-0 w-[48px]" data-name="Cell">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        5 %
      </p>
    </div>
  );
}

function Cell11() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start justify-center px-[8px] py-0 relative shrink-0 w-[130px]" data-name="Cell">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Absicherung einer Drone
      </p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
      <Cell9 />
      <Cell10 />
      <div className="flex flex-row items-center self-stretch">
        <Cell11 />
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[16px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d7d7d7] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame46 />
    </div>
  );
}

function Chip2() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0" data-name="Chip">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        80 €
      </p>
    </div>
  );
}

function Cell13() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-end justify-center px-[8px] py-0 relative shrink-0 w-[100px]" data-name="Cell">
      <Chip2 />
    </div>
  );
}

function Cell14() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[8px] py-[4px] relative rounded-[20px] shrink-0 w-[48px]" data-name="Cell">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        10 %
      </p>
    </div>
  );
}

function Cell15() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start justify-center px-[8px] py-0 relative shrink-0 w-[130px]" data-name="Cell">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Absicherung einer Espressomaschiene
      </p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
      <Cell13 />
      <Cell14 />
      <div className="flex flex-row items-center self-stretch">
        <Cell15 />
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[16px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d7d7d7] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame48 />
    </div>
  );
}

function Chip3() {
  return (
    <div className="bg-[#ff671f] box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0" data-name="Chip">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        75 €
      </p>
    </div>
  );
}

function Cell17() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-end justify-center px-[8px] py-0 relative shrink-0 w-[100px]" data-name="Cell">
      <Chip3 />
    </div>
  );
}

function Cell18() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-end px-[8px] py-[4px] relative rounded-[20px] shrink-0 w-[48px]" data-name="Cell">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        12 %
      </p>
    </div>
  );
}

function Cell19() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start justify-center px-[8px] py-0 relative shrink-0 w-[130px]" data-name="Cell">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.3] relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Absicherung eines Fahrrads
      </p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
      <Cell17 />
      <Cell18 />
      <div className="flex flex-row items-center self-stretch">
        <Cell19 />
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[16px] relative shrink-0 w-full">
      <Frame49 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame45 />
      <Frame47 />
      <Frame36 />
      <Frame38 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame51 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[24px] shrink-0 w-full">
      <Frame44 />
      <Frame50 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shadow-[20px_24px_44px_0px_rgba(0,0,0,0.25)] shrink-0">
      <Frame40 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[40px] items-start px-[188px] py-[80px] relative w-full">
          <Frame32 />
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function HeroImage1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-[600px] items-start justify-end p-[24px] relative rounded-[24px] shrink-0 w-[512px]" data-name="Hero Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[24px] size-full" src={imgHeroImage1} />
      <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(29,27,27,0)] left-0 right-0 rounded-bl-[24px] rounded-br-[24px] to-[#353131] top-[414px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#ededed] text-[16px] text-nowrap whitespace-pre">Anabell, 25 - Risikogeber</p>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[#e6e5e5] text-[32px] w-[min-content]">“Ich verleihe meine Siebträger-Espressomaschine und habe Angst, das sie kaputt gehen könnte.”</p>
    </div>
  );
}

function Frame53() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px relative rounded-bl-[24px] rounded-br-[24px] shrink-0">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Warum xrisk anders ist
      </p>
      <div className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[#353131] text-[40px] w-[min-content]">
        <p className="mb-0">Wir verbinden Risiken mit der richtigen Expertise.</p>
        <p>&nbsp;</p>
      </div>
      <HeroImage1 />
    </div>
  );
}

function HeroImage2() {
  return (
    <div className="basis-0 grow h-[600px] min-h-px min-w-px relative rounded-[24px] shrink-0" data-name="Hero Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[24px] size-full" src={imgHeroImage2} />
      <div className="flex flex-col justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[600px] items-start justify-end pl-[23px] pr-[24px] py-[24px] relative w-full">
          <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(29,27,27,0)] left-0 right-0 rounded-bl-[24px] rounded-br-[24px] to-[#353131] top-[414px]" />
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.3] not-italic relative shrink-0 text-[#ededed] text-[16px] text-nowrap whitespace-pre">Peter, 30 - Risikonehmer</p>
          <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[#ededed] text-[32px] w-[min-content]">“Ich habe mich auf die Reperatur von Espressomaschienen Spezialisiert”</p>
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[40px] items-start px-[188px] py-[80px] relative w-full">
          <Frame53 />
          <HeroImage2 />
        </div>
      </div>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Keine komplizierten Onboarding-Prozesse. Registriere dich, lege fest welche Risiken du managen kannst, und starte mit deinem ersten Match.
      </p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#353131] text-[40px] w-full">In 3 Schritten zum Risikopartner</p>
      <Frame54 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-[737px]">
      <Frame55 />
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

function Frame57() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Registriere dich und beschreibe deine Expertise. Welche Risiken kannst du einschätzen und im Ernstfall lösen? Fahrzeuge, Elektronik, Immobilien?
      </p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full">
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Chat">
        <MessageCircle />
      </div>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[#353131] text-[32px] w-[min-content]">Profil anlegen</p>
      <Frame57 />
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

function Frame59() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Unsere KI matcht dich mit passenden Risikoanfragen. Du siehst alle Details, die KI-Bewertung und einen Prämienvorschlag.
      </p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full">
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Partner">
        <Users />
      </div>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[#353131] text-[32px] w-[min-content]">Risiken erhalten</p>
      <Frame59 />
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

function Frame61() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Passt das Risiko zu dir? Dann übernimmst du es mit einem Klick. Der Vertrag kommt direkt zwischen dir und dem Kunden zustande.
      </p>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full">
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Dokument">
        <FileText />
      </div>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[#353131] text-[32px] w-[min-content]">Risiko übernehmen</p>
      <Frame61 />
    </div>
  );
}

function TextContentContainer() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[32px] items-start px-[40px] py-0 relative shrink-0 w-[520px]" data-name="Text Content Container">
      <Frame58 />
      <Frame60 />
      <Frame62 />
    </div>
  );
}

function HeroImage3() {
  return (
    <div className="basis-0 grow h-[700px] min-h-px min-w-px relative rounded-[24px] shrink-0" data-name="Hero Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[24px] size-full" src={imgHeroImage2} />
      <div className="flex flex-col justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[700px] items-start justify-end pl-[23px] pr-[24px] py-[24px] relative w-full">
          <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(29,27,27,0)] left-0 right-0 rounded-bl-[24px] rounded-br-[24px] to-[#353131] top-[414px]" />
        </div>
      </div>
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-[1298px]" data-name="Content Container">
      <TextContentContainer />
      <HeroImage3 />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[80px] items-start px-[188px] py-[80px] relative w-full">
          <Frame56 />
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Du hast Fragen? Wir haben Antworten. Hier findest du alles Wichtige zu xrisk.
      </p>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-[520px]">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#ff671f] text-[40px] w-full">
        Deine<span className="text-[#353131]">{` Fragen.`}</span>
        <span>{` Unsere `}</span>
        <span className="text-[#353131]">Antworten.</span>
      </p>
      <Frame63 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wie funktioniert xrisk?</p>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-up">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(53, 49, 49, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d="M13 7L7 1L1 7" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame43 />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#353131] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Du beschreibst dein Risiko in wenigen Worten. Unsere KI stellt bei Bedarf Fragen, bewertet dein individuelles Risiko und findet den passenden Risikopartner für dich. Du siehst alle Details transparent und entscheidest, ob du den Vertrag abschließt.
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(53, 49, 49, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d="M1 1L7 7L13 1" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Was kostet mich xrisk?</p>
      <Frame6 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame65 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(53, 49, 49, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d="M1 1L7 7L13 1" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wie wird mein Risiko bewertet?</p>
      <Frame7 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame67 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(53, 49, 49, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d="M1 1L7 7L13 1" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Wer ist mein Risikopartner?</p>
      <Frame8 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame69 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(53, 49, 49, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d="M1 1L7 7L13 1" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Was passiert im Schadensfall?</p>
      <Frame9 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame71 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(53, 49, 49, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d="M1 1L7 7L13 1" id="Vector" stroke="var(--stroke-0, #353131)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#353131] text-[18px] text-nowrap whitespace-pre">Bin ich rechtlich abgesichert?</p>
      <Frame10 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame73 />
    </div>
  );
}

function Frame75() {
  return (
    <div className="basis-0 content-stretch cursor-pointer flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative self-stretch shrink-0">
      <button className="box-border content-stretch flex flex-col gap-[16px] items-start overflow-visible px-0 py-[8px] relative shrink-0 w-[504px]">
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
              <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <Frame41 />
      </button>
      <button className="box-border content-stretch flex flex-col gap-[16px] items-start overflow-visible px-0 py-[8px] relative shrink-0 w-[504px]">
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
              <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <Frame66 />
      </button>
      <button className="box-border content-stretch flex flex-col gap-[16px] items-start overflow-visible px-0 py-[8px] relative shrink-0 w-[504px]">
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
              <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <Frame68 />
      </button>
      <button className="box-border content-stretch flex flex-col gap-[16px] items-start overflow-visible px-0 py-[8px] relative shrink-0 w-[504px]">
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
              <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <Frame70 />
      </button>
      <button className="box-border content-stretch flex flex-col gap-[16px] items-start overflow-visible px-0 py-[8px] relative shrink-0 w-[504px]">
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
              <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <Frame72 />
      </button>
      <button className="box-border content-stretch flex flex-col gap-[16px] items-start overflow-visible px-0 py-[8px] relative shrink-0 w-[504px]">
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(206, 202, 202, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 504 2">
              <line id="Line 1" stroke="var(--stroke-0, #CECACA)" strokeWidth="2" x2="504" y1="1" y2="1" />
            </svg>
          </div>
        </div>
        <Frame74 />
      </button>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
      <Frame64 />
      <Frame75 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[80px] items-start px-[188px] py-[80px] relative w-full">
          <Frame76 />
        </div>
      </div>
    </div>
  );
}

function Frame78() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px relative shrink-0 text-[#e6e5e5]">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Warum xrisk anders ist
      </p>
      <div className="font-['Inter:Black',sans-serif] font-black leading-[1.3] min-w-full not-italic relative shrink-0 text-[40px] w-[min-content]">
        <p className="mb-0">
          {`Das ist Versicherung, `}
          <br aria-hidden="true" />
          wie sie sein sollte.
        </p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function Frame79() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <div className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#e6e5e5] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-[16px]">Versicherung war gestern ein notwendiges Übel. Wir haben sie neu erfunden: individuell statt kollektiv, intelligent statt bürokratisch.</p>
        <p className="mb-[16px]">Bei xrisk sichert dich kein anonymer Konzern ab, sondern ein konkreter Experte – eine Werkstatt für dein Auto, ein Handwerker für deine Wohnung. Menschen, die dein Risiko wirklich verstehen.</p>
        <p>Unsere KI bewertet dein individuelles Risiko fair und transparent. Dein Risikopartner verdient, wenn nichts passiert – und löst das Problem sofort, wenn doch etwas passiert.</p>
      </div>
    </div>
  );
}

function Frame80() {
  return (
    <div className="bg-[#ff671f] h-[682px] relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[40px] h-[682px] items-start px-[188px] py-[80px] relative w-full">
          <Frame78 />
          <Frame79 />
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="backdrop-blur-[47px] backdrop-filter basis-0 bg-[rgba(245,245,245,0.5)] grow min-h-px min-w-px relative rounded-[100px] shrink-0" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[#dddddd] border-solid inset-0 pointer-events-none rounded-[100px] shadow-[10px_10px_20px_0px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center justify-center px-[24px] py-[16px] relative w-full">
          <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4f4a4a] text-[16px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[1.3] whitespace-pre">Was kannst du absichern?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Glass() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[1000px] z-[3]" data-name="Glass">
      <div className="absolute inset-0 rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" data-name="Glass" />
    </div>
  );
}

function Frame29() {
  return (
    <div className="box-border content-stretch flex gap-[10px] h-full isolate items-center justify-center opacity-90 px-[24px] py-0 relative rounded-br-[36px] rounded-tr-[36px] shrink-0">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre z-[4]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risiko anfragen
      </p>
      <Glass />
      <div className="absolute bg-[#ff671f] blur-[2px] filter inset-0 rounded-[100px] z-[2]" data-name="Frost" />
      <div className="absolute bg-[#ff671f] inset-0 rounded-[100px] z-[1]" data-name="BG" />
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] h-[48px] ml-0 mt-0 relative w-[55px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img} />
      </div>
    </div>
  );
}

function Risikogeber() {
  return (
    <button className="box-border content-stretch cursor-pointer flex gap-[10px] isolate items-center justify-center opacity-90 overflow-visible px-[24px] py-0 relative rounded-br-[36px] rounded-tr-[36px] shrink-0" data-name="Risikogeber">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre z-[2]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risikogeber
      </p>
    </button>
  );
}

function Glass1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[1000px]" data-name="Glass">
      <div className="absolute inset-0 rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" data-name="Glass" />
    </div>
  );
}

function Aktiv() {
  return (
    <div className="absolute contents inset-0" data-name="Aktiv">
      <Glass1 />
      <div className="absolute bg-[#ff671f] inset-0 opacity-80 rounded-[100px]" data-name="BG" />
    </div>
  );
}

function Risikonehmer() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[16px] relative shrink-0" data-name="Risikonehmer">
      <Aktiv />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Risikonehmer</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0">
      <Group3 />
      <div className="backdrop-blur-[47px] backdrop-filter bg-[rgba(255,255,255,0.5)] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0" data-name="SwitchZielgruppe">
        <Risikogeber />
        <Risikonehmer />
      </div>
    </div>
  );
}

function Frame81() {
  return (
    <div className="backdrop-blur-[47px] backdrop-filter bg-[rgba(245,245,245,0.5)] box-border content-stretch flex gap-[10px] items-center justify-center px-[24px] py-[16px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#353131] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.3] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Anmelden</p>
    </div>
  );
}

function Frame82() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[24px] py-0 relative shrink-0">
      <Frame81 />
    </div>
  );
}

function Frame119() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-[24px] py-0 relative shrink-0 w-[902px]">
      <Frame20 />
      <Frame82 />
    </div>
  );
}

export default function LpRisikonhemer() {
  return (
    <div className="bg-[#fdfcfc] content-stretch flex flex-col items-start relative size-full" data-name="LP / Risikonhemer">
      <div className="absolute bottom-[40px] box-border content-stretch flex gap-[16px] items-center justify-center left-0 px-[217px] py-0 w-[1440px]" data-name="SwitchZielgruppe">
        <Text />
        <div className="flex flex-row items-center self-stretch">
          <Frame29 />
        </div>
      </div>
      <div className="absolute box-border content-stretch flex items-center justify-between left-0 px-[80px] py-[16px] top-0 w-[1440px]" data-name="NavBar">
        <Frame119 />
      </div>
      <HeroSection />
      <Frame52 />
      <Frame37 />
      <MainContainer />
      <Frame77 />
      <Frame80 />
    </div>
  );
}