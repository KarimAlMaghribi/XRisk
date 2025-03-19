import { RiskAgreement } from "../../../../models/RiskAgreement";
import { Risk } from "../../../../models/Risk";
import { Chat } from "../../../../store/slices/my-bids/types";
import { useSelector } from "react-redux";
import { selectRiskAgreementByChatId } from "../../../../store/slices/my-risk-agreements/selectors";
import { AgreementTable } from "./agreement-table";
import React from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Trans } from "react-i18next";
import { t } from "i18next";

export interface AgreementElementProps {
  risk: Risk;
  chat: Chat;
}

export const AgreementElement = (props: AgreementElementProps) => {
  const riskAgreement: RiskAgreement = useSelector(
    selectRiskAgreementByChatId(props.chat.id)
  );

  return (
    <Grid container>
      <Grid size={4}>
        <Grid container>
          <Grid size={4}>
            <Typography variant="subtitle1" fontWeight="bold">
              {t("terms.riskgiver")}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {t("my_risks.last_activity")}
            </Typography>
          </Grid>
          <Grid size={8}>
            <Typography variant="subtitle1">
              {props.chat?.riskProvider?.name}
            </Typography>
            <Typography variant="subtitle1">
              {new Date(props.chat?.lastActivity || "").toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={8}>
        <AgreementTable riskAgreement={riskAgreement} />
      </Grid>
    </Grid>
  );
};
