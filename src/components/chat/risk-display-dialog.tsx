import {Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {Publisher} from "../../models/Publisher";
import { PaperComponent } from "../ui/draggable-dialog";
import React, {useEffect} from "react";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import {Risk} from "../../models/Risk";
import {mapStatus} from "../my-risks/utils";

export interface RiskDisplayDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    risk: Risk | undefined;
}

export const RiskDisplayDialog = (props: RiskDisplayDialogProps) => {
    const { showSnackbar } = useSnackbarContext();
    const elementBottomMargin: number = 20;

    useEffect(() => {
        if (props.open && !props.risk) {
            console.error("Risk not found!");
            showSnackbar("Darstellung fehlerhaft!", "Risikodaten konnten nicht dargestellt werden", {vertical: "top", horizontal: "center"},"error");
        }
    }, [props.risk]);

    const handleClose = () => {
        props.setOpen(false);
    }

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            PaperProps={{
                sx: {
                    minWidth: "500px",
                    position: 'absolute',
                    top: '10%',
                    m: 0,
                },
            }}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {props.risk?.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Grid container>
                        <Grid size={4}>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}} >
                                Typ
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Absicherungssumme
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Fällig am
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Status
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Beschreibung
                            </Typography>
                        </Grid>
                        <Grid size={8}>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.risk?.type.map((type) => type).join(", ") || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.risk?.value
                                    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(props.risk.value)
                                    : "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {new Date(props.risk?.declinationDate || "").toLocaleString() || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {mapStatus(props.risk?.status) || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.risk?.description || "-"}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
    )
}
