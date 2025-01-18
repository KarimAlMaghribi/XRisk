import { configureStore,  } from "@reduxjs/toolkit";
import myRisksReducer from "./slices/my-risks/reducers";
import myBidsReducer from "./slices/my-bids/reducers";
import riskOverviewReducer from "./slices/risks/reducers";
import userProfilesReducer from "./slices/user-profile/reducers";

export const store = configureStore({
    reducer: {
        myRisks: myRisksReducer,
        myBids: myBidsReducer,
        risks: riskOverviewReducer,
        userProfile: userProfilesReducer,
    },
    devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
