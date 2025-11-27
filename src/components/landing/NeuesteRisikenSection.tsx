import { RiskCard } from "../RiskCard";
import { getAllRisks } from "../../lib/database";

interface NeuesteRisikenSectionProps {
  variant: "market" | "bus";
}

export function NeuesteRisikenSection({ variant }: NeuesteRisikenSectionProps) {
  // Get active risks from database and take first 4
  const allRisks = getAllRisks();
  const activeRisks = allRisks
    .filter((risk) => risk.status === "active" || risk.status === "pending")
    .slice(0, 4);

  return (
    <div className="w-full">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-12">
            <div className="content-stretch flex flex-col gap-[16px] md:gap-[40px] items-center justify-center p-[0px]">
              {/* Section Headline */}
              <h2 className="display-large text-[#353131] w-full">
                Neueste Risiken
              </h2>

              {/* Risk Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
                {activeRisks.map((risk) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    variant="marketplace"
                    hideActions={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}