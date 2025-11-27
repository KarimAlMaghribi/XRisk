import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { RiskCardList } from "../RiskCardList";
import { Risk } from "../../types/risk";

interface MarketplacePreviewSectionProps {
  title: string;
  description: string;
  previewRisks: Risk[];
}

export function MarketplacePreviewSection({
  title,
  description,
  previewRisks,
}: MarketplacePreviewSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <div ref={containerRef} className="w-full section-spacing">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-6 flex flex-col gap-8 justify-center">
            <div className="flex flex-col gap-4 items-start w-full">
              <h2 className="display-large text-primary">{title}</h2>
              <p className="text-lg-medium text-primary">{description}</p>
            </div>
          </div>

          <div className="col-span-6">
            <div className="flex flex-col gap-4 relative">
              {previewRisks.slice(0, 3).map((risk, index) => (
                <motion.div
                  key={risk.id}
                  style={{ 
                    x: index === 0 ? y1 : index === 1 ? y2 : y3,
                  }}
                >
                  <RiskCardList
                    risk={risk}
                    onTakeRisk={() => {}}
                    hideAction={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
