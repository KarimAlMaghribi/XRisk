import Grid from "@mui/material/Grid2";
import {RiskOverviewHeader} from "../../components/risk/risk-overview-header";
import {RiskOverviewElement} from "../../components/risk/risk-overview-element";
import React from "react";
import {RiskOverviewFilter} from "../../components/risk/risk-overview-filter";
import {
    selectFilterTypes,
    selectFilterValue, selectRemainingTerm,
    selectRisks,
    selectStatus
} from "../../store/slices/risk-overview";
import {Risk} from "../../models/Risk";
import {useSelector} from "react-redux";
import {FetchStatus} from "../../types/FetchStatus";
import {RiskOverviewFilterTypes} from "../../models/RiskOverviewFilterType";

export const RiskOverview = () => {
    const risks: Risk[] = useSelector(selectRisks);
    const status: FetchStatus = useSelector(selectStatus);
    const filterTypes: RiskOverviewFilterTypes[] = useSelector(selectFilterTypes);
    const filterValue: number | number[] = useSelector(selectFilterValue);
    const filterRemainingTerm: number | number[]  = useSelector(selectRemainingTerm);

    return (
        <Grid container>
            <Grid size={{xs: 12, md: 2}}>
                <RiskOverviewFilter
                    types={filterTypes}
                    value={filterValue}
                    remainingTerm={filterRemainingTerm}
                />
            </Grid>
            <Grid size={{xs: 10}}>
                <RiskOverviewHeader />
                <RiskOverviewElement
                    risks={risks}
                    status={status}/>
            </Grid>

        </Grid>
    )
}
