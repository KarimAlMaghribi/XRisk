import {Risk} from "../../../models/Risk";
import {RiskOverviewFilterType} from "../../../models/RiskOverviewFilterType";
import {RiskOverviewSort} from "../../../models/RiskOverviewSort";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_RISKS = "risks/fetchRisks",
    ADD_RISK = "risks/addRisk",
    DELETE_RISK = "risk/deleteRisk",
    FETCH_RISK_TYPES = "risks/fetchRiskTypes",
    ADD_RISK_TYPE = "risks/addRiskType"
}

export interface RiskOverviewState {
    risks: Risk[];
    filteredRisks: Risk[];
    types: string[];
    filters: RiskOverviewFilterType;
    sorts: RiskOverviewSort[];
    status: FetchStatus;
    error?: string;
}
