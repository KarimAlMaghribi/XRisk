import { createSlice } from "@reduxjs/toolkit";

export interface MyRisksState {
    value: number;
}

const initialState: MyRisksState = {
    value: 0,
};

export const myRisksSlice = createSlice({
    name: "myRisks",
    initialState: initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

export const { increment, decrement } = myRisksSlice.actions;

export default myRisksSlice.reducer;
