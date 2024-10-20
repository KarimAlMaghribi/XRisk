import React from "react";
import {Navigate} from "react-router-dom";

export interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
    const isAuthenticated = false;

    return isAuthenticated ? props.children : <Navigate to="/sign-in" />;
}
