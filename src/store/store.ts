import { configureStore,  } from "@reduxjs/toolkit";
import myRisksReducer from "./slices/my-risks";
import myBidsReducer from "./slices/my-bids";
import riskOverviewReducer from "./slices/risks";
import userProfilesReducer from "./slices/user-profile";

export const store = configureStore({
    reducer: {
        myRisks: myRisksReducer,
        myBids: myBidsReducer,
        risks: riskOverviewReducer,
        userProfiles: userProfilesReducer,
    },
    devTools: true
});

export type AppDispatch = typeof store.dispatch;
