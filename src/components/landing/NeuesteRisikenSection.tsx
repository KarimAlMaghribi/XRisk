import React from "react";

interface NeuesteRisikenSectionProps {
  variant: "market" | "bus";
}

const demoRisks = [
  { title: "Marktstand Regen", premium: "12 €", coverage: "bis 1.000 €" },
  { title: "Roadtrip Panne", premium: "18 €", coverage: "bis 2.500 €" },
  { title: "Equipment-Ausfall", premium: "9 €", coverage: "bis 800 €" },
  { title: "Transport Delay", premium: "14 €", coverage: "bis 1.500 €" },
];

export function NeuesteRisikenSection({ variant }: NeuesteRisikenSectionProps) {
  return (
    <div className="w-full">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-12">
            <div className="content-stretch flex flex-col gap-[16px] md:gap-[40px] items-center justify-center p-[0px]">
              <h2 className="display-large text-[#353131] w-full">Neueste Risiken ({variant})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
                {demoRisks.map((risk) => (
                  <div key={risk.title} className="border border-[#e6e5e5] rounded-[16px] p-4 bg-white shadow-sm">
                    <p className="font-semibold text-primary mb-2">{risk.title}</p>
                    <p className="text-sm text-secondary">Prämie: {risk.premium}</p>
                    <p className="text-sm text-secondary">Deckung: {risk.coverage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
