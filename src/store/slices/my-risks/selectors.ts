import {MyRisksState} from "./types";

export const selectMyOfferedRisks = (state: { myRisks: MyRisksState }) => state.myRisks.offeredRisks;
export const selectMyTakenRisks = (state: { myRisks: MyRisksState }) => state.myRisks.takenRisks;
