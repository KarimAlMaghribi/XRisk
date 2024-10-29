import React, {useState} from "react";
import {Checkbox, Divider, FormControlLabel, FormGroup, Paper, Typography} from "@mui/material";
import Slider from '@mui/material/Slider';
import {RiskOverviewFilterType} from "../../models/RiskOverviewFilterType";
import {AppDispatch} from "../../store/store";
import {changeFilterValue, changeRemainingTerm, clearFilters, setFilterType} from "../../store/slices/risk-overview";
import {useDispatch} from "react-redux";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";


export const RiskOverviewFilter = (props: RiskOverviewFilterType) => {
    const dispatch: AppDispatch = useDispatch();
    const [sliderValue, setSliderValue] = useState<number | number[]>(props.value);
    const [termValue, setTermValue] = useState<number | number[]>(props.remainingTerm);

    const handleTypeChange = (type: string) => {
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

    return (
        <Paper square={false} style={{margin: "5px", padding: "30px", marginTop: "10px"}} elevation={2}>
            <Typography variant="h6">Filter</Typography>
            <Typography variant="button">Risikoart</Typography>
            <FormGroup>
                {props.types.map((type, index) => (
                    <FormControlLabel
                        key={index}
                        control={<Checkbox checked={type.checked} size="small" onChange={() => handleTypeChange(type.name)}/>}
                        label={type.label}
                    />
                ))}
            </FormGroup>
            <Typography variant="button">Nennwert</Typography>
            <Slider
                value={sliderValue}
                onChange={handleValueChange}
                onChangeCommitted={handleValueChangeCommitted}
                min={0}
                max={200000}
                step={1}
                marks={[
                    {value: 0, label: '0€'},
                    {value: 75000, label: '75.000€'},
                    {value: 135000, label: '135.000€'},
                    {value: 200000, label: '200.000€'}
                ]}
                valueLabelDisplay="auto"
            />
            <Typography variant="button">Restlaufzeit</Typography>
            <Slider
                value={termValue}
                onChange={handleTermChange}
                onChangeCommitted={handleTermChangeCommitted}
                valueLabelDisplay="auto"
                min={1}
                max={24}
                marks={[
                    {value: 1, label: '< 1 Monat'},
                    {value: 12, label: '1 Jahr'},
                    {value: 24, label: '> 2 Jahre'},
                ]}
            />
            <Button variant="outlined" fullWidth onClick={() => dispatch(clearFilters())}>Zurücksetzen</Button>
        </Paper>
    )
}
