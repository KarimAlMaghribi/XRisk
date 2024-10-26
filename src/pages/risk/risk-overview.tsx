import Grid from "@mui/material/Grid2";
import {RiskOverviewHeader} from "../../components/risk/risk-overview-header";
import {RiskOverviewElement} from "../../components/risk/risk-overview-element";
import React from "react";
import {RiskOverviewFilter} from "../../components/risk/risk-overview-filter";

export const RiskOverview = () => {
    return (
        <Grid container>
            <Grid size={{xs: 12}}>
                <RiskOverviewHeader/>
            </Grid>
            <Grid size={{xs: 12, md: 2}}>
                <RiskOverviewFilter/>
            </Grid>
            <Grid size={{xs: 12, md: 10}}>
                <RiskOverviewElement/>
            </Grid>
        </Grid>
    )
}
