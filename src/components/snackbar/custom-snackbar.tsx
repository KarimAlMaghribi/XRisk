import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertTitle, SnackbarOrigin } from "@mui/material";

type SnackbarContextType = {
    showSnackbar: (
        title: string,
        message: string,
        anchorOrigin?: SnackbarOrigin,
        severity?: "success" | "info" | "warning" | "error"
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
        vertical: "bottom",
        horizontal: "center",
    });
    const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error">("info");

    const showSnackbar = (
        title: string,
        message: string,
        anchorOrigin?: SnackbarOrigin,
        severity?: "success" | "info" | "warning" | "error"
    ) => {
        setSnackbarTitle(title);
        setSnackbarMessage(message);
        setSeverity(severity || "info");

        if (anchorOrigin) {
            setSnackbarOrigin(anchorOrigin);
        } else {
            setSnackbarOrigin({ vertical: "bottom", horizontal: "center" });
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
                autoHideDuration={3000}
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
