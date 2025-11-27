import { placeholderImage as imgImageMarkt } from "../assests/imgs/placeholder";
import { placeholderImage as imgImageBus } from "../assests/imgs/placeholder";
import { placeholderImage as imgImage } from "../assests/imgs/placeholder";

function ImageMarkt() {
  return (
    <div className="h-[90px] relative rounded-[16px] shrink-0 w-[160px]" data-name="Image (Markt)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImageMarkt} />
    </div>
  );
}

function ImageBus() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[90px]" data-name="Image (Bus)">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={imgImageBus} />
        <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[16px]" />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[30px] top-[620px] z-[5]" data-name="Container">
      <ImageMarkt />
      <ImageBus />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start not-italic relative shrink-0 text-[#e6e5e5] w-full">
      <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 text-[0px] text-[32px] w-full">
        <span>{`Wenn das Wetter `}</span>
        <span className="text-[#ff671f]">{`deinen Markttag `}</span>verhagelt.
      </p>
      <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full">Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative shrink-0 w-full z-[3]">
      <Frame1 />
    </div>
  );
}

function HeroImage() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[24px] shrink-0 w-full" data-name="Hero Image">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] isolate items-center justify-end pb-[70px] pt-[24px] px-[24px] relative size-full">
          <Container />
          <Frame />
          <div className="absolute inset-0 rounded-bl-[24px] rounded-br-[24px] z-[1]" data-name="Image">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-br-[24px]">
              <div className="absolute inset-0 overflow-hidden rounded-bl-[24px] rounded-br-[24px]">
                <img alt="" className="absolute h-full left-[-200.65%] max-w-none top-0 w-[370.8%]" src={imgImage} />
              </div>
              <div className="absolute bg-gradient-to-b from-[24.519%] from-[rgba(0,0,0,0)] inset-0 rounded-bl-[24px] rounded-br-[24px] to-[64.423%] to-[rgba(0,0,0,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSectionTeaser() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative size-full" data-name="Hero Section - Teaser">
      <HeroImage />
    </div>
  );
}