import React, { createContext, useContext, useState, ReactNode } from "react";
import {Snackbar, Alert, AlertTitle, SnackbarOrigin, duration} from "@mui/material";

type SnackbarContextType = {
    showSnackbar: (
        title: string,
        message: string,
        anchorOrigin?: SnackbarOrigin,
        severity?: "success" | "info" | "warning" | "error",
        duration?: number
    ) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
    showSnackbar: () => {},
});

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [open, setOpen] = useState(false);
    const [snackbarTitle, setSnackbarTitle] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOrigin, setSnackbarOrigin] = useState<SnackbarOrigin>({
        vertical: "top",
        horizontal: "center",
    });
    const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error">("info");
    const [duration, setDuration] = useState<number>(3000);

    const showSnackbar = (
        title: string,
        message: string,
        anchorOrigin?: SnackbarOrigin,
        severity?: "success" | "info" | "warning" | "error",
        duration?: number
    ) => {
        setSnackbarTitle(title);
        setSnackbarMessage(message);
        setSeverity(severity || "info");
        setDuration(duration || 3000);

        if (anchorOrigin) {
            setSnackbarOrigin(anchorOrigin);
        } else {
            setSnackbarOrigin({ vertical: "top", horizontal: "center" });
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={duration}
                anchorOrigin={snackbarOrigin}>
                <Alert severity={severity} onClose={handleClose}>
                    <AlertTitle>{snackbarTitle}</AlertTitle>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
