import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";
import {RiskAPI} from "../../apis/risk-api";

export interface RiskOverviewState {
    risks: Risk[];
    filters: any;
    sorts: any;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    error?: string;
}

const initialState: RiskOverviewState = {
    risks: [],
    filters: null,
    sorts: null,
    loading: 'idle'
};

export const fetchRisks = createAsyncThunk(
    'risk-overview/fetchRisks',
    async (_, thunkAPI) => {
        const response = await RiskAPI.fetchAll();
        return response.risks;
    }
);

export const riskOverviewSlice = createSlice({
    name: "riskOverview",
    initialState: initialState,
    reducers: {
        sortRisks: (state, action) => {
            state.sorts = action.payload;
        },
        filterRisks: (state, action) => {
            state.filters = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRisks.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchRisks.fulfilled, (state, action) => {
                state.risks = action.payload;
                state.loading = "succeeded";
            })
            .addCase(fetchRisks.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = "failed";
            });
    }
});

export const { sortRisks, filterRisks } = riskOverviewSlice.actions;

export default riskOverviewSlice.reducer;
