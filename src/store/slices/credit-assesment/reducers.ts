import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import { MyCreditAssesmentState } from "./types";
import { fetchAssesments, addAssesments, updateAssesment } from "./thunks";
import { CreditAssesment } from "../../../models/CreditAssesment";


const initialState: MyCreditAssesmentState = {
    creditAssesments: [],
    error: undefined,
    status: FetchStatusEnum.IDLE
};


const assesmentsSlice = createSlice({
    name: "assesments",
    initialState: {
      list: [] as CreditAssesment[],
      loading: false,
      error: null as string | null,
    },
    reducers: {
      setAssesments(state, action: PayloadAction<CreditAssesment[]>) {
        state.list = action.payload;
    },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAssesments.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAssesments.fulfilled, (state, action) => {
          state.list = action.payload as CreditAssesment[];
          state.loading = false;
        })
        .addCase(fetchAssesments.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Error fetching credit assesments";
        })
        .addCase(addAssesments.fulfilled, (state, action) => {
          state.list.push(action.payload);
        })
        .addCase(updateAssesment.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateAssesment.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(updateAssesment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Error updating credit assesments";
        })
    },
  });
  

export default assesmentsSlice.reducer;
export const {setAssesments} = assesmentsSlice.actions;
