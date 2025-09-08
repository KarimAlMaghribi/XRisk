import React, { useMemo } from "react";
import Grid from "@mui/material/Grid2";
import { Paper, Typography } from "@mui/material";
import { Risk } from "../../models/Risk";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import { MyRiskRow } from "./my-risk-row";
import { RiskTypeEnum } from "../../enums/RiskType.enum";
import { useTranslation } from "react-i18next";
import { mapStatus } from "./utils";

export interface PanelProps {
  risks: Risk[];
  type: RiskTypeEnum;
}

export const Panel = ({ risks, type }: PanelProps) => {
  const { t } = useTranslation();

  const groupedRisks = useMemo(() => {
    const groups: Record<RiskStatusEnum, Risk[]> = {
      [RiskStatusEnum.DRAFT]: [],
      [RiskStatusEnum.PUBLISHED]: [],
      [RiskStatusEnum.WITHDRAWN]: [],
      [RiskStatusEnum.DEAL]: [],
      [RiskStatusEnum.AGREEMENT]: [],
    };

    risks.forEach((risk) => {
      if (risk.status != null) {
        groups[risk.status as RiskStatusEnum].push(risk);
      }
    });

    return groups;
  }, [risks]);

  const activeRisks = useMemo(
    () => [
      ...groupedRisks[RiskStatusEnum.DRAFT],
      ...groupedRisks[RiskStatusEnum.PUBLISHED],
      ...groupedRisks[RiskStatusEnum.WITHDRAWN],
      ...groupedRisks[RiskStatusEnum.DEAL],
    ],
    [groupedRisks]
  );

  const mdColumns = type === RiskTypeEnum.OFFERED ? 5 : 2;

  const sections =
    type === RiskTypeEnum.OFFERED
      ? [
          {
            key: RiskStatusEnum.DRAFT,
            label: mapStatus(t, RiskStatusEnum.DRAFT),
            risks: groupedRisks[RiskStatusEnum.DRAFT],
          },
          {
            key: RiskStatusEnum.PUBLISHED,
            label: mapStatus(t, RiskStatusEnum.PUBLISHED),
            risks: groupedRisks[RiskStatusEnum.PUBLISHED],
          },
          {
            key: RiskStatusEnum.WITHDRAWN,
            label: mapStatus(t, RiskStatusEnum.WITHDRAWN),
            risks: groupedRisks[RiskStatusEnum.WITHDRAWN],
          },
          {
            key: RiskStatusEnum.DEAL,
            label: mapStatus(t, RiskStatusEnum.DEAL),
            risks: groupedRisks[RiskStatusEnum.DEAL],
          },
          {
            key: RiskStatusEnum.AGREEMENT,
            label: mapStatus(t, RiskStatusEnum.AGREEMENT),
            risks: groupedRisks[RiskStatusEnum.AGREEMENT],
          },
        ]
      : [
          {
            key: "active",
            label: mapStatus(t, RiskStatusEnum.DEAL),
            risks: activeRisks,
          },
          {
            key: RiskStatusEnum.AGREEMENT,
            label: mapStatus(t, RiskStatusEnum.AGREEMENT),
            risks: groupedRisks[RiskStatusEnum.AGREEMENT],
          },
        ];

  return (
    <Grid container columns={{ xs: 12, md: mdColumns }} spacing={2}>
      {sections.map((section) => (
        <Grid key={String(section.key)} size={{ xs: 12, md: 1 }} sx={{ display: "flex" }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography
              variant="overline"
              component="div"
              fontWeight="bolder"
              sx={{ mb: 1 }}
            >
              {section.label}
            </Typography>
            {section.risks.map((risk, index) => (
              <MyRiskRow
                key={risk.id ?? `${section.key}-${index}`}
                risk={risk}
                taken={type === RiskTypeEnum.TAKEN}
              />
            ))}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

