import React from "react";
import Grid from "@mui/material/Grid2";
import { Typography, Tooltip } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { sortRisks } from "../../store/slices/risks/reducers";
import { RiskOverviewSort } from "../../models/RiskOverviewSort";
import { RiskOverviewHeaderEnum } from "../../enums/RiskOverviewHeader.enum";
import { SortDirectionEnum } from "../../enums/SortDirection.enum";
import { selectSorts } from "../../store/slices/risks/selectors";
import { Trans } from "react-i18next";

export const RiskOverviewHeader: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const sorts: RiskOverviewSort[] = useSelector(selectSorts);

  const backgroundColor = "#fcece4";

  const dirOf = (col: RiskOverviewHeaderEnum): SortDirectionEnum | undefined =>
      sorts.find((s) => s.name === col)?.direction;

  const SortIcon = ({ col }: { col: RiskOverviewHeaderEnum }) => {
    const rotation = dirOf(col) === SortDirectionEnum.ASC ? "180deg" : "0deg";
    return (
        <SwapVertIcon
            sx={{ cursor: "pointer", transition: "transform .2s", transform: `rotate(${rotation})`, ml: 0.5 }}
            onClick={() => dispatch(sortRisks(col))}
        />
    );
  };

  return (
      <Grid
          container
          columns={12}
          sx={{
            bgcolor: backgroundColor,
            py: 1.5,
            px: 2,
            mb: 1.25,
          }}
      >
        {/* Name — immer sichtbar */}
        <Grid size={{ xs: 7, sm: 7, md: 5, lg: 3, xl: 3 }} sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ cursor: "pointer" }} variant="button">
            <Trans i18nKey="terms.NAME" defaults="Name" />
          </Typography>
          <SortIcon col={RiskOverviewHeaderEnum.NAME} />
        </Grid>

        {/* Risikoart — ab lg */}
        <Grid
            size={{ lg: 3, xl: 3 }}
            sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" }, alignItems: "center" }}
        >
          <Tooltip title="Zugeordneter Typ des Risikos">
            <Typography sx={{ cursor: "pointer" }} variant="button">
              <Trans i18nKey="terms.RISK_TYPE" defaults="Risikoart" />
            </Typography>
          </Tooltip>
          <SortIcon col={RiskOverviewHeaderEnum.TYPE} />
        </Grid>

        {/* Absicherungssumme — immer sichtbar */}
        <Grid size={{ xs: 5, sm: 5, md: 3, lg: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-end", sm: "flex-end", md: "flex-start" } }}>
          <Tooltip title="Die Höhe, mit der das Risiko abgesichert werden soll">
            <Typography sx={{ cursor: "pointer" }} variant="button">
              <Trans i18nKey="terms.INSURANCE_SUM" defaults="Absicherungssumme" />
            </Typography>
          </Tooltip>
          <SortIcon col={RiskOverviewHeaderEnum.VALUE} />
        </Grid>

        {/* Fällig am — ab md */}
        <Grid
            size={{ md: 4, lg: 2, xl: 2 }}
            sx={{ display: { xs: "none", sm: "none", md: "flex" }, alignItems: "center" }}
        >
          <Tooltip title="Zeitpunkt, an dem das Risiko abgesichert werden soll">
            <Typography sx={{ cursor: "pointer" }} variant="button">
              <Trans i18nKey="terms.DUE_ON" defaults="Fällig am" />
            </Typography>
          </Tooltip>
          <SortIcon col={RiskOverviewHeaderEnum.DECLINATION_DATE} />
        </Grid>

        {/* Anbieter — nur xl */}
        <Grid
            size={{ xl: 2 }}
            sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "flex" }, alignItems: "center" }}
        >
          <Tooltip title="Person, die das Risiko erstellt und veröffentlicht hat">
            <Typography sx={{ cursor: "pointer" }} variant="button">
              <Trans i18nKey="terms.PROVIDER" defaults="Anbieter" />
            </Typography>
          </Tooltip>
          <SortIcon col={RiskOverviewHeaderEnum.PUBLISHER} />
        </Grid>
      </Grid>
  );
};
