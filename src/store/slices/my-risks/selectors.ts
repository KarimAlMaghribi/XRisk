import {MyRisksState} from "./types";

export const selectMyOfferedRisks = (state: { myRisks: MyRisksState }) => state.myRisks.offeredRisks;
export const selectMyFilteredOfferedRisks = (state: { myRisks: MyRisksState }) => state.myRisks.filteredOfferedRisks;
export const selectMyTakenRisks = (state: { myRisks: MyRisksState }) => state.myRisks.takenRisks;
export const selectMyFilteredTakenRisks = (state: { myRisks: MyRisksState }) => state.myRisks.filteredTakenRisks;
