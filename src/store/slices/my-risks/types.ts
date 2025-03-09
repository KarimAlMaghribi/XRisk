import {Risk} from "../../../models/Risk";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_RISKS = "myRisks/fetchMyRisks",
    ADD_MY_RISK = "myRisks/addMyRisk",
    DELETE_MY_RISK = "myRisks/deleteMyRisk",
    UPDATE_MY_RISK = "myRisks/updateMyRisk",
    UPDATE_MY_RISK_STATUS = "myRisks/updateMyRiskStatus",
}

export interface MyRisksState {
    offeredRisks: Risk[];
    filteredOfferedRisks: Risk[];
    takenRisks: Risk[];
    filteredTakenRisks: Risk[];
    error?: string;
    status: FetchStatus;
}
