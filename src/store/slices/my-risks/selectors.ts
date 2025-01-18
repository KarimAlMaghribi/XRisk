import {MyRisksState} from "./types";

export const selectMyRisks = (state: { myRisks: MyRisksState }) => state.myRisks.risks;
