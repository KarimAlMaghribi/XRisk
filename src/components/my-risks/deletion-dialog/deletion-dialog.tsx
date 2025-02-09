import {deleteMyRisk} from "../../../store/slices/my-risks/thunks";
import {deleteRisk} from "../../../store/slices/risks/thunks";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import {Risk} from "../../../models/Risk";
import React from "react";
import {Dialog, Button, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {PaperComponent} from "../../ui/draggable-dialog";

export interface MyRiskDeletionDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    risk: Risk;
}

export const MyRiskDeletionDialog = (props: MyRiskDeletionDialogProps) => {
    const dispatch: AppDispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteMyRisk(props.risk.id))
        dispatch(deleteRisk(props.risk.id))
        props.setOpen(false);
    };

    return (
        <Dialog
            PaperComponent={PaperComponent}
            PaperProps={{
                sx: {
                    position: 'absolute',
                    top: '10%',
                    m: 0,
                },
            }}
            fullWidth
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Risiko löschen</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => props.setOpen(false)}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}>
                <CloseIcon />
            </IconButton>
            <DialogContent style={{padding: "10px", margin: "10px"}}>
                <Typography>
                    Möchtest du das Risiko <strong>{props.risk.name}</strong> wirklich löschen?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} variant="contained">Löschen</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Abbrechen</Button>
            </DialogActions>
        </Dialog>
    );
}
