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

export interface FilterBarProps {
  myRisks: Risk[];
  type: RiskTypeEnum;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
}

export const FilterBar = (props: FilterBarProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();

  const uniqueSearchParams: string[] = useMemo(() => {
    const params: string[] = props.myRisks.reduce((acc: string[], risk) => {
      if (risk.name) acc.push(risk.name);
      if (risk.publisher?.name) acc.push(risk.publisher?.name);
      if (risk.type) acc.push(risk.type.join(", "));
      if (risk.description) acc.push(risk.description);
      if (risk.value != null) acc.push(String(risk.value));
      if (risk.status != null) acc.push(mapStatus(t as any, risk.status));
      if (risk.declinationDate)
        acc.push(new Date(risk.declinationDate).toLocaleDateString("de-DE"));
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
            top: { xs: "calc(56px + env(safe-area-inset-top))" }, // robust unter AppBar
            zIndex: { xs: (theme) => theme.zIndex.appBar - 1 },
            bgcolor: { xs: "background.paper", md: "transparent" },
          }}
      >
        <Autocomplete
            inputValue={props.searchInput}
            onInputChange={(_, newInputValue) => props.setSearchInput(newInputValue)}
            size="small"
            freeSolo
            getOptionLabel={(o) => String(o)}
            filterOptions={(opts) => opts.slice(0, 50)}
            options={uniqueSearchParams}
            sx={{ width: { xs: "100%", sm: "70%", md: "35%" }, my: 1 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={
                      props.type === RiskTypeEnum.OFFERED
                          ? ((t as any)("my_risks.search_placeholder_my_offered") as string)
                          : ((t as any)("my_risks.search_placeholder_my_taken") as string)
                    }
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
