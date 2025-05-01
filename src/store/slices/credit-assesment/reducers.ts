import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {MyCreditAssesmentState} from "./types";
import {fetchAssessments} from "./thunks";
import {CreditAssesment} from "../../../models/CreditAssesment";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";


const initialState: MyCreditAssesmentState = {
    list: [],
    status: FetchStatusEnum.IDLE,
    error: null
};

const assesmentsSlice = createSlice({
    name: FirestoreCollectionEnum.CREDIT_ASSESMENT,
    initialState: initialState,
    reducers: {
        setAssesments(state, action: PayloadAction<CreditAssesment[]>) {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssessments.pending, (state) => {
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchAssessments.fulfilled, (state, action) => {
                state.list = action.payload as CreditAssesment[];
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchAssessments.rejected, (state, action) => {
                state.status = FetchStatusEnum.FAILED;
                state.error = action.error.message || "Error fetching assesments";
            })
    },
});


export default assesmentsSlice.reducer;
export const {setAssesments} = assesmentsSlice.actions;
