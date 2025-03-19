import { Risk } from "../../../models/Risk";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import { elementBottomMargin } from "../../risk/risk-overview-element";
import React from "react";
import { Trans } from "react-i18next";

export const PublishedDetails = ({ risk }: { risk: Risk }) => {
  return (
    <Grid container>
      <Grid size={6}>
        <Typography
          variant="body1"
          sx={{ marginBottom: `${elementBottomMargin}px` }}
        >
          <Trans i18nKey="my_risks.description" />
        </Typography>
        <Typography variant="body2" sx={{ color: "grey" }}>
          {risk.description}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body1">
          <Trans i18nKey="my_risks.history" />
        </Typography>
        <br />
        <Grid container>
          <Grid size={4}>
            <Typography
              variant="body2"
              sx={{ color: "grey", marginBottom: `${elementBottomMargin}px` }}
            >
              <Trans i18nKey="my_risks.created_at" />
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey", marginBottom: `${elementBottomMargin}px` }}
            >
              <Trans i18nKey="my_risks.updated_at" />
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey", marginBottom: `${elementBottomMargin}px` }}
            >
              <Trans i18nKey="my_risks.published_at" />
            </Typography>
          </Grid>
          <Grid size={8}>
            <Typography
              variant="body2"
              sx={{ marginBottom: `${elementBottomMargin}px` }}
            >
              {risk.createdAt
                ? new Date(risk.createdAt).toLocaleDateString()
                : "-"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: `${elementBottomMargin}px` }}
            >
              {risk.updatedAt
                ? new Date(risk.updatedAt).toLocaleDateString()
                : "-"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: `${elementBottomMargin}px` }}
            >
              {risk.publishedAt
                ? new Date(risk.publishedAt).toLocaleDateString()
                : "-"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
