import Grid from "@mui/material/Grid2";
import React, { useEffect } from "react";
import {
    Box,
    Button,
    IconButton,
    SwipeableDrawer,
    Typography,
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { useTheme } from "@mui/material/styles";
import { Trans } from "react-i18next";

import { RiskOverviewHeader } from "../../components/risk/risk-overview-header";
import { RiskOverviewElement } from "../../components/risk/risk-overview-element";
import { RiskOverviewFilter } from "../../components/risk/risk-overview-filter";
import { MyRiskCreationDialog } from "../../components/my-risks/creation-dialog/my-risk-creation-dialog";

import { Risk } from "../../models/Risk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { FetchStatus } from "../../types/FetchStatus";
import {
    selectFilteredRisks,
    selectFilterTypes,
    selectFilterValue,
    selectRemainingTerm,
    selectShowTaken,
    selectStatus,
} from "../../store/slices/risks/selectors";
import { fetchProviderChats } from "../../store/slices/my-bids/thunks";
import { fetchHighestRiskValue } from "../../store/slices/meta/thunks";
import { subscribeToRisks } from "../../store/slices/risks/thunks";

export const RiskOverview = () => {
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const filteredRisks: Risk[] = useSelector(selectFilteredRisks);
    const status: FetchStatus = useSelector(selectStatus);
    const filterTypes: string[] = useSelector(selectFilterTypes);
    const filterValue: number | number[] = useSelector(selectFilterValue);
    const filterRemainingTerm: number | number[] = useSelector(selectRemainingTerm);
    const showTaken: boolean = useSelector(selectShowTaken);

    const [openRiskCreationDialog, setOpenRiskCreationDialog] = React.useState(false);
    const [filterOpen, setFilterOpen] = React.useState(false);

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
            if (unsubscribeFn) unsubscribeFn();
        };
    }, [dispatch]);

    const handleCloseCreation = () => setOpenRiskCreationDialog(false);

    return (
        <>
            <Grid container spacing={2} sx={{ px: { xs: 1, md: 2 }, py: 2 }}>
                {/* Sidebar (Desktop) */}
                {isDesktop && (
                    <Grid
                        size={{ xs: 12, md: 3 }}
                        sx={{
                            position: "sticky",
                            top: 16,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: { xs: 2, md: 2 },
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => setOpenRiskCreationDialog(true)}
                                fullWidth
                                sx={{ borderRadius: 2 }}
                            >
                                <Trans i18nKey="risk_exchange.define_risk" />
                            </Button>
                        </Box>

                        <RiskOverviewFilter
                            types={filterTypes}
                            value={filterValue}
                            remainingTerm={filterRemainingTerm}
                            showTaken={showTaken}
                        />
                    </Grid>
                )}

                {/* Content */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {/* Page Toolbar */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            <Trans i18nKey="risk_exchange.title" defaults="Risiken" />{" "}
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                ({filteredRisks.length})
                            </Typography>
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            {!isDesktop && (
                                <Button
                                    variant="outlined"
                                    startIcon={<TuneIcon />}
                                    onClick={() => setFilterOpen(true)}
                                >
                                    <Trans i18nKey="risk_exchange.filter" defaults="Filter" />
                                </Button>
                            )}
                            {isDesktop ? null : (
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenRiskCreationDialog(true)}
                                >
                                    <Trans i18nKey="risk_exchange.define_risk" />
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Sticky list header */}
                    <Box
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            bgcolor: "background.paper",
                            borderBottom: (t) => `1px solid ${t.palette.divider}`,
                        }}
                    >
                        <RiskOverviewHeader />
                    </Box>

                    {/* List */}
                    <RiskOverviewElement risks={filteredRisks} status={status} />
                </Grid>
            </Grid>

            {/* Mobile Filter Drawer */}
            {!isDesktop && (
                <SwipeableDrawer
                    anchor="right"
                    open={filterOpen}
                    onOpen={() => setFilterOpen(true)}
                    onClose={() => setFilterOpen(false)}
                    PaperProps={{
                        sx: {
                            width: "100%",
                            maxWidth: 420,
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                        },
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: (t) => `1px solid ${t.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            <Trans i18nKey="risk_exchange.filter" defaults="Filter" />
                        </Typography>
                        <IconButton onClick={() => setFilterOpen(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 2, pb: 10 }}>
                        <RiskOverviewFilter
                            types={filterTypes}
                            value={filterValue}
                            remainingTerm={filterRemainingTerm}
                            showTaken={showTaken}
                        />
                    </Box>

                    {/* Drawer actions */}
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            bgcolor: "background.paper",
                            borderTop: (t) => `1px solid ${t.palette.divider}`,
                        }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setFilterOpen(false)}
                        >
                            <Trans i18nKey="common.apply" defaults="Übernehmen" />
                        </Button>
                    </Box>
                </SwipeableDrawer>
            )}

            <MyRiskCreationDialog
                open={openRiskCreationDialog}
                handleClose={handleCloseCreation}
            />
        </>
    );
};
