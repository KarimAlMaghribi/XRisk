import {FetchStatus} from "../../../types/FetchStatus";

export interface MetaState {
    userCount: number | null;
    riskCount: number | null;
    totalRiskInvestmentValue: number | null;
    risksTaken: number | null;
    highestRiskValue: number | null;
    status: FetchStatus;
    error?: string;
}

