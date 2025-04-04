import {combineReducers, configureStore} from "@reduxjs/toolkit";
import myRisksReducer from "./slices/my-risks/reducers";
import myBidsReducer from "./slices/my-bids/reducers";
import riskOverviewReducer from "./slices/risks/reducers";
import myRiskAgreementsReducer from "./slices/my-risk-agreements/reducers";
import userProfilesReducer from "./slices/user-profile/reducers";
import metaReducer from "./slices/meta/reducers";
import notificationReducer from "./slices/my-notifications/reducers";
import assesmentsReducer from "./slices/credit-assesment/reducers";

const appReducer = combineReducers({
    meta: metaReducer,
    myRisks: myRisksReducer,
    myBids: myBidsReducer,
    myRiskAgreements: myRiskAgreementsReducer,
    risks: riskOverviewReducer,
    userProfile: userProfilesReducer,
    notifications: notificationReducer,
    assesments: assesmentsReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === "RESET_STORE") {
        state = undefined;
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const resetStore = () => ({ type: "RESET_STORE" });
