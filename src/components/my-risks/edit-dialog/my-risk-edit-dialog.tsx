import React, {useEffect} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    FormHelperText, OutlinedInput, TextField,
    useFormControl
} from "@mui/material";
import Button from "@mui/material/Button";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import {updateRisk} from "../../../store/slices/my-risks";
import {Risk} from "../../../models/Risk";

export interface MyRiskEditDialogProps {
    risk: Risk;
    open: boolean;
    setOpen: (visible: boolean) => void;
}

export const MyRiskEditDialog = (props: MyRiskEditDialogProps) => {
    const [risk, setRisk] = React.useState<Risk>(props.risk);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        setRisk(props.risk);
    }, []);


    const handleSave = () => {
        dispatch(updateRisk(risk));
        props.setOpen(false);
    }

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <DialogTitle>Risiko bearbeiten</DialogTitle>
            <DialogContent>
                <TextField
                    label="ID"
                    defaultValue={risk.id}
                    slotProps={{input: {readOnly: true}}}/>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleSave}>
                    Speichern
                </Button>
                <Button
                    onClick={() => props.setOpen(false)}
                    variant="outlined">
                    Abbrechen
                </Button>
            </DialogActions>
        </Dialog>
    )
}
