import React, {useState} from "react";
import {Box, Divider, Paper, Typography} from "@mui/material";
import Slider from '@mui/material/Slider';
import {RiskOverviewFilterType} from "../../models/RiskOverviewFilterType";
import {AppDispatch} from "../../store/store";
import {
    changeFilterValue,
    changeRemainingTerm,
    clearFilters,
    setFilterType
} from "../../store/slices/risks/reducers";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import {RiskTypeSelector} from "../my-risks/risk-type-selector";
import {selectFilterTypes} from "../../store/slices/risks/selectors";
import {formatDate} from "../../utils/dateFormatter";


export const RiskOverviewFilter = (props: RiskOverviewFilterType) => {
    const dispatch: AppDispatch = useDispatch();
    const [sliderValue, setSliderValue] = useState<number[]>(props.value);
    const [termValue, setTermValue] = useState<number[]>(props.remainingTerm);
    const filterTypes: string[] = useSelector(selectFilterTypes);

    const handleTypeChange = (type: string[]) => {
        dispatch(setFilterType(type));
    };

    const handleValueChange = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setSliderValue(newValue);
        }
    };

    const handleValueChangeCommitted = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            dispatch(changeFilterValue(newValue));
        }
    };

    const handleTermChange = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setTermValue(newValue);
        }
    };

    const handleTermChangeCommitted = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            dispatch(changeRemainingTerm(newValue));
        }
    };

    const addMonths = (date: Date, months: number) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSliderValue([0, 200000]);
        setTermValue([0, 24]);
    }

    return (
        <Paper square={false} style={{margin: "5px", padding: "30px", marginTop: "10px"}} elevation={0}>
            <Typography variant="h6"><b>Filter</b></Typography>
            <Typography variant="caption">Filter die Risiken nach deinen Wünschen und Interessen</Typography>

            <br/>

            <RiskTypeSelector value={filterTypes} setValue={handleTypeChange} textFieldVariant="standard" label="Risikoart"/>

            <br/>

            <Typography variant="body1">Nennwert</Typography>
            <Typography variant="caption">Absicherungssumme des Risikos</Typography>

            <Box margin="15px">
                <Slider
                    value={sliderValue}
                    onChange={handleValueChange}
                    onChangeCommitted={handleValueChangeCommitted}
                    min={0}
                    max={200000}
                    step={100}
                    marks={[
                        {value: 0, label: '0€'},
                        {value: 75000, label: '75.000€'},
                        {value: 135000, label: '135.000€'},
                        {value: 200000, label: '200.000€'}
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value.toLocaleString("de-DE")}€`}
                />
            </Box>

            <Box textAlign="center">
                <Typography variant="caption" sx={{ color: "grey" }}>
                    {`${sliderValue[0].toLocaleString("de-DE")}€ bis ${sliderValue[1].toLocaleString("de-DE")}€`}
                </Typography>
            </Box>


            <br/>

            <Typography variant="body1">Restlaufzeit</Typography>
            <Typography variant="caption">Zeitpunkt zu dem das Risiko verfällt</Typography>

            <Box margin="15px">
                <Slider
                    value={termValue}
                    onChange={handleTermChange}
                    onChangeCommitted={handleTermChangeCommitted}
                    valueLabelDisplay="auto"
                    min={0}
                    max={24}
                    marks={[
                        {value: 0, label: '< 1 Monat'},
                        {value: 12, label: '1 Jahr'},
                        {value: 24, label: '2 Jahre'},
                    ]}
                />
            </Box>

            <Box textAlign="center">
                <Typography variant="caption" sx={{ color: "grey" }}>
                    {`vom ${
                        Array.isArray(termValue)
                            ? formatDate(addMonths(new Date(), termValue[0]))
                            : formatDate(new Date())
                    } bis zum ${
                        Array.isArray(termValue)
                            ? formatDate(addMonths(new Date(), termValue[1]))
                            : formatDate(addMonths(new Date(), termValue))
                    }`}
                </Typography>
            </Box>

            <br />
            <Divider sx={{margin: 0, padding: 0}}/>
            <br />

            <Button
                variant="outlined"
                fullWidth
                onClick={handleClearFilters}>
                Zurücksetzen
            </Button>
        </Paper>
    )
}
