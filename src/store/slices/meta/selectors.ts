import {RootState} from "../../store";

export const selectUserCount = (state: RootState) => state.meta.userCount;
