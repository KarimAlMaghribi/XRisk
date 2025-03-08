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


const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5,
};

function MarketingStats() {
    const dispatch: AppDispatch = useDispatch();
    const userCount: number | null = useSelector(selectUserCount);

    useEffect(() => {
       dispatch(fetchUserCount())
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
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <Box
                                component="img"
                                src={happyUsers}
                                alt="suitcase"
                                sx={{ height: 150, borderRadius: "10px" }}
                            />
                            <Typography variant="h5" sx={{ my: 5 }}>
                                <Trans i18nKey="homepage.user_figure_text"></Trans>
                            </Typography>
                            <Typography variant="h4">
                                {userCount}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <Box
                                component="img"
                                src={secured}
                                alt="graph"
                                sx={{ height: 150, borderRadius: "10px"  }}
                            />
                            <Typography variant="h5" sx={{ my: 5 }}>
                                <Trans i18nKey="homepage.couple_figure_text"></Trans>
                            </Typography>
                            <Typography variant="h4">
                                100€
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <Box
                                component="img"
                                src={contracts}
                                alt="clock"
                                sx={{ height: 150, borderRadius: "10px"  }}
                            />
                            <Typography variant="h5" sx={{ my: 5 }} textAlign="center">
                            <Trans i18nKey="homepage.contract_figure_text"></Trans>
                            </Typography>
                            <Typography variant="h4">
                                7
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default MarketingStats;
