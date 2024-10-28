import { createSlice } from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";

export interface MyRisksState {
    risks: Risk[];
}

const initialState: MyRisksState = {
    risks: [],
};

export const myRisksSlice = createSlice({
    name: "myRisks",
    initialState: initialState,
    reducers: {
        createRisk: (state, action) => {

        }
    },
});

export const { createRisk } = myRisksSlice.actions;

export default myRisksSlice.reducer;
