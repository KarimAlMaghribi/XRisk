// src/components/my-risks/panel.tsx
import React, { useMemo } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";

import { Risk } from "../../models/Risk";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import { RiskTypeEnum } from "../../enums/RiskType.enum";
import MyRiskRow from "./my-risk-row";
import { mapStatus } from "./utils";

export interface PanelProps {
  risks: Risk[];
  type: RiskTypeEnum;
}

export const Panel: React.FC<PanelProps> = ({ risks, type }) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { t } = useTranslation();

  // Risiken nach Status gruppieren
  const grouped = useMemo(() => {
    const g: Record<RiskStatusEnum, Risk[]> = {
      [RiskStatusEnum.DRAFT]: [],
      [RiskStatusEnum.PUBLISHED]: [],
      [RiskStatusEnum.WITHDRAWN]: [],
      [RiskStatusEnum.DEAL]: [],
      [RiskStatusEnum.AGREEMENT]: [],
    };
    for (const r of risks) {
      if (r.status != null) g[r.status as RiskStatusEnum].push(r);
    }
    return g;
  }, [risks]);

  // Für "Übernommene Risiken": aktive = alles außer AGREEMENT
  const activeTaken = useMemo(
      () => [
        ...grouped[RiskStatusEnum.DRAFT],
        ...grouped[RiskStatusEnum.PUBLISHED],
        ...grouped[RiskStatusEnum.WITHDRAWN],
        ...grouped[RiskStatusEnum.DEAL],
      ],
      [grouped]
  );

  const isOffered = type === RiskTypeEnum.OFFERED;

  // Sektionen definieren (Reihenfolge)
  const sections =
      isOffered
          ? [
            { key: RiskStatusEnum.DRAFT, label: mapStatus(t, RiskStatusEnum.DRAFT), risks: grouped[RiskStatusEnum.DRAFT] },
            { key: RiskStatusEnum.PUBLISHED, label: mapStatus(t, RiskStatusEnum.PUBLISHED), risks: grouped[RiskStatusEnum.PUBLISHED] },
            { key: RiskStatusEnum.WITHDRAWN, label: mapStatus(t, RiskStatusEnum.WITHDRAWN), risks: grouped[RiskStatusEnum.WITHDRAWN] },
            { key: RiskStatusEnum.DEAL, label: mapStatus(t, RiskStatusEnum.DEAL), risks: grouped[RiskStatusEnum.DEAL] },
            { key: RiskStatusEnum.AGREEMENT, label: mapStatus(t, RiskStatusEnum.AGREEMENT), risks: grouped[RiskStatusEnum.AGREEMENT] },
          ]
          : [
            { key: "active", label: mapStatus(t, RiskStatusEnum.DEAL), risks: activeTaken },
            { key: RiskStatusEnum.AGREEMENT, label: mapStatus(t, RiskStatusEnum.AGREEMENT), risks: grouped[RiskStatusEnum.AGREEMENT] },
          ];

  return (
      <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",             // ALLES untereinander – eine Spalte für alle Breakpoints
            rowGap: { xs: 2, md: 3 },               // großzügiger vertikaler Abstand zwischen Sektionen
          }}
      >
        {sections.map((section) => (
            <Box
                key={String(section.key)}
                sx={{
                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                  rowGap: { xs: 1, md: 1.5 },
                  minWidth: 0,
                }}
            >
              {/* Abschnitt-Label */}
              <Typography
                  variant="overline"
                  component="div"
                  fontWeight="bolder"
                  sx={{ px: { xs: 0.5, md: 0 }, letterSpacing: 0.5 }}
              >
                {section.label}
              </Typography>

              {/* Karten-Container */}
              <Paper
                  variant={mdUp ? "outlined" : "elevation"}
                  elevation={mdUp ? 0 : 1}
                  sx={{
                    p: { xs: 2, md: 3 },               // mehr Innenabstand
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.25, md: 1.5 },        // Abstand zwischen Reihen (MyRiskRow)
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    borderColor: "divider",
                  }}
              >
                {section.risks.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Keine Einträge
                    </Typography>
                ) : (
                    <Stack spacing={{ xs: 1.25, md: 1.5 }}>
                      {section.risks.map((risk, i) => (
                          <MyRiskRow
                              key={risk.id ?? `${section.key}-${i}`}
                              risk={risk}
                              taken={!isOffered}
                              density={isOffered ? "dense" : "roomy"}
                          />
                      ))}
                    </Stack>
                )}
              </Paper>
            </Box>
        ))}
      </Box>
  );
};
