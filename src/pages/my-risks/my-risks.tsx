import React, {useEffect} from "react";
import Grid from "@mui/material/Grid2";
import {Box, Tab, Typography} from "@mui/material";
import {Risk} from "../../models/Risk";
import {useDispatch, useSelector} from "react-redux";
import {
    selectMyFilteredOfferedRisks, selectMyFilteredTakenRisks,
    selectMyOfferedRisks,
    selectMyTakenRisks
} from "../../store/slices/my-risks/selectors";
import Button from "@mui/material/Button";
import {MyRiskCreationDialog} from "../../components/my-risks/creation-dialog/my-risk-creation-dialog";
import {AppDispatch} from "../../store/store";
import {fetchMyOfferedRisks} from "../../store/slices/my-risks/thunks";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Panel} from "../../components/my-risks/panel";
import {fetchMyTakenRisks} from "../../store/slices/risks/thunks";
import {RiskTypeEnum} from "../../enums/RiskType.enum";
import {fetchMyChats} from "../../store/slices/my-bids/thunks";
import {FilterBar} from "../../components/my-risks/filterBar";
import {clearMyRiskFilter} from "../../store/slices/my-risks/reducers";
import { Trans, useTranslation } from "react-i18next";
import i18next from "i18next";
export const MyRisks = () => {
    const dispatch: AppDispatch = useDispatch();
    const myOfferedRisks: Risk[] = useSelector(selectMyOfferedRisks);
    const myFilteredOfferedRisks: Risk[] = useSelector(selectMyFilteredOfferedRisks);
    const myTakenRisks: Risk[] = useSelector(selectMyTakenRisks);
    const myFilteredTakenRisks: Risk[] = useSelector(selectMyFilteredTakenRisks);
    const [searchInput, setSearchInput] = React.useState("");

    const [openRiskCreationDialog, setOpenRiskCreationDialog] = React.useState(false);
    const [tab, setTab] = React.useState<RiskTypeEnum>(RiskTypeEnum.OFFERED);

    const t = i18next.t;

    useEffect(() => {
        dispatch(fetchMyChats());
        dispatch(fetchMyOfferedRisks());
        dispatch(fetchMyTakenRisks());
    }, [dispatch, tab]);


    const handleCloseDialog = () => {
        setOpenRiskCreationDialog(false);
        dispatch(clearMyRiskFilter());
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: RiskTypeEnum) => {
        setSearchInput("");
        setTab(newValue);
        dispatch(clearMyRiskFilter());
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
                        <Trans i18nKey="risk_exchange.define_risk"></Trans>
                    </Button>
                </Grid>
                <Grid size={10} style={{padding: "0 30px 0 30px"}}>
                    <FilterBar
                        key={tab}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        myRisks={tab === RiskTypeEnum.OFFERED ? myOfferedRisks : myTakenRisks}
                        type={tab}/>
                </Grid>
                <Grid size={12}>
                    <Box sx={{ width: '100%', typography: 'body1' }} marginLeft="30px" marginRight="30px" marginTop="10px">
                        <TabContext value={tab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange}>
                                    <Tab sx={{fontWeight: "bold"}} label={`${t("my_risks.OFFERED_RISKS")}`} value={RiskTypeEnum.OFFERED}/>
                                    <Tab sx={{fontWeight: "bold"}} label={`${t("my_risks.TAKEN_RISKS")}`} value={RiskTypeEnum.TAKEN}/>
                                </TabList>
                            </Box>
                            <TabPanel value={RiskTypeEnum.OFFERED}>
                                <Panel risks={myFilteredOfferedRisks.length > 0  ? myFilteredOfferedRisks : myOfferedRisks} type={RiskTypeEnum.OFFERED}/>
                            </TabPanel>
                            <TabPanel value={RiskTypeEnum.TAKEN}>
                                <Panel risks={myFilteredTakenRisks.length > 0 ? myFilteredTakenRisks : myTakenRisks} type={RiskTypeEnum.TAKEN}/>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Grid>
            </Grid>

            <MyRiskCreationDialog
                open={openRiskCreationDialog}
                handleClose={handleCloseDialog}/>
        </React.Fragment>
    );
}

