import {MetaState} from "./types";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {createSlice} from "@reduxjs/toolkit";
import {fetchHighestRiskValue, fetchUserCount} from "./thunks";

const initialState: MetaState = {
    userCount: null,
    riskCount: null,
    totalRiskInvestmentValue: null,
    risksTaken: null,
    highestRiskValue: null,
    status: FetchStatusEnum.IDLE,
}

const metaSlice = createSlice({
    name: "meta",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCount.pending, (state) => {
                state.status = FetchStatusEnum.PENDING
            })
            .addCase(fetchUserCount.fulfilled, (state, action) => {
                state.userCount = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
                state.userCount = action.payload;
            })
            .addCase(fetchUserCount.rejected, (state, action) => {
                state.status = FetchStatusEnum.FAILED;
                state.error = action.error.message;
            })
            .addCase(fetchHighestRiskValue.pending, (state) => {
                state.status = FetchStatusEnum.PENDING;
                state.highestRiskValue = null;
                state.error = undefined;
            })
            .addCase(fetchHighestRiskValue.fulfilled, (state, action) => {
                state.highestRiskValue = action.payload.value;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchHighestRiskValue.rejected, (state, action) => {
                state.status = FetchStatusEnum.FAILED;
                state.error = action.error.message;
                state.highestRiskValue = 500000
            });
    }
});

export default metaSlice.reducer;
