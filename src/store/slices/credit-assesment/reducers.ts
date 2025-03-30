import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import { MyCreditAssesmentState } from "./types";
import { fetchAssesments, addAssesments, updateAssesment } from "./thunks";
import { CreditAssesment } from "../../../models/CreditAssesment";
import { FirestoreCollectionEnum } from "../../../enums/FirestoreCollectionEnum";


const initialState: MyCreditAssesmentState = {
    creditAssesments: [],
    activeAssesments: null,
    error: undefined,
    status: FetchStatusEnum.IDLE
};


// Notification Slice
const assesmentsSlice = createSlice({
    name: FirestoreCollectionEnum.CREDIT_ASSESMENT,
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
          state.error = action.error.message || "Error fetching assesments";
        })
    },
  });
  

export default assesmentsSlice.reducer;
export const {setAssesments} = assesmentsSlice.actions;
