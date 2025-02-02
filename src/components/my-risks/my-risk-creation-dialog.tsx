import React, {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {NumericFormat} from 'react-number-format';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store";
import {Risk} from "../../models/Risk";
import {v4 as uuidv4} from 'uuid';
import {addMyRisk} from "../../store/slices/my-risks/thunks";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routing/routes";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {RiskTypeSelector} from "./risk-type-selector";

export interface RiskCreationDialogProps {
    open: boolean;
    handleClose: () => void;
}

export const EuroNumberFormat = React.forwardRef(function EuroNumberFormat(props: any, ref) {
    const {onChange, ...other} = props;
    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values: any) => {
                onChange({
                    target: {
                        value: values.value,
                        name: props.name
                    }
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="€ "
        />
    );
});

export const MyRiskCreationDialog = (props: RiskCreationDialogProps) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [riskType, setRiskType] = useState<string[]>([]);
    const [value, setValue] = useState<number>(0);
    const [date, setDate] = useState<Dayjs | null>(dayjs().add(1, "month"));

    const handleValueChange = (newValue: number) => {
        if (!isNaN(newValue)) {
            setValue(newValue);
        }
    }

    const handleClose = () => {
        setName('');
        setDescription('');
        setRiskType([]);
        setValue(0);
        setDate(dayjs().add(1, "month"));
        props.handleClose();
    }

    const handleCreateRisk = () => {
        const newRisk: Risk = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            name: name,
            description: description,
            status: RiskStatusEnum.DRAFT,
            type: riskType,
            value: value,
            declinationDate: date?.toISOString() || 'kein Ablaufdatum',
        }

        dispatch(addMyRisk(newRisk));
        navigate(`/${ROUTES.MY_RISKS}`);
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Risiko definieren</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Definiere dein eignes Risiko, dass du später veröffentlichen kannst!
                </DialogContentText>

                <TextField
                    error={name.length === 0}
                    helperText={name.length === 0 ? "Bitte gib einen Namen ein" : ""}
                    sx={{marginTop: "10px"}}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                    required
                    margin="dense"
                    id="title"
                    name="title"
                    label="Name"
                    fullWidth
                />
                <TextField
                    error={description.length <= 20}
                    helperText={description.length === 0 ? "Bitte füge eine Beschreibung hinzu" : description.length <= 20 ? "Bitte füge eine längere Beschreibung hinzu" : ""}
                    required
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    margin="dense"
                    fullWidth
                    id="description"
                    label="Kurzbeschreibung"
                    multiline
                    rows={4}
                />
                <RiskTypeSelector
                    value={riskType}
                    setValue={setRiskType}
                    required={true}
                />
                <TextField
                    error={value > 999999}
                    helperText={value > 999999 ? "Maximal 999.999,00 € möglich" : ""}
                    margin="dense"
                    fullWidth
                    label="Absicherungssumme"
                    value={value}
                    onChange={(event) => handleValueChange(Number(event.target.value.replace(/€\s?|(,*)/g, '')))}
                    name="value"
                    id="value"
                    InputProps={{
                        inputComponent: EuroNumberFormat,
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ marginTop: "10px", width: "100%" }}
                        format="DD.MM.YYYY"
                        label="Laufzeitende"
                        value={date}
                        onChange={(newValue) => {
                            if (newValue && newValue.isAfter(dayjs())) {
                                setDate(newValue);
                            }
                        }}
                        minDate={dayjs().add(10, "day")}
                    />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={name.length === 0 || riskType.length === 0 || description.length <= 20 || value > 999999}
                    variant="contained"
                    onClick={handleCreateRisk}>
                    Definieren
                </Button>
                <Button
                    onClick={handleClose}
                    variant="outlined">
                    Abbrechen
                </Button>
            </DialogActions>
        </Dialog>
    )

}
