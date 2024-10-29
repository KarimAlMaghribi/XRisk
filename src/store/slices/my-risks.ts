import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";

export interface MyRisksState {
    risks: Risk[];
}

const initialState: MyRisksState = {
    risks: [], // Hier muss beim Laden ein fetch an die DB stattfinden
};

export const myRisksSlice = createSlice({
    name: "myRisks",
    initialState: initialState,
    reducers: {
        createRisk: (state, action: PayloadAction<Risk>) => {
            state.risks.push(action.payload);
        },
        deleteRisk: (state, action: PayloadAction<string>) => {
            state.risks = state.risks.filter((risk) => risk.id !== action.payload);
        }
    },
});

export const selectMyRisks = (state: { myRisks: MyRisksState }) => state.myRisks.risks;

export const { createRisk, deleteRisk } = myRisksSlice.actions;

export default myRisksSlice.reducer;
