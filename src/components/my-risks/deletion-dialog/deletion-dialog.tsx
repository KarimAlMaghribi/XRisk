import {deleteMyRisk} from "../../../store/slices/my-risks/thunks";
import {deleteRisk} from "../../../store/slices/risks/thunks";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import {Risk} from "../../../models/Risk";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
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
    dispatch(deleteMyRisk(props.risk.id));
    dispatch(deleteRisk(props.risk.id));
    // Chats entfernen (idempotent im Thunk, falls nicht vorhanden)
    // Falls du vorher explizit löschen willst:
    // dispatch(deleteChatsByRiskId(props.risk.id));
    props.setOpen(false);
  };

  return (
      <Dialog
          PaperComponent={PaperComponent}
          PaperProps={{
            sx: {
              position: 'absolute',
              top: {xs: '5%', md: '10%'},
              m: 0,
              maxHeight: {xs: '84vh', md: '88vh'},
              overflow: 'auto',
            },
          }}
          fullWidth
          maxWidth="sm"
          open={props.open}
          onClose={() => props.setOpen(false)}
          aria-labelledby="delete-risk-title"
      >
        <DialogTitle id="delete-risk-title" style={{cursor: 'move'}}>
          Risiko löschen
        </DialogTitle>
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
        <DialogContent sx={{px: 2, py: 1.5}}>
          <Typography>
            Möchtest du das Risiko <strong>{props.risk.name}</strong> wirklich löschen?
          </Typography>
        </DialogContent>
        <DialogActions sx={{px: 2, py: 1.5}}>
          <Button onClick={handleDelete} variant="contained" autoFocus>Löschen</Button>
          <Button onClick={() => props.setOpen(false)} variant="outlined">Abbrechen</Button>
        </DialogActions>
      </Dialog>
  );
};
