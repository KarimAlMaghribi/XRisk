import React from "react";
import {Dialog, Button, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {deleteChatsByRiskId} from "../../store/slices/my-bids/thunks";
import {AppDispatch} from "../../store/store";
import {useDispatch} from "react-redux";
import {deleteMyRisk} from "../../store/slices/my-risks/thunks";
import {deleteRisk} from "../../store/slices/risks/thunks";
import {PaperComponent} from "../ui/draggable-dialog";
import {Risk} from "../../models/Risk";
import {addNotification} from "../../store/slices/my-notifications/thunks";
import {NotificationStatusEnum} from "../../enums/Notifications.enum";
import {serverTimestamp} from "firebase/firestore";
import {useSnackbarContext} from "../snackbar/custom-snackbar";

export interface RiskDeletionDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    risk: Risk | null;
}

export const RiskDeletionDialog = (props: RiskDeletionDialogProps) => {
    const dispatch: AppDispatch = useDispatch();
    const { showSnackbar } = useSnackbarContext();

    const handleDelete = () => {
        if (!props.risk) {
            console.log("Error deleting Risk! Risk is null")
            return;
        }

        const newNotification = {
            message: "Dein Risiko: '" + props.risk.name + "' wurde von einem ADMIN gelöscht!",
            chatroomId: "-1",
            status: NotificationStatusEnum.UNREAD,
            createdAt: serverTimestamp(),
        };

        dispatch(deleteChatsByRiskId(props.risk.id));
        dispatch(deleteMyRisk(props.risk.id))
        dispatch(deleteRisk(props.risk.id))
        dispatch(addNotification({uid: props.risk.publisher?.uid, newNotification: newNotification}));
        props.setOpen(false);

        console.error("Risk with id " + props.risk.id + " was deleted successfully!");
        showSnackbar(
            "Risiko gelöscht!",
            "Risiko wurde aus der Risikobörse sowie der persönlichen Übersicht des Erstellers entfernt. Alle mit dem Risiko verbundnen Chats wurde gelöscht!",
            { vertical: "top", horizontal: "center" },
            "success",
            8500
        );
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
                    Möchtest du das Risiko <strong>{props.risk && props.risk.name}</strong> wirklich löschen?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} variant="contained">Löschen</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Abbrechen</Button>
            </DialogActions>
        </Dialog>
    );
}
