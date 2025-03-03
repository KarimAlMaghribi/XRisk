import {Risk} from "../../../models/Risk";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_RISKS = "myRisks/fetchMyRisks",
    ADD_MY_RISK = "myRisks/addRisk",
    DELETE_MY_RISK = "myRisks/deleteRisk",
    UPDATE_MY_RISK = "myRisks/updateRisk",
    UPDATE_MY_RISK_STATUS = "myRisks/updateRiskStatus",
}

export interface MyRisksState {
    offeredRisks: Risk[];
    filteredOfferedRisks: Risk[];
    takenRisks: Risk[];
    filteredTakenRisks: Risk[];
    error?: string;
    status: FetchStatus;
}
