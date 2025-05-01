import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {MyCreditAssesmentState} from "./types";
import {addAssesments, fetchAssessments, updateAssesment} from "./thunks";
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
            .addCase(addAssesments.pending, (state) => {
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(addAssesments.fulfilled, (state, action) => {
                state.list = [...state.list, action.payload as CreditAssesment];
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(addAssesments.rejected, (state, action) => {
                state.status = FetchStatusEnum.FAILED;
                state.error = action.error.message || "Error adding assesments";
            })
            .addCase(updateAssesment.pending, (state) => {
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateAssesment.fulfilled, (state, action) => {
                const updatedAssessment = action.payload;
                state.list = state.list.map(assessment =>
                    assessment.id === updatedAssessment.id ? updatedAssessment : assessment
                );
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateAssesment.rejected, (state, action) => {
                state.status = FetchStatusEnum.FAILED;
                state.error = action.error.message || "Error updating assesments";
            });
    },
});


export default assesmentsSlice.reducer;
export const {setAssesments} = assesmentsSlice.actions;
