import {createSlice} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {MyRiskAgreementsState} from "./types";
import {addMyRiskAgreement, deleteMyRiskAgreement, fetchMyRiskAgreements, updateMyRiskAgreement} from "./thunks";

const initialState: MyRiskAgreementsState = {
    riskAgreements: [],
    error: undefined,
    status: FetchStatusEnum.IDLE
};

export const myRiskAgreementsSlice = createSlice({
    name: FirestoreCollectionEnum.MY_RISK_AGREEMENTS,
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyRiskAgreements.pending, (state) => {
                state.riskAgreements = [];
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchMyRiskAgreements.fulfilled, (state, action) => {
                state.riskAgreements = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchMyRiskAgreements.rejected, (state, action) => {
                state.riskAgreements = [];
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(addMyRiskAgreement.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(addMyRiskAgreement.fulfilled, (state, action) => {
                if (state.riskAgreements.some(riskAgreement => riskAgreement.id === action.payload.id)) {
                    return;
                }

                state.riskAgreements.push(action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(addMyRiskAgreement.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(deleteMyRiskAgreement.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(deleteMyRiskAgreement.fulfilled, (state, action) => {
                state.riskAgreements = state.riskAgreements.filter(riskAgreement => riskAgreement.id !== action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(deleteMyRiskAgreement.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(updateMyRiskAgreement.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateMyRiskAgreement.fulfilled, (state, action) => {
                state.riskAgreements = state.riskAgreements.map(riskAgreement =>
                    riskAgreement.id === action.payload.id ? {...riskAgreement, ...action.payload} : riskAgreement
                );
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateMyRiskAgreement.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
    }
});

export default myRiskAgreementsSlice.reducer;
