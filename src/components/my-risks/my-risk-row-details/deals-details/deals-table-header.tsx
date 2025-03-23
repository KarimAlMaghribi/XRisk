import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import { elementBottomMargin } from "../../../risk/risk-overview-element";
import React from "react";
import { Trans } from "react-i18next";

export const DealsTableHeader = () => {
  return (
    <Grid container sx={{ width: "100%", minWidth: 0 }}>
      <Grid size={1}>
        <Typography
          variant="body2"
          sx={{
            marginBottom: `${elementBottomMargin - 15}px`,
            paddingTop: "20px",
          }}
        >
          <Trans i18nKey="my_risks.number" />
        </Typography>
      </Grid>
      <Grid size={1}>
        <Typography
          variant="body2"
          sx={{
            marginBottom: `${elementBottomMargin - 15}px`,
            paddingTop: "20px",
          }}
        >
          <Trans i18nKey="my_risks.risk_taker" />
        </Typography>
      </Grid>
      <Grid size={2}>
        <Typography
          variant="body2"
          sx={{
            marginBottom: `${elementBottomMargin - 15}px`,
            paddingTop: "20px",
          }}
        >
          <Trans i18nKey="my_risks.title" />
        </Typography>
      </Grid>
      <Grid size={4}>
        <Typography
          variant="body2"
          sx={{
            marginBottom: `${elementBottomMargin - 15}px`,
            paddingTop: "20px",
          }}
        >
          <Trans i18nKey="my_risks.last_message" />
        </Typography>
      </Grid>
      <Grid size={1}>
        <Typography
          variant="body2"
          sx={{
            marginBottom: `${elementBottomMargin - 15}px`,
            paddingTop: "20px",
          }}
        >
          <Trans i18nKey="my_risks.start" />
        </Typography>
      </Grid>
      <Grid size={1}>
        <Typography
          variant="body2"
          sx={{
            marginBottom: `${elementBottomMargin - 15}px`,
            paddingTop: "20px",
          }}
        >
          <Trans i18nKey="my_risks.last_activity" />
        </Typography>
      </Grid>
    </Grid>
  );
};
