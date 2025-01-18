import {createSlice} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {MyRisksState} from "./types";
import {addMyRisk, deleteMyRisk, fetchMyRisks, updateMyRisk} from "./thunks";


const initialState: MyRisksState = {
    risks: [],
    error: undefined,
    status: FetchStatusEnum.IDLE
};

export const myRisksSlice = createSlice({
    name: FirestoreCollectionEnum.MY_RISKS,
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyRisks.pending, (state) => {
                state.risks = [];
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchMyRisks.fulfilled, (state, action) => {
                state.risks = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchMyRisks.rejected, (state, action) => {
                state.risks = [];
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(addMyRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(addMyRisk.fulfilled, (state, action) => {
                if (state.risks.some(risk => risk.id === action.payload.id)) {
                    return;
                }

                state.risks.push(action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(addMyRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(deleteMyRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(deleteMyRisk.fulfilled, (state, action) => {
                state.risks = state.risks.filter(risk => risk.id !== action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(deleteMyRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(updateMyRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateMyRisk.fulfilled, (state, action) => {
                state.risks = state.risks.map(risk =>
                    risk.id === action.payload.id ? {...risk, ...action.payload} : risk
                );
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateMyRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
    }
});

export default myRisksSlice.reducer;
