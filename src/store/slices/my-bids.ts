import { createSlice } from "@reduxjs/toolkit";

export interface MyBidsState {
    value: number;
}

const initialState: MyBidsState = {
    value: 0,
};

export const myBisSlice = createSlice({
    name: "myBids",
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

export const { increment, decrement } = myBisSlice.actions;

export default myBisSlice.reducer;
