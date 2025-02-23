import {RootState} from "../../store";

export const selectUserCount = (state: RootState) => state.meta.userCount;
export const selectHighestRiskValue = (state: RootState) => state.meta.highestRiskValue;
