import {Risk} from "../../../models/Risk";
import {RiskOverviewFilterType} from "../../../models/RiskOverviewFilterType";
import {RiskOverviewSort} from "../../../models/RiskOverviewSort";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_RISKS = "risks/fetchRisks",
    FETCH_MY_TAKEN_RISKS = "risks/fetchMyTakenRisks",
    ADD_RISK = "risks/addRisk",
    UPDATE_RISK = "risks/updateRisk",
    DELETE_RISK = "risk/deleteRisk",
    FETCH_RISK_TYPES = "risks/fetchRiskTypes",
    ADD_RISK_TYPE = "risks/addRiskType",
    UPDATE_PROVIDER_IMAGE_ON_ALL_MY_RISKS = "risks/updateProviderDetails",
    UPDATE_RISK_STATUS = "risks/updateRiskStatus",
    DELETE_RISKS_BY_UID = "risks/deleteRisksByUid",
    FETCH_AGREED_RISKS = "risks/fetchAgreedRisks",
}

export interface RiskStats {
    amountCovered: number;
    successfulRiskTransfers: number;
}

export interface RiskOverviewState {
    risks: Risk[];
    filteredRisks: Risk[];
    types: string[];
    filters: RiskOverviewFilterType;
    sorts: RiskOverviewSort[];
    riskStats: RiskStats;
    status: FetchStatus;
    error?: string;
}
