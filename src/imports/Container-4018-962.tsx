import { placeholderImage as imgImage } from "../assests/imgs/placeholder";
import { placeholderImage as imgImageMarkt } from "../assests/imgs/placeholder";
import { placeholderImage as imgImageBus } from "../assests/imgs/placeholder";

function Image() {
  return (
    <div className="absolute h-[720px] left-0 rounded-bl-[24px] rounded-br-[24px] top-0 w-[1240px]" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-bl-[24px] rounded-br-[24px] size-full" src={imgImage} />
    </div>
  );
}

function Container() {
  return <div className="absolute bg-[rgba(0,0,0,0.2)] h-[720px] left-0 rounded-bl-[24px] rounded-br-[24px] top-0 w-[1240px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="h-[720px] relative rounded-bl-[24px] rounded-br-[24px] shrink-0 w-full" data-name="Container">
      <Image />
      <Container />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[720px] items-start left-0 rounded-bl-[24px] rounded-br-[24px] top-0 w-[1240px]" data-name="Container">
      <Container1 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[63px] items-start left-0 top-[2px] w-[449.023px]" data-name="Text">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[67.6px] not-italic relative shrink-0 text-[#e6e5e5] text-[52px] text-nowrap whitespace-pre">Wenn das Wetter</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[63px] items-start left-0 top-[69.59px] w-[429.523px]" data-name="Text">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[67.6px] not-italic relative shrink-0 text-[#ff671f] text-[52px] text-nowrap whitespace-pre">deinen Markttag</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[63px] items-start left-0 top-[137.19px] w-[267.094px]" data-name="Text">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[67.6px] not-italic relative shrink-0 text-[#e6e5e5] text-[52px] text-nowrap whitespace-pre">verhagelt.</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[202.781px] left-0 top-0 w-[630px]" data-name="Paragraph">
      <Text />
      <Text1 />
      <Text2 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[54px] left-0 top-[212.78px] w-[630px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#e6e5e5] text-[18px] top-[0.5px] w-[542px]">Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[266.781px] left-[108px] top-[218.61px] w-[630px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

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

function Container4() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[940px] top-[672px]" data-name="Container">
      <ImageMarkt />
      <ImageBus />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[720px] left-[80px] rounded-[24px] top-0 w-[1240px]" data-name="Container">
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

export default function Container6() {
  return (
    <div className="relative size-full" data-name="Container">
      <Container5 />
    </div>
  );
}