import { configureStore,  } from "@reduxjs/toolkit";
import myRisksReducer from "./slices/my-risks/reducers";
import myBidsReducer from "./slices/my-bids/reducers";
import riskOverviewReducer from "./slices/risks/reducers";
import myRiskAgreementsReducer from "./slices/my-risk-agreements/reducers";
import userProfilesReducer from "./slices/user-profile/reducers";
import metaReducer from "./slices/meta/reducers";
import notificationReducer from "./slices/my-notifications/reducers";

export const store = configureStore({
    reducer: {
        meta: metaReducer,
        myRisks: myRisksReducer,
        myBids: myBidsReducer,
        myRiskAgreements: myRiskAgreementsReducer,
        risks: riskOverviewReducer,
        userProfile: userProfilesReducer,
        notification: notificationReducer
    },
    devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
