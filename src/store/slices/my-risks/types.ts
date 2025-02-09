import {Risk} from "../../../models/Risk";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_RISKS = "myRisks/fetchMyRisks",
    ADD_MY_RISK = "myRisks/addRisk",
    DELETE_MY_RISK = "myRisks/deleteRisk",
    UPDATE_MY_RISK = "myRisks/updateRisk"
}

export interface MyRisksState {
    offeredRisks: Risk[];
    takenRisks: Risk[];
    error?: string;
    status: FetchStatus;
}
