import {RiskOverviewState} from "./types";

export const selectRisks = (state: { risks: RiskOverviewState }) => state.risks.risks;
export const selectFilteredRisks = (state: { risks: RiskOverviewState }) => state.risks.filteredRisks;
export const selectStatus = (state: { risks: RiskOverviewState }) => state.risks.status;
export const selectSorts = (state: { risks: RiskOverviewState }) => state.risks.sorts;
export const selectFilterTypes = (state: { risks: RiskOverviewState }) => state.risks.filters.types;
export const selectFilterValue = (state: { risks: RiskOverviewState }) => state.risks.filters.value;
export const selectRemainingTerm = (state: { risks: RiskOverviewState }) => state.risks.filters.remainingTerm;
export const selectShowTaken = (state: { risks: RiskOverviewState }) => state.risks.filters.showTaken;
export const selectTypes = (state: { risks: RiskOverviewState }) => state.risks.types;
export const selectRiskStats = (state: { risks: RiskOverviewState }) => state.risks.riskStats;

export const selectRiskById = (state: { risks: RiskOverviewState }, id: string | undefined) => state.risks.risks.find((risk) => risk.id === id);
export const selectStatusById = (state: { risks: RiskOverviewState }, id: string | undefined) => state.risks.risks.find((risk) => risk.id === id)?.status;
