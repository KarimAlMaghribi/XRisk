import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {PaperComponent} from "../../../ui/draggable-dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {Risk} from "../../../../models/Risk";
import {updateRisk} from "../../../../store/slices/risks/thunks";
import {AppDispatch} from "../../../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbarContext} from "../../../snackbar/custom-snackbar";
import {NotificationStatusEnum} from "../../../../enums/Notifications.enum";
import {serverTimestamp} from "firebase/firestore";
import {addNotification} from "../../../../store/slices/my-notifications/thunks";
import {ProfileInformation} from "../../../../store/slices/user-profile/types";
import {selectProfileInformation} from "../../../../store/slices/user-profile/selectors";
import {Chat} from "../../../../store/slices/my-bids/types";
import {selectChatByRiskId} from "../../../../store/slices/my-bids/selectors";
import {updateMyRisk} from "../../../../store/slices/my-risks/thunks";

export interface HandleDamageDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    risk: Risk;
}

export const HandleDamageDialog = (props: HandleDamageDialogProps) => {
    const {showSnackbar} = useSnackbarContext();
    const profile: ProfileInformation = useSelector(selectProfileInformation);
    const dispatch: AppDispatch = useDispatch();
    const riskRelatedChat: Chat | undefined = useSelector(
        selectChatByRiskId(props.risk.id)
    );

    const handleReport = () => {
        if (!props.risk || !props.risk.publisher) {
            console.error("Could not report damage Risk or publisher is missing");
            return
        };

        dispatch(updateRisk({...props.risk, occurred: true}));
        dispatch(updateMyRisk({...props.risk, occurred: true}));

        const newNotification = {
            message: `Ein Schaden wurde für das Risiko ${props.risk.name} von ${profile.name} gemeldet .`,
            chatroomId: "-1"!,
            status: NotificationStatusEnum.UNREAD,
            createdAt: serverTimestamp(),
        };

        if (!riskRelatedChat) {
            console.error("Could not create notification, for riskTaker - chat is missing");
            return
        }

        dispatch(addNotification({ uid: riskRelatedChat.riskTaker.uid, newNotification: newNotification }));

        showSnackbar(
            "Schaden gemeldet!",
            "Sie haben erfolgreich einen Schaden für das Risiko: " + props.risk.name + " gemeldet",
            {vertical: "top", horizontal: "center"},
            "success"
        );
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
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Schaden melden</DialogTitle>
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
                    Möchten Sie wirklich einen Schaden für das Risiko <strong>{props.risk.name}</strong> melden? Der weitere
                    Prozess ist noch nicht implementiert, aber das Risiko wird als eingetreten
                    markiert.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReport} variant="contained">Schaden melden</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Abbrechen</Button>
            </DialogActions>
        </Dialog>
    )
}
