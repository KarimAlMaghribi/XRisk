import Grid from "@mui/material/Grid2";
import {RiskOverviewHeader} from "../../components/risk/risk-overview-header";
import {RiskOverviewElement} from "../../components/risk/risk-overview-element";
import React from "react";
import {RiskOverviewFilter} from "../../components/risk/risk-overview-filter";
import {selectRisks, selectStatus} from "../../store/slices/risk-overview";
import {Risk} from "../../models/Risk";
import {useSelector} from "react-redux";
import {FetchStatus} from "../../types/FetchStatus";

export const RiskOverview = () => {
    const risks: Risk[] = useSelector(selectRisks);
    const status: FetchStatus = useSelector(selectStatus);

    return (
        <Grid container>
            <Grid size={{xs: 12, md: 2}}>
                <RiskOverviewFilter/>
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
