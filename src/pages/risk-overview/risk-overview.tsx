import Grid from "@mui/material/Grid2";
import {RiskOverviewHeader} from "../../components/risk/risk-overview-header";
import {RiskOverviewElement} from "../../components/risk/risk-overview-element";
import React, {useEffect} from "react";
import {RiskOverviewFilter} from "../../components/risk/risk-overview-filter";
import {Risk} from "../../models/Risk";
import {useDispatch, useSelector} from "react-redux";
import {FetchStatus} from "../../types/FetchStatus";
import Button from "@mui/material/Button";
import {MyRiskCreationDialog} from "../../components/my-risks/creation-dialog/my-risk-creation-dialog";
import {AppDispatch} from "../../store/store";
import {fetchProviderChats} from "../../store/slices/my-bids/thunks";
import {
    selectFilteredRisks,
    selectFilterTypes,
    selectFilterValue,
    selectRemainingTerm, selectShowTaken,
    selectStatus
} from "../../store/slices/risks/selectors";
import {subscribeToRisks} from "../../store/slices/risks/thunks";
import {fetchHighestRiskValue} from "../../store/slices/meta/thunks";
import { Trans } from "react-i18next";

export const RiskOverview = () => {
    const dispatch: AppDispatch = useDispatch();
    const filteredRisks: Risk[] = useSelector(selectFilteredRisks);
    const status: FetchStatus = useSelector(selectStatus);
    const filterTypes: string[] = useSelector(selectFilterTypes);
    const filterValue: number | number[] = useSelector(selectFilterValue);
    const filterRemainingTerm: number | number[] = useSelector(selectRemainingTerm);
    const showTaken: boolean = useSelector(selectShowTaken);
    const [openRiskCreationDialog, setOpenRiskCreationDialog] = React.useState(false);

    useEffect(() => {
        dispatch(fetchProviderChats());
        dispatch(fetchHighestRiskValue());
    }, [dispatch]);

    useEffect(() => {
        let unsubscribeFn: (() => void) | void;
        (async () => {
            unsubscribeFn = await dispatch(subscribeToRisks()).unwrap();
        })();

        return () => {
            if (unsubscribeFn) {
                unsubscribeFn();
            }
        };
    }, [dispatch]);

    const handleClose = () => {
        setOpenRiskCreationDialog(false);
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Grid
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: { xs: 2, md: 4 }
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setOpenRiskCreationDialog(true)}
                            fullWidth
                            sx={{ borderRadius: 1 }}
                        >
                            <Trans i18nKey="risk_exchange.define_risk"></Trans>
                        </Button>
                    </Grid>

                    <RiskOverviewFilter
                        types={filterTypes}
                        value={filterValue}
                        remainingTerm={filterRemainingTerm}
                        showTaken={showTaken}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                    <RiskOverviewHeader />
                    <RiskOverviewElement
                        risks={filteredRisks}
                        status={status}
                    />
                </Grid>
            </Grid>
            <MyRiskCreationDialog
                open={openRiskCreationDialog}
                handleClose={handleClose}
            />
        </React.Fragment>
    )
}
