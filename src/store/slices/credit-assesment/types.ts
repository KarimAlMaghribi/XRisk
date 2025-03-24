import {CreditAssesment} from "../../../models/CreditAssesment";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_ASSESMENTS = "myAssesments/fetchAssesments",
    ADD_MY_ASSESMENTS = "myAssesments/addAssesments",
    UPDATE_MY_ASSESMENTS = "myASsesments/updateAssesments",
    SUBSCRIBE_TO_ASSESMENTS = "myAssesments/subscribeToAssesments",
}

export interface MyCreditAssesmentState {
    creditAssesments: CreditAssesment[];
    error?: string;
    status: FetchStatus;
}