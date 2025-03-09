import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {PaperComponent} from "../../../ui/draggable-dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {Chat} from "../../../../store/slices/my-bids/types";
import {deleteChatById, fetchChatCountByRiskId} from "../../../../store/slices/my-bids/thunks";
import {AppDispatch} from "../../../../store/store";
import {useDispatch} from "react-redux";
import {useSnackbarContext} from "../../../snackbar/custom-snackbar";
import {auth} from "../../../../firebase_config";
import {RiskStatusEnum} from "../../../../enums/RiskStatus.enum";
import {deleteMyRisk, updateMyRiskStatus} from "../../../../store/slices/my-risks/thunks";
import {updateRiskStatus} from "../../../../store/slices/risks/thunks";
import {deleteTakenRisk} from "../../../../store/slices/my-risks/reducers";

export interface CancelDealDialogProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    chat: Chat;
}

export const CancelDealDialog = (props: CancelDealDialogProps) => {

    const uid = auth.currentUser?.uid;
    const dispatch: AppDispatch = useDispatch();
    const {showSnackbar} = useSnackbarContext();

    const handleDealAbortion = async () => {
        await dispatch(deleteChatById(props.chat.id));

        if (!uid) {
            console.error("User is not authenticated. Could not update myRisk status.");
        }

        if (!props.chat.riskId) {
            console.error("Risk ID not found. Could not update myRisk status.");
        }

        const resultAction = await dispatch(fetchChatCountByRiskId(props.chat.riskId));

        if (fetchChatCountByRiskId.fulfilled.match(resultAction)) {
            const chatCount = resultAction.payload;
            const isProvider: boolean = props.chat.riskProvider?.uid === uid;

            if (chatCount === 0) {
                await dispatch(updateRiskStatus({id: props.chat.riskId, status: RiskStatusEnum.PUBLISHED}));

                if (isProvider) { // if you are the provider, the risk will change its status to published
                    await dispatch(updateMyRiskStatus({riskId: props.chat.riskId, status: RiskStatusEnum.PUBLISHED}));
                } else { // if you are the taker, the risk will disappear from your list
                    dispatch(deleteTakenRisk(props.chat.riskId));
                }
            }

            if (chatCount > 0){
                if (!isProvider){ // if you are the taker, the risk will disappear from your list
                    dispatch(deleteTakenRisk(props.chat.riskId));
                }
                // if you are the provider, the deletion of the chat, already removed the risk from your list
            }

        } else {
            console.error("Fehler beim Abrufen der Chat-Anzahl.");
        }

        props.setOpen(false);
        showSnackbar(
            "Verhandlung abgebrochen!",
            `Die Verhandlung mit ${props.chat.riskTaker.uid === uid ? props.chat.riskProvider.name : props.chat.riskTaker.name} wurde erfolgreich abgebrochen.`,
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
                <Button onClick={handleDealAbortion} variant="contained">Ja</Button>
                <Button onClick={() => props.setOpen(false)} variant="outlined">Nein</Button>
            </DialogActions>
        </Dialog>
    )
}
