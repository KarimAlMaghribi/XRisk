import { configureStore,  } from "@reduxjs/toolkit";
import myRisksReducer from "./slices/my-risks/reducers";
import myBidsReducer from "./slices/my-bids/reducers";
import riskOverviewReducer from "./slices/risks/reducers";
import userProfilesReducer from "./slices/user-profile/reducers";
import metaReducer from "./slices/meta/reducers";

export const store = configureStore({
    reducer: {
        meta: metaReducer,
        myRisks: myRisksReducer,
        myBids: myBidsReducer,
        risks: riskOverviewReducer,
        userProfile: userProfilesReducer,
    },
    devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
