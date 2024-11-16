import React, {useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import {updateRisk} from "../../../store/slices/my-risks";
import {Risk} from "../../../models/Risk";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
            fullWidth
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <DialogTitle>Risiko bearbeiten</DialogTitle>
            <DialogContent style={{padding: "10px", margin: "10px"}}>
                <TextField
                    disabled
                    fullWidth
                    label="ID"
                    defaultValue={risk.id}
                    slotProps={{input: {readOnly: true}}}/>
                <TextField
                    fullWidth
                    label="Name"
                    value={risk.name}
                    onChange={(event) => setRisk({...risk, name: event.target.value})}/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ marginTop: "10px", width: "100%" }}
                        format="DD.MM.YYYY"
                        label="Laufzeitende"
                        value={dayjs(risk.declinationDate, "DD.MM.YYYY")}
                        onChange={(newValue) => {
                            if (newValue) {
                                setRisk({
                                    ...risk,
                                    declinationDate: dayjs(newValue).format("DD.MM.YYYY"),
                                });
                            }
                        }}
                    />
                </LocalizationProvider>
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
