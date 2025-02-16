import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {PaperComponent} from "../../../ui/draggable-dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {Chat} from "../../../../store/slices/my-bids/types";
import {deleteChatById, deleteChatsByRiskId, fetchMyChats} from "../../../../store/slices/my-bids/thunks";
import {AppDispatch} from "../../../../store/store";
import {useDispatch} from "react-redux";
import {useSnackbarContext} from "../../../snackbar/custom-snackbar";

export interface CancelDealDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    chat: Chat;
}

export const CancelDealDialog = (props: CancelDealDialogProps) => {
    const dispatch: AppDispatch = useDispatch();
    const { showSnackbar } = useSnackbarContext();

    const handleAbort = () => {
        dispatch(deleteChatById(props.chat.id));
        props.setOpen(false);
        showSnackbar("Verhandlung abgebrochen!", "Die Verhandlung wurde erfolgreich abgebrochen.", { vertical: "top", horizontal: "center" }, "success");
    }

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
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Verhandlung abbrechen</DialogTitle>
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
                    Möchtest du die Verhandlung mit <strong>{props.chat.riskTaker?.name}</strong> zu <strong>{props.chat.topic}</strong> wirklich abbrechen?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAbort} variant="contained">Ja</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Nein</Button>
            </DialogActions>
        </Dialog>
    )
}
