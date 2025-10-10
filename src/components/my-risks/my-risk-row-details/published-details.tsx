import {Risk} from "../../../models/Risk";
import Grid from "@mui/material/Grid2";
import {Typography} from "@mui/material";
import {elementBottomMargin} from "../../risk/risk-overview-element";
import React from "react";
import {Trans} from "react-i18next";

export const PublishedDetails = ({risk}: { risk: Risk }) => {
  return (
      <Grid container spacing={{xs: 1, md: 2}}>
        <Grid size={{xs: 12, md: 6}} sx={{minWidth: 0}}>
          <Typography
              variant="body1"
              sx={{mb: `${elementBottomMargin}px`}}
          >
            <Trans i18nKey="my_risks.description"/>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{wordBreak: "break-word"}}>
            {risk.description}
          </Typography>
        </Grid>

        <Grid size={{xs: 12, md: 6}} sx={{minWidth: 0}}>
          <Typography variant="body1" sx={{mb: {xs: 1, md: 1.5}}}>
            <Trans i18nKey="my_risks.history"/>
          </Typography>

          <Grid container spacing={{xs: 0.5, md: 1}}>
            <Grid size={{xs: 5, md: 4}}>
              <Typography variant="body2" color="text.secondary"
                          sx={{mb: `${elementBottomMargin}px`}}>
                <Trans i18nKey="my_risks.created_at"/>
              </Typography>
              <Typography variant="body2" color="text.secondary"
                          sx={{mb: `${elementBottomMargin}px`}}>
                <Trans i18nKey="my_risks.updated_at"/>
              </Typography>
              <Typography variant="body2" color="text.secondary"
                          sx={{mb: `${elementBottomMargin}px`}}>
                <Trans i18nKey="my_risks.published_at"/>
              </Typography>
            </Grid>

            <Grid size={{xs: 7, md: 8}}>
              <Typography variant="body2" sx={{mb: `${elementBottomMargin}px`}}>
                {risk.createdAt ? new Date(risk.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : "-"}
              </Typography>
              <Typography variant="body2" sx={{mb: `${elementBottomMargin}px`}}>
                {risk.updatedAt ? new Date(risk.updatedAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : "-"}
              </Typography>
              <Typography variant="body2" sx={{mb: `${elementBottomMargin}px`}}>
                {risk.publishedAt ? new Date(risk.publishedAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                }) : "-"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};
