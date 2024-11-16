import { Autocomplete, Chip, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";

export interface RiskTypeSelectorProps {

}

export const RiskTypeSelector = (props: RiskTypeSelectorProps) => {
    const [inputValue, setInputValue] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadTypes = async () => {
            setLoading(true);
            try {
                const fetchedTypes = await fetchTypes();
                setTypes(fetchedTypes);
            } catch (error) {
                console.error("Fehler beim Laden der Typen:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTypes();
    }, [props.fetchTypes]);

    const handleTagsChange = async (event: any, newValue: string[]) => {
        const uniqueTags = newValue.filter((type) => !types.includes(type));
        if (uniqueTags.length > 0) {
            // Speichere jeden neuen Typ in der Datenbank
            for (const newType of uniqueTags) {
                try {
                    await saveType(newType);
                    setTypes((prevTags) => [...prevTags, newType]);
                } catch (error) {
                    console.error(`Fehler beim Speichern des Typs "${newType}":`, error);
                }
            }
        }
        setInputValue(newValue);
    };

    return (
        <Autocomplete
            sx={{ marginTop: "10px" }}
            multiple
            freeSolo
            options={types}
            loading={loading}
            value={inputValue}
            onChange={handleTagsChange}
            renderTags={(value: readonly string[], getTypeProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                        variant="outlined"
                        label={option}
                        {...getTypeProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Typ"
                    placeholder="Risikotyp hinzufügen"
                />
            )}
        />
    );
};
