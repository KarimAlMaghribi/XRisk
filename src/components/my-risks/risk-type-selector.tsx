import {Autocomplete, TextField} from "@mui/material";
import React, {useState} from "react";

export interface RiskTypeSelectorProps {
    riskType: string;
    setRiskType: (newValue: string) => void;
}

export const RiskTypeSelector = (props: RiskTypeSelectorProps) => {
    const [inputValue, setInputValue] = useState("");
    const [types, setTypes] = useState([
        "Reise",
        "Cyber",
        "Landwirtschaft",
        "Maritim",
        "Event",
        "Finanz",
        "Medizinisch",
        "Weltraum",
        "Automobil",
        "Rechtlich"
    ]);

    const handleAddNewType = (newType: string) => {
        if (!types.includes(newType)) {
            setTypes([...types, newType]);
        }
    };

    return (
        <Autocomplete
            freeSolo
            value={props.riskType}
            onChange={(event: any, newValue: string | null) => {
                if (newValue) {
                    handleAddNewType(newValue);
                    props.setRiskType(newValue);
                }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={types}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Risikoart"
                    fullWidth
                    margin="dense"
                />
            )}
        />
    );
}
