import {Autocomplete, Box, InputAdornment, TextField} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {Risk} from "../../models/Risk";
import {mapStatus} from "./utils";
import {AppDispatch} from "../../store/store";
import {useDispatch} from "react-redux";
import {setFilter} from "../../store/slices/my-risks/reducers";

export interface FilterbarProps {
    myRisks: Risk[];
}

export const FilterBar = (props: FilterbarProps) => {
    const dispatch: AppDispatch = useDispatch();
    const [searchInput, setSearchInput] = React.useState("");

    const searchParams: string[] = props.myRisks.reduce((acc: string[], risk) => {
        if (risk.name) acc.push(risk.name);
        if (risk.publisher?.name) acc.push(risk.publisher?.name);
        if (risk.type) acc.push(risk.type.map((type) => type).join(", "));
        if (risk.description) acc.push(risk.description);
        if (risk.value) acc.push(risk.value.toString());
        if (risk.status) acc.push(mapStatus(risk.status));
        if (risk.declinationDate) acc.push(risk.declinationDate);
        return acc;
    }, []);

    const uniqueSearchParams = Array.from(new Set(searchParams));

    return (
        <Box display="flex" alignItems="center">
            <div style={{borderLeft: "1px solid lightgrey", margin: "0 50px 0 0"}}></div>
            <Autocomplete
                inputValue={searchInput}
                onInputChange={(event, newInputValue) => {
                    setSearchInput(newInputValue);
                }}
                size="small"
                disablePortal
                options={uniqueSearchParams}
                sx={{width: 300}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Suche"
                        onBlur={() => dispatch(setFilter(searchInput))}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
        </Box>
    );
};
