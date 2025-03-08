import React, {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {NumericFormat} from 'react-number-format';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../store/store";
import {Risk} from "../../../models/Risk";
import {v4 as uuidv4} from 'uuid';
import {addMyRisk} from "../../../store/slices/my-risks/thunks";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../../routing/routes";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";
import {RiskTypeSelector} from "../risk-type-selector";
import {selectUserProfile} from "../../../store/slices/user-profile/selectors";
import {UserProfile} from "../../../store/slices/user-profile/types";
import {auth} from "../../../firebase_config";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {PaperComponent} from "../../ui/draggable-dialog";
import { Trans, useTranslation } from "react-i18next";
import i18next from "i18next";

import {formatEuro} from "../my-risk-row-details/agreement-details/agreement-table";

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
    const userProfile: UserProfile = useSelector(selectUserProfile);

    const t = i18next.t;
    const [pushedCreateButton, setPushedCreateButton] = useState<boolean>(false);

    const descriptionLength: number = 5;
    const maxValue: number = 100000000;

    const [nameError, setNameError] = useState<boolean>(false);
    const [descriptionError, setDescriptionError] = useState<boolean>(false);
    const [valueError, setValueError] = useState<boolean>(false);
    const [riskTypeError, setRiskTypeError] = useState<boolean>(false);

    useEffect(() => {
        if (pushedCreateButton) {
            setNameError(name.length === 0);
            setDescriptionError(description.length <= descriptionLength);
            setValueError(value > maxValue || value < 0);
            setRiskTypeError(riskType.length === 0);
        }
    }, [name, description, value, riskType, pushedCreateButton]);

    const handleValueChange = (newValue: number) => {
        if (!isNaN(newValue)) {
            setValue(newValue);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setRiskType([]);
        setValue(0);
        setDate(dayjs().add(1, "month"));
        setPushedCreateButton(false);
        setNameError(false);
        setDescriptionError(false);
        setValueError(false);
        setRiskTypeError(false);
        props.handleClose();
    };

    const handleCreateRisk = () => {
        setPushedCreateButton(true);

        if (
            name.length === 0 ||
            description.length <= descriptionLength ||
            value > maxValue ||
            value < 0 ||
            riskType.length === 0
        ) {
            return;
        }

        const newRisk: Risk = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            name: name,
            description: description,
            status: RiskStatusEnum.DRAFT,
            type: riskType,
            value: value,
            publisher: {
                uid: userProfile.id || auth.currentUser?.uid || '',
                name: userProfile.profile.name,
            },
            declinationDate: date?.toISOString() || 'kein Ablaufdatum',
        };

        dispatch(addMyRisk(newRisk));
        navigate(`/${ROUTES.MY_RISKS}`);
        handleClose();
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            PaperComponent={PaperComponent}
            PaperProps={{
                sx: {
                    position: 'absolute',
                    top: '10%',
                    m: 0,
                },
            }}>
            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title"><Trans i18nKey="define_risk.title"></Trans></DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}>
                <CloseIcon />
            </IconButton>

            <DialogContent>
                <DialogContentText>
                    <Trans i18nKey="define_risk.title_text"></Trans>
                </DialogContentText>

                <TextField
                    error={nameError}
                    helperText={nameError ? `${t("define_risk.name_description")}` : ""}
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
                    error={descriptionError}
                    helperText={descriptionError ? `${t("define_risk.brief_description_description")}` : description.length <= 20 ? `${t("define_risk.brief_description_error")}` : ""}
                    required
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    margin="dense"
                    fullWidth
                    id="description"
                    label= {`${t("define_risk.brief_description")}`}
                    multiline
                    rows={4}
                />
                <RiskTypeSelector
                    riskTypeError={riskTypeError}
                    setRiskTypeError={setRiskTypeError}
                    textFieldVariant="outlined"
                    value={riskType}
                    setValue={setRiskType}
                    required={true}
                />
                <TextField
                    error={valueError}
                    helperText={valueError ? `${t("define_risk.insurance_sum_error1")}` : value < 0 ? `${t("define_risk.insurance_sum_error2")}` : ""}
                    margin="dense"
                    fullWidth
                    label={`${t("terms.insurance_sum")}`}
                    value={value}
                    onChange={(event) =>
                        handleValueChange(Number(event.target.value.replace(/€\s?|(,*)/g, '')))
                    }
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
                        label={`${t("define_risk.end_of_term")}`}
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
                    variant="contained"
                    onClick={handleCreateRisk}>
                    {`${t("terms.define")}`}
                </Button>
                <Button
                    onClick={handleClose}
                    variant="outlined">
                    {`${t("terms.cancel")}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

