import { getRiskLevel } from "./types/risk";

interface RiskRatingBarsProps {
  riskScore: number;
}

export function RiskRatingBars({ riskScore }: RiskRatingBarsProps) {
  const level = getRiskLevel(riskScore);
  
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div 
          key={bar}
          className={`basis-0 grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0 ${
            bar <= level ? 'bg-[#ff671f]' : 'bg-[#d9d9d9]'
          }`} 
        />
      ))}
    </div>
  );
}
