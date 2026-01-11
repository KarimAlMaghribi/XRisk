import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import { CircularProgress } from "@mui/material";
import { useSession } from "../auth/useSession";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useSession();

    if (loading) {
        return <CircularProgress />
    }

    return user ? children : <Navigate to="/" replace />;
};
