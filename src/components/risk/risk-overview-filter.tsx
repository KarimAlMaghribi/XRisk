import React, {useState} from "react";
import {Checkbox, FormControlLabel, FormGroup, Paper, Typography} from "@mui/material";
import Slider from '@mui/material/Slider';
import {RiskOverviewFilterType} from "../../models/RiskOverviewFilterType";
import {AppDispatch} from "../../store/store";
import {changeFilterValue, changeRemainingTerm, setFilterType} from "../../store/slices/risk-overview";
import {useDispatch} from "react-redux";


export const RiskOverviewFilter = (props: RiskOverviewFilterType) => {
    const dispatch: AppDispatch = useDispatch();
    const [sliderValue, setSliderValue] = useState<number | number[]>(props.value);
    const [termValue, setTermValue] = useState<number | number[]>(props.remainingTerm);

    const handleTypeChange = (type: string) => {
        dispatch(setFilterType(type));
    };

    const adjustSliderValue = (newValue: number[]) => {
        if (newValue[0] < newValue[1] - 1) {
            return newValue;
        }
        return newValue[0] >= newValue[1] ? [newValue[1] - 1, newValue[1]] : [newValue[0], newValue[0] + 1];
    };

    const handleValueChange = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setSliderValue(adjustSliderValue(newValue));
        }
    };

    const handleValueChangeCommitted = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            dispatch(changeFilterValue(adjustSliderValue(newValue)));
        }
    };

    const handleTermChange = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setTermValue(adjustSliderValue(newValue));
        }
    };

    const handleTermChangeCommitted = (event: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            dispatch(changeRemainingTerm(adjustSliderValue(newValue)));
        }
    };

    return (
        <Paper square={false} style={{margin: "10px", padding: "30px", marginTop: "10px"}} elevation={4}>
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
                max={100000}
                marks={[{value: 0, label: '0€'}, {value: 25000, label: '25.000€'}, {value: 100000, label: '100.000€'}]}
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
                    {value: 3, label: '3 Monate'},
                    {value: 12, label: '1 Jahr'},
                    {value: 24, label: '2 Jahre'},
                ]}
            />
        </Paper>
    )
}
