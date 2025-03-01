import {Autocomplete, Chip, TextField} from "@mui/material";
import React, {useEffect} from "react";
import {AppDispatch} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {selectStatus, selectTypes} from "../../store/slices/risks/selectors";
import {addRiskType, fetchRiskTypes} from "../../store/slices/risks/thunks";

const riskTypes: string[] = [
    "Sonstiges",
    "Reise",
    "Immobilie",
    "Event",
    "Landwirtschaft",
    "Wetter",
    "IT",
    "Haustiere",
    "Fahrzeug",
    "Recht",
    "Gesundheit",
    "Beruf",
    "Sport",
    "Technik",
    "Diebstahl",
    "Transport",
    "Finanzen",
    "Bildung",
    "Haushalt",
    "Kunst"
]

export interface RiskTypeSelectorProps {
    value: string[];
    setValue: (value: any) => void;
    required?: boolean;
    textFieldVariant?: "standard" | "outlined" | "filled";
    label?: string;
    mode?: "simple" | "complex";
    riskTypeError?: boolean;
    setRiskTypeError?: (value: boolean) => void;
}

export const RiskTypeSelector = (props: RiskTypeSelectorProps) => {
    const { mode = "simple" } = props;
    const dispatch: AppDispatch = useDispatch();
    const types: string[] = useSelector(selectTypes);
    const status: FetchStatusEnum = useSelector(selectStatus);

    useEffect(() => {
        if (mode === "complex") {
            const unsubscribe: any = dispatch(fetchRiskTypes());
            return () => {
                if (typeof unsubscribe === "function") {
                    unsubscribe();
                }
            };
        }
    }, [dispatch, mode]);

    const handleTagsChange = async (event: any, newValue: string[]) => {
        const uniqueTypes: string[] = newValue.filter((type) => !types.includes(type));
        if (uniqueTypes.length > 0) {
            for (const newType of uniqueTypes) {
                try {
                    await dispatch(addRiskType(newType));
                } catch (error) {
                    console.error(`Error saving new riskType: "${newType}":`, error);
                }
            }
        }
        props.setValue(newValue);
    };

    const options = mode === "complex" ? types : riskTypes;
    const freeSolo = mode === "complex";

    return (
        <Autocomplete
            sx={{marginTop: "10px"}}
            multiple
            freeSolo={freeSolo}
            options={options}
            loading={status === FetchStatusEnum.PENDING}
            value={props.value}
            onChange={
                mode === "complex"
                    ? handleTagsChange
                    : (event, newValue) => props.setValue(newValue)
            }
            getOptionLabel={(option: any) => (typeof option === "string" ? option : option?.label || "")}
            renderTags={(value: readonly string[], getTypeProps) =>
                value.map((option: string, index: number) => {
                    const {key, ...tagProps} = getTypeProps({index});
                    return (
                        <Chip
                            key={index}
                            variant="outlined"
                            label={option}
                            {...tagProps}
                        />
                    );
                })
            }
            renderInput={(params) => (
                <TextField
                    error={props.required && props.riskTypeError}
                    helperText={props.required && props.riskTypeError && "Bitte wähle mindestens einen Typen aus"}
                    required={props.required}
                    {...params}
                    variant={props.textFieldVariant || "outlined"}
                    label={props.label || "Typ"}
                    placeholder={props.mode === "complex" ? "Risikotyp hinzufügen" : "Risikotyp auswählen"}
                />
            )}
        />
    );
};

