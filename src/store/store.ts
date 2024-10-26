import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter";
import myRisksReducer from "./slices/my-risks";
import myBidsReducer from "./slices/my-bids";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        myRisks: myRisksReducer,
        myBids: myBidsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
