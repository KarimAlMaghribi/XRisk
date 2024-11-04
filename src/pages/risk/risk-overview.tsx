import Grid from "@mui/material/Grid2";
import {RiskOverviewHeader} from "../../components/risk/risk-overview-header";
import {RiskOverviewElement} from "../../components/risk/risk-overview-element";
import React from "react";
import {RiskOverviewFilter} from "../../components/risk/risk-overview-filter";
import {
    selectFilteredRisks,
    selectFilterTypes,
    selectFilterValue, selectRemainingTerm,
    selectRisks,
    selectStatus
} from "../../store/slices/risk-overview";
import {Risk} from "../../models/Risk";
import {useSelector} from "react-redux";
import {FetchStatus} from "../../types/FetchStatus";
import {RiskOverviewFilterTypes} from "../../models/RiskOverviewFilterType";
import Button from "@mui/material/Button";
import {RiskCreationDialog} from "../../components/risk/risk-creation-dialog";
import {Divider} from "@mui/material";

export const RiskOverview = () => {
    const filteredRisks: Risk[] = useSelector(selectFilteredRisks);
    const status: FetchStatus = useSelector(selectStatus);
    const filterTypes: RiskOverviewFilterTypes[] = useSelector(selectFilterTypes);
    const filterValue: number | number[] = useSelector(selectFilterValue);
    const filterRemainingTerm: number | number[]  = useSelector(selectRemainingTerm);
    const [openRiskCreationDialog, setOpenRiskCreationDialog] = React.useState(false);

    const handleClose = () => {
        setOpenRiskCreationDialog(false);
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid size={{xs: 12, md: 2}}>
                    <Grid style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: "63px", margin: '5px'}}>
                        <Button variant="contained" onClick={() => setOpenRiskCreationDialog(true)}>
                            Risiko definieren!
                        </Button>
                    </Grid>

                    <Divider style={{margin: "0 25px 0 25px"}}/>

                    <RiskOverviewFilter
                        types={filterTypes}
                        value={filterValue}
                        remainingTerm={filterRemainingTerm}
                    />
                </Grid>
                <Grid size={{xs: 10}}>
                    <RiskOverviewHeader />
                    <RiskOverviewElement
                        risks={filteredRisks}
                        status={status}/>
                </Grid>
            </Grid>
            <RiskCreationDialog open={openRiskCreationDialog} handleClose={handleClose} />
        </React.Fragment>
    )
}
