import React, {useEffect} from "react";
import Grid from "@mui/material/Grid2";
import {Box, Tab, Typography} from "@mui/material";
import {Risk} from "../../models/Risk";
import {useDispatch, useSelector} from "react-redux";
import {selectMyRisks} from "../../store/slices/my-risks/selectors";
import Button from "@mui/material/Button";
import {MyRiskCreationDialog} from "../../components/my-risks/creation-dialog/my-risk-creation-dialog";
import {AppDispatch} from "../../store/store";
import {fetchMyRisks} from "../../store/slices/my-risks/thunks";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Panel} from "../../components/my-risks/panel";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";


export const MyRisks = () => {
    const dispatch: AppDispatch = useDispatch();
    const myRisks: Risk[] = useSelector(selectMyRisks);
    const [openRiskCreationDialog, setOpenRiskCreationDialog] = React.useState(false);
    const [tab, setTab] = React.useState('1');

    useEffect(() => {
        dispatch(fetchMyRisks());
    }, [dispatch]);

    const handleCloseDialog = () => {
        setOpenRiskCreationDialog(false);
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    return (
        <React.Fragment>
            <Grid container style={{padding: "10px 0 10px 0"}}>
                <Grid size={2}
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: "0 30px 0 30px"
                    }}>
                    <Button
                        onClick={() => setOpenRiskCreationDialog(true)}
                        fullWidth
                        variant="outlined"
                        style={{borderRadius: "5px"}}>
                        RISIKO DEFINIEREN!
                    </Button>
                </Grid>
                <Grid size={10}>
                    <Typography>Filtern und Sortieren</Typography>
                </Grid>
                <Grid size={12}>
                    <Box sx={{ width: '100%', typography: 'body1' }} marginLeft="30px" marginRight="30px" marginTop="10px">
                        <TabContext value={tab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange}>
                                    <Tab sx={{fontWeight: "bold"}} label="Entwürfe" value="1"/>
                                    <Tab sx={{fontWeight: "bold"}} label="Angebotene Risiken" value="2"/>
                                    <Tab sx={{fontWeight: "bold"}} label="Übernommene Risiken" value="3"/>
                                </TabList>
                            </Box>
                            <TabPanel value="1" >
                                <Panel
                                    risks={myRisks.filter(risk => risk.status === RiskStatusEnum.DRAFT) }
                                    type={RiskStatusEnum.DRAFT}
                                />
                            </TabPanel>
                            <TabPanel value="2">
                                <Panel
                                    risks={myRisks.filter(risk => risk.status === RiskStatusEnum.WITHDRAWN || risk.status === RiskStatusEnum.PUBLISHED || risk.status === RiskStatusEnum.DEAL) }
                                    type={RiskStatusEnum.PUBLISHED}
                                />
                            </TabPanel>
                            <TabPanel value="3">
                                <Panel
                                    risks={myRisks.filter(risk => risk.status === RiskStatusEnum.AGREEMENT) }
                                    type={RiskStatusEnum.AGREEMENT}
                                />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Grid>
            </Grid>
            <MyRiskCreationDialog
                open={openRiskCreationDialog}
                handleClose={handleCloseDialog}
            />
        </React.Fragment>
    );
}
