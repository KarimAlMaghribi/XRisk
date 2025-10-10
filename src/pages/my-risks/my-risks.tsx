import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Tab, Container } from "@mui/material";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Trans } from "react-i18next";
import i18next from "i18next";

import { Risk } from "../../models/Risk";
import { RiskTypeEnum } from "../../enums/RiskType.enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchMyOfferedRisks } from "../../store/slices/my-risks/thunks";
import { fetchMyTakenRisks } from "../../store/slices/risks/thunks";
import { fetchMyChats } from "../../store/slices/my-bids/thunks";
import {
  selectMyFilteredOfferedRisks,
  selectMyFilteredTakenRisks,
  selectMyOfferedRisks,
  selectMyTakenRisks,
} from "../../store/slices/my-risks/selectors";
import { clearMyRiskFilter } from "../../store/slices/my-risks/reducers";

import { Panel } from "../../components/my-risks/panel";
import { FilterBar } from "../../components/my-risks/filterBar";
// Falls dein Filter-Component "Filterbar" (kleines b) exportiert, dann so importieren:
// import { Filterbar as FilterBar } from "../../components/my-risks/filterBar";
import { MyRiskCreationDialog } from "../../components/my-risks/creation-dialog/my-risk-creation-dialog";

const MyRisks: React.FC = () => {
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
  }, [dispatch]);

  const handleOpenDialog = () => setOpenRiskCreationDialog(true);

  const handleCloseDialog = () => {
    setOpenRiskCreationDialog(false);
    dispatch(clearMyRiskFilter());
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: RiskTypeEnum) => {
    setSearchInput("");
    setTab(newValue);
    dispatch(clearMyRiskFilter());
  };

  return (
      <React.Fragment>
        <Container maxWidth="lg">
          <Grid
              container
              spacing={{ xs: 1, md: 2 }}
              sx={{ px: { xs: 1, md: 4 }, py: { xs: 1.5, md: 2 } }}
          >
            <Grid size={{ xs: 12, md: 2 }} sx={{ display: "flex", alignItems: "center" }}>
              <Button onClick={handleOpenDialog} fullWidth variant="outlined" sx={{ borderRadius: 1 }}>
                <Trans i18nKey="risk_exchange.define_risk" />
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 10 }} sx={{ mt: { xs: 1, md: 0 } }}>
              <FilterBar
                  key={tab}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  myRisks={tab === RiskTypeEnum.OFFERED ? myOfferedRisks : myTakenRisks}
                  type={tab}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ width: "100%", typography: "body1", mt: 2, mx: { xs: 0, md: 4 } }}>
                {/* Wenn RiskTypeEnum nicht string-basiert ist, casten: */}
                <TabContext value={tab as unknown as string}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                        onChange={handleTabChange}
                        variant="scrollable"
                        allowScrollButtonsMobile
                        aria-label={t("my_risks.tabs_aria_label", { defaultValue: "Meine Risiken Tabs" })}
                    >
                      <Tab sx={{ fontWeight: "bold" }} label={`${t("my_risks.OFFERED_RISKS")}`} value={RiskTypeEnum.OFFERED} />
                      <Tab sx={{ fontWeight: "bold" }} label={`${t("my_risks.TAKEN_RISKS")}`} value={RiskTypeEnum.TAKEN} />
                    </TabList>
                  </Box>

                  <TabPanel value={RiskTypeEnum.OFFERED} sx={{ px: 0, py: { xs: 1, md: 2 } }}>
                    <Panel
                        risks={myFilteredOfferedRisks.length > 0 ? myFilteredOfferedRisks : myOfferedRisks}
                        type={RiskTypeEnum.OFFERED}
                    />
                  </TabPanel>

                  <TabPanel value={RiskTypeEnum.TAKEN} sx={{ px: 0, py: { xs: 1, md: 2 } }}>
                    <Panel
                        risks={myFilteredTakenRisks.length > 0 ? myFilteredTakenRisks : myTakenRisks}
                        type={RiskTypeEnum.TAKEN}
                    />
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <MyRiskCreationDialog open={openRiskCreationDialog} handleClose={handleCloseDialog} />
      </React.Fragment>
  );
};

export default MyRisks;
export { MyRisks };
