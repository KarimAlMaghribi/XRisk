import {MyCreditAssesmentState} from "./types";
import { RootState } from "../../store";
import { createSelector } from "reselect";

// Selectors
export const selectAssesmentById = (state: RootState, uid: string) => {
    return state.assesments.list.find(assesment => assesment.id === uid) || null;
  };
  
  export const selectAssesments = (uid: string | undefined) => (state: RootState) => {
    return state.assesments.list.filter(notification =>
      notification.id === uid
    );
  };
