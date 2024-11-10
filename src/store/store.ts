import { configureStore,  } from "@reduxjs/toolkit";
import myRisksReducer from "./slices/my-risks";
import myBidsReducer from "./slices/my-bids";
import riskOverviewReducer from "./slices/risk-overview";
import userProfilesReducer from "./slices/user-profile";

export const store = configureStore({
    reducer: {
        myRisks: myRisksReducer,
        myBids: myBidsReducer,
        riskOverview: riskOverviewReducer,
        userProfiles: userProfilesReducer,
    },
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
