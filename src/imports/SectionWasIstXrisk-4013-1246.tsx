import { placeholderImage as imgImage } from "../assests/imgs/placeholder";
import { placeholderImage as imgImage1 } from "../assests/imgs/placeholder";
import { placeholderImage as imgLena } from "../assests/imgs/placeholder";
import { placeholderImage as imgMartin } from "../assests/imgs/placeholder";

interface SectionWasIstXriskProps {
  variant?: "market" | "bus";
  onVariantChange?: (variant: "market" | "bus") => void;
}

function SectionHeadline({ variant = "bus" }: SectionWasIstXriskProps) {
  const subtitle = variant === "market" 
    ? "Wenn Künstler auf Wetterexperten treffen, entstehen faire Absicherungen – direkt, ohne Umwege."
    : "Wenn T3-Besitzer auf Mechaniker-Experten treffen, entstehen faire Absicherungen – direkt, ohne Umwege.";
    
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] text-[18px] md:text-[18px]">
          <span>Was ist </span>
          <span className="text-[#ff671f]">x</span>risk?
        </p>
        <p className="display-large text-[#353131]">
          <span className="text-[#ff671f]">Zwei Menschen.</span>
          <span> <br />Ein Risiko. </span>
          <span className="text-[#ff671f]">Eine Lösung.</span>
        </p>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] text-[#353131] text-[18px]">{subtitle}</p>
    </div>
  );
}

function TestimonialCard({ 
  variant = "bus", 
  type 
}: SectionWasIstXriskProps & { type: "giver" | "taker" }) {
  const isGiver = type === "giver";
  
  const image = variant === "market" 
    ? (isGiver ? imgLena : imgMartin)
    : (isGiver ? imgImage : imgImage1);
    
  const name = variant === "market" 
    ? (isGiver ? "Lena, Künstlerin" : "Martin, Landwirt")
    : (isGiver ? "Marco, T3-Besitzer" : "Stefan, T3-Fan");
    
  const quote = variant === "market"
    ? (isGiver 
        ? `"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall."`
        : `"Als Landwirt kenne ich Wetter. Ich weiß, wie man damit umgeht. Für eine angemessene Prämie übernehme ich dieses Risiko."`)
    : (isGiver
        ? `"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird's teuer und stressig."`
        : `"Ich kenne diese Busse in- und auswendig. Ich weiß, was sie können. Und ich weiß, worauf man achten muss."`);
        
  const description = variant === "market"
    ? (isGiver
        ? "Lena verkauft ihre Kunstwerke auf Wochenmärkten. Ihr Einkommen hängt vom Wetter ab. Wenn es regnet, bleiben die Besucher weg – und damit ihre Einnahmen. Eine klassische Versicherung? Gibt's dafür nicht. Sie braucht eine andere Lösung."
        : `Martin bewirtschaftet seit 20 Jahren Felder. Wetter ist sein tägliches Geschäft. Er sieht Lenas Anfrage und versteht das Risiko. Er denkt: \"Das kann ich gut einschätzen.\"`)
    : (isGiver
        ? "Marco hat einen T3 Baujahr 1987. Sein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt, die Strecke anspruchsvoll. Eine klassische Versicherung? Deckt sowas nicht ab. Er braucht eine andere Lösung."
        : `Stefan schraubt seit 15 Jahren an T3-Bussen rum. Er hat selbst drei Alpentouren hinter sich. Er sieht sich Marcos Bus an – Wartungszustand, Motor, Reifen – und denkt: \"Der schafft das.\"`);

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full">
      {/* Blurred Background Layer - nur Desktop */}
      <div className="hidden md:block absolute inset-[-120px] overflow-visible pointer-events-none">
        <img 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-30" 
          src={image} 
        />
      </div>
      
      {/* Main Card with clipping */}
      <div className="relative w-full h-full rounded-[24px] overflow-hidden transition-all duration-500">
        {/* Background Image */}
        <img 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover" 
          src={image} 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[23.077%] to-[rgba(0,0,0,0.8)]" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-[24px] gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Roboto:Regular',sans-serif] font-normal text-[#ededed] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              {name}
            </p>
            <p className="font-['Inter:Black',sans-serif] font-black text-[#e6e5e5] text-[18px] leading-[1.3]">
              {quote}
            </p>
          </div>
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] text-[#e6e5e5] text-[16px] transition-all duration-500" style={{ fontVariationSettings: "'wdth' 100" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SectionWasIstXrisk({ variant = "bus", onVariantChange }: SectionWasIstXriskProps) {
  return (
    <div className="w-full relative">
      <div className="container-grid">
        <div className="grid-12 p-[0px] relative">
          
          {/* MOBILE LAYOUT - Stack vertically, full width */}
          <div className="md:hidden col-span-12 flex flex-col gap-[16px]">
            <SectionHeadline variant={variant} />
            <TestimonialCard variant={variant} type="giver" />
            <TestimonialCard variant={variant} type="taker" />
          </div>
          
          {/* DESKTOP LAYOUT - Side by side, 800px height */}
          <div className="hidden md:contents">
            {/* Headline - 6 columns on desktop */}
            <div className="col-span-6">
              <SectionHeadline variant={variant} />
            </div>
            
            {/* Spacer for layout */}
            <div className="col-span-6"></div>
            
            {/* Left Column - Giver Card */}
            <div className="col-span-6">
              <div className="h-[600px] flex items-center">
                <TestimonialCard variant={variant} type="giver" />
              </div>
            </div>
            
            {/* Right Column - Taker Card */}
            <div className="col-span-6">
              <div className="h-[600px] flex items-center">
                <TestimonialCard variant={variant} type="taker" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}