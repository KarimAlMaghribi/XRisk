import React from "react";
import { Box, Typography } from "@mui/material";
import { Risk } from "../../models/Risk";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import { MyRiskRow } from "./my-risk-row";
import { RiskPanelArea } from "../../enums/RiskPanelArea.enum";
import { RiskTypeEnum } from "../../enums/RiskType.enum";
import { useTranslation } from "react-i18next";
import { mapStatus } from "./utils";

export interface PanelProps {
  risks: Risk[];
  type: RiskTypeEnum;
}

export const Panel = (props: PanelProps) => {
  const { t } = useTranslation();
  const getHeaders = (column: number) => {
    if (props.type === RiskTypeEnum.OFFERED) {
      switch (column) {
        case 1:
          return mapStatus(t, RiskStatusEnum.DRAFT);
        case 2:
          return mapStatus(t, RiskStatusEnum.PUBLISHED);
        case 3:
          return mapStatus(t, RiskStatusEnum.WITHDRAWN);
        case 4:
          return mapStatus(t, RiskStatusEnum.DEAL);
        case 5:
          return mapStatus(t, RiskStatusEnum.AGREEMENT);
        default:
          return null;
      }
    }
    if (props.type === RiskTypeEnum.TAKEN) {
      switch (column) {
        case 1:
          return mapStatus(t, RiskStatusEnum.DEAL);
        case 2:
          return mapStatus(t, RiskStatusEnum.AGREEMENT);
        default:
          return null;
      }
    }
  };

  const getRiskRow = (column: number, risk: Risk) => {
    if (props.type === RiskTypeEnum.OFFERED) {
      if (risk.status === RiskStatusEnum.DRAFT && column === 1) {
        return <MyRiskRow risk={risk} />;
      }
      if (risk.status === RiskStatusEnum.PUBLISHED && column === 2) {
        return <MyRiskRow risk={risk} />;
      }
      if (risk.status === RiskStatusEnum.WITHDRAWN && column === 3) {
        return <MyRiskRow risk={risk} />;
      }
      if (risk.status === RiskStatusEnum.DEAL && column === 4) {
        return <MyRiskRow risk={risk} />;
      }
      if (risk.status === RiskStatusEnum.AGREEMENT && column === 5) {
        return <MyRiskRow risk={risk} />;
      }
    } else if (props.type === RiskTypeEnum.TAKEN) {
      if (risk.status !== RiskStatusEnum.AGREEMENT && column === 1) {
        return <MyRiskRow risk={risk} taken={true} />;
      }
      if (risk.status === RiskStatusEnum.AGREEMENT && column === 2) {
        return <MyRiskRow risk={risk} taken={true} />;
      }
    }
    return null;
  };

  const columns =
    props.type === RiskTypeEnum.OFFERED ? [1, 2, 3, 4, 5] : [1, 2];

  return (
    <Box>
      {columns.map((section) => (
        <React.Fragment key={section}>
          <Typography
            variant="button"
            component="div"
            fontWeight="bolder"
            sx={{ mt: 3 }}
          >
            {getHeaders(section)}
          </Typography>
          {props.risks.map((risk) => getRiskRow(section, risk))}
        </React.Fragment>
      ))}
    </Box>
  );
};
