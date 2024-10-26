import React from "react";
import {Navigate} from "react-router-dom";
import {ROUTES} from "./routes";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase_config";

export interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute = ({children}: { children: JSX.Element }) => {
    const [user] = useAuthState(auth);
    return user ? children : <Navigate to={ROUTES.SIGN_IN}/>;
};
