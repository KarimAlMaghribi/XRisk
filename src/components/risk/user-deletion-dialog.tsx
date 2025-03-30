import React from "react";
import {Dialog, Button, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {deleteChatsByRiskId, deleteChatsByUid} from "../../store/slices/my-bids/thunks";
import {AppDispatch} from "../../store/store";
import {useDispatch} from "react-redux";
import {deleteMyRisk} from "../../store/slices/my-risks/thunks";
import {deleteRisk, deleteRisksByUid} from "../../store/slices/risks/thunks";
import {PaperComponent} from "../ui/draggable-dialog";
import {Risk} from "../../models/Risk";
import {addNotification} from "../../store/slices/my-notifications/thunks";
import {NotificationStatusEnum} from "../../enums/Notifications.enum";
import {serverTimestamp} from "firebase/firestore";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import {UserProfile} from "../../store/slices/user-profile/types";
import {Publisher} from "../../models/Publisher";
import {setDeleteFlag} from "../../store/slices/user-profile/thunks";

export interface UserDeletionDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    publisher: Publisher | null | undefined;
}

export const UserDeletionDialog = (props: UserDeletionDialogProps) => {
    const dispatch: AppDispatch = useDispatch();
    const { showSnackbar } = useSnackbarContext();

    const handleDelete = () => {
        if (!props.publisher) {
            console.log("Error deleting User! UserProfile is null")
            return;
        }

        dispatch(setDeleteFlag(props.publisher.uid))
        dispatch(deleteRisksByUid(props.publisher.uid))
        dispatch(deleteChatsByUid(props.publisher.uid))

        props.setOpen(false);

        console.error("User with id " + props.publisher.uid + " was deleted successfully!");
        showSnackbar(
            "Nutzer gelöscht!",
            "Der Nutzer wurde aus dem Rechte-Rollen-System entfernt!",
            { vertical: "top", horizontal: "center" },
            "success",
            5000
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
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Nutzer löschen</DialogTitle>
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
                    Möchtest du den Nutzer <strong>{props.publisher?.name}</strong> wirklich löschen?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} variant="contained">Löschen</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Abbrechen</Button>
            </DialogActions>
        </Dialog>
    );
}
