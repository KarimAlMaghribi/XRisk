import {RiskAgreement} from "../../../models/RiskAgreement";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_RISK_AGREEMENTS = "myRiskAgreements/fetchMyRiskAgreements",
    ADD_MY_RISK_AGREEMENTS = "myRiskAgreements/addRiskAgreements",
    DELETE_MY_RISK_AGREEMENTS = "myRiskAgreements/deleteRiskAgreements",
    UPDATE_MY_RISK_AGREEMENTS = "myRiskAgreements/updateRiskAgreements"
}

export interface MyRiskAgreementsState {
    riskAgreements: RiskAgreement[];
    activeRiskAgreement: RiskAgreement | null;
    error?: string;
    status: FetchStatus;
}
