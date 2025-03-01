import {MyRisksState} from "./types";
import {Risk} from "../../../models/Risk";

export const selectMyOfferedRisks = (state: { myRisks: MyRisksState }) => state.myRisks.offeredRisks;
export const selectMyFilteredOfferedRisks = (state: { myRisks: MyRisksState }) => state.myRisks.filteredOfferedRisks;
export const selectMyTakenRisks = (state: { myRisks: MyRisksState }) => state.myRisks.takenRisks;
export const selectMyFilteredTakenRisks = (state: { myRisks: MyRisksState }) => state.myRisks.filteredTakenRisks;

export const selectMyRiskById = (
    state: { myRisks: MyRisksState },
    riskId: string
): Risk | undefined => {
    return (
        state.myRisks.offeredRisks.find((risk) => risk.id === riskId) ||
        state.myRisks.takenRisks.find((risk) => risk.id === riskId)
    );
};
