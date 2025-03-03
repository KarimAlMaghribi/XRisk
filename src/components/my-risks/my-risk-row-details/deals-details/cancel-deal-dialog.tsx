import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {PaperComponent} from "../../../ui/draggable-dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {Chat} from "../../../../store/slices/my-bids/types";
import {deleteChatById} from "../../../../store/slices/my-bids/thunks";
import {AppDispatch, store} from "../../../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbarContext} from "../../../snackbar/custom-snackbar";
import {auth} from "../../../../firebase_config";
import {RiskStatusEnum} from "../../../../enums/RiskStatus.enum";
import {selectChats} from "../../../../store/slices/my-bids/selectors";
import {updateMyRiskStatus} from "../../../../store/slices/my-risks/thunks";
import {updateRisk, updateRiskStatus} from "../../../../store/slices/risks/thunks";

export interface CancelDealDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    chat: Chat;
}

export const CancelDealDialog = (props: CancelDealDialogProps) => {
    const uid = auth.currentUser?.uid;
    const dispatch: AppDispatch = useDispatch();
    const {showSnackbar} = useSnackbarContext();

    const handleAbort = async () => {
        await dispatch(deleteChatById(props.chat.id));

        if (!uid) {
            console.error("User is not authenticated. Could not update myRisk status.");
        }

        const state = store.getState();
        const updatedChats: Chat[] = state.myBids.chats;
        const chatCount: number = updatedChats.filter(chat => chat.riskId === props.chat.riskId).length;

        // if you provided the risks and there are no chats left, myRisk status should be set to PUBLISHED again
        if (props.chat.riskProvider?.uid === uid && chatCount === 0) {
            await dispatch(updateRiskStatus({
                id: props.chat.riskId,
                status: RiskStatusEnum.PUBLISHED
            }));

            await dispatch(updateMyRiskStatus({
                riskId: props.chat.riskId,
                status: RiskStatusEnum.PUBLISHED
            }));
        }

        props.setOpen(false);
        showSnackbar(
            "Verhandlung abgebrochen!",
            "Die Verhandlung wurde erfolgreich abgebrochen.",
            {vertical: "top", horizontal: "center"},
            "success"
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
            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">Verhandlung abbrechen</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => props.setOpen(false)}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}>
                <CloseIcon/>
            </IconButton>
            <DialogContent style={{padding: "10px", margin: "10px"}}>
                <Typography>
                    Möchtest du die Verhandlung
                    mit <strong>{props.chat.riskTaker?.uid === uid ? props.chat.riskProvider?.name : props.chat.riskTaker?.name}</strong> zu <strong>{props.chat.topic}</strong> wirklich
                    abbrechen?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAbort} variant="contained">Ja</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Nein</Button>
            </DialogActions>
        </Dialog>
    )
}
