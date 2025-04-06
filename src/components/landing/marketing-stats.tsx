import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {Typography} from "@mui/material";
import CurvyLines from "../../assests/imgs/appCurvyLines.png";
import contracts from "../../assests/imgs/commercial/running_contracts.jpg";
import happyUsers from "../../assests/imgs/commercial/users-min.jpg";
import secured from "../../assests/imgs/commercial/secured.jpg";
import {useEffect} from "react";
import {fetchUserCount} from "../../store/slices/meta/thunks";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {selectUserCount} from "../../store/slices/meta/selectors";
import { Trans } from 'react-i18next';
import {fetchAgreedRisks} from "../../store/slices/risks/thunks";
import {selectRiskStats} from "../../store/slices/risks/selectors";
import {RiskStats} from "../../store/slices/risks/types";
import {formatEuro} from "../my-risks/my-risk-row-details/agreement-details/agreement-table";


const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5,
};

function MarketingStats() {
    const dispatch: AppDispatch = useDispatch();
    const userCount: number | null = useSelector(selectUserCount);
    const riskStats: RiskStats = useSelector(selectRiskStats);

    useEffect(() => {
       dispatch(fetchUserCount());
       dispatch(fetchAgreedRisks());
    }, []);

    const lightOrange = "#ffd7bb";

    return (
        <Box
            component="section"
            sx={{ display: 'flex', overflow: 'hidden', bgcolor: lightOrange }}>
            <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
                <Box
                    component="img"
                    src={CurvyLines}
                    sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
                />
                <Grid container spacing={7}>
                    {[{
                        img: happyUsers,
                        alt: "suitcase",
                        labelKey: "homepage.user_figure_text",
                        value: userCount
                    }, {
                        img: secured,
                        alt: "graph",
                        labelKey: "homepage.couple_figure_text",
                        value: formatEuro(riskStats?.amountCovered)
                    }, {
                        img: contracts,
                        alt: "clock",
                        labelKey: "homepage.contract_figure_text",
                        value: riskStats?.successfulRiskTransfers
                    }].map((itemData, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box sx={item}>
                                <Box
                                    component="img"
                                    src={itemData.img}
                                    alt={itemData.alt}
                                    sx={{ height: 150, borderRadius: "10px" }}
                                />
                                <Box sx={{
                                    height: 60,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    mt: 4
                                }}>
                                    <Typography variant="h5">
                                        <Trans i18nKey={itemData.labelKey} />
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ mt: 2 }}>
                                    {itemData.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default MarketingStats;
