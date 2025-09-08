import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import React, { useDeferredValue, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Risk } from "../../models/Risk";
import { mapStatus } from "./utils";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { setFilter } from "../../store/slices/my-risks/reducers";
import { RiskTypeEnum } from "../../enums/RiskType.enum";
import { useTranslation } from "react-i18next";

export interface FilterbarProps {
  myRisks: Risk[];
  type: RiskTypeEnum;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
}

export const FilterBar = (props: FilterbarProps) => {
  const dispatch: AppDispatch = useDispatch();

  const { t } = useTranslation();

  const uniqueSearchParams = useMemo(() => {
    const params: string[] = props.myRisks.reduce((acc: string[], risk) => {
      if (risk.name) acc.push(risk.name);
      if (risk.publisher?.name) acc.push(risk.publisher?.name);
      if (risk.type) acc.push(risk.type.join(", "));
      if (risk.description) acc.push(risk.description);
      if (risk.value != null) acc.push(risk.value.toString());
      if (risk.status != null) acc.push(mapStatus(t, risk.status));
      if (risk.declinationDate)
        acc.push(new Date(risk.declinationDate).toLocaleDateString());
      return acc;
    }, []);

    return Array.from(new Set(params));
  }, [props.myRisks, t]);

  const deferredSearch = useDeferredValue(props.searchInput);

  useEffect(() => {
    dispatch(setFilter(deferredSearch));
  }, [deferredSearch, dispatch]);

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      sx={{
        borderLeft: { md: "1px solid lightgrey" },
        pl: { md: 2 },
        position: { xs: "sticky", md: "static" },
        top: { xs: 0 },
        zIndex: { xs: 1 },
        bgcolor: { xs: "background.paper", md: "transparent" },
      }}
    >
      <Autocomplete
        inputValue={props.searchInput}
        onInputChange={(event, newInputValue) => {
          props.setSearchInput(newInputValue);
        }}
        size="small"
        freeSolo
        options={uniqueSearchParams}
        sx={{ width: { xs: "100%", md: "35%" } }}
        ListboxProps={{ style: { maxHeight: 200, overflow: "auto" } }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(`my_risks.search_label`)}
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
