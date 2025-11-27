import { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export type RiskToleranceLevel = 1 | 2 | 3 | 4 | 5 | null;

interface RiskToleranceSelectorProps {
  value: RiskToleranceLevel;
  onChange: (level: RiskToleranceLevel) => void;
}

const riskToleranceLabels = {
  1: "Vorsichtig",
  2: "Zurückhaltend",
  3: "Ausgewogen",
  4: "Mutig",
  5: "Erfahren",
} as const;

const riskToleranceDescriptions = {
  1: "Sie bevorzugen maximale Sicherheit und möchten nur Risiken mit sehr geringer Eintrittswahrscheinlichkeit übernehmen. Perfekt für den konservativen Start!",
  2: "Sie fühlen sich wohl mit überschaubaren Risiken, die gut kalkulierbar sind. Ideal für einen ausgewogenen Einstieg in die Community.",
  3: "Sie sind offen für eine ausgewogene Mischung aus Sicherheit und Chance. Sie schätzen faire Risiko-Prämien-Verhältnisse.",
  4: "Sie sind bereit, auch anspruchsvollere Risiken zu übernehmen und schätzen attraktive Prämien. Erfahrung zahlt sich aus!",
  5: "Sie sind ein erfahrener Risikomanager und trauen sich auch komplexe Absicherungen zu. Höchste Prämien für Ihre Expertise!",
} as const;

export function RiskToleranceSelector({ value, onChange }: RiskToleranceSelectorProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <TooltipProvider delayDuration={200}>
      <Box
        sx={{
          backgroundColor: "#fdfcfc",
          border: "2px solid #e6e5e5",
          borderRadius: "16px",
          p: 3,
          transition: "all 0.2s ease",
        }}
      >
        {/* Question */}
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#353131",
            mb: 2,
          }}
        >
          Wie risikobereit sind Sie?
        </Typography>

        {/* Risk Bars */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((bar) => {
            const isActive = value !== null && bar <= value;
            const isHovered = hoveredBar !== null && bar <= hoveredBar;
            
            return (
              <Tooltip key={bar}>
                <TooltipTrigger asChild>
                  <Box
                    onClick={() => onChange(bar as RiskToleranceLevel)}
                    onMouseEnter={() => setHoveredBar(bar)}
                    onMouseLeave={() => setHoveredBar(null)}
                    sx={{
                      flex: 1,
                      height: "16px",
                      borderRadius: "70px",
                      backgroundColor: isActive 
                        ? "#ff671f" 
                        : isHovered 
                        ? "#ffb088" 
                        : "#d9d9d9",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scaleY(1.5)",
                      },
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  className="max-w-xs"
                  style={{
                    backgroundColor: "#fdfcfc",
                    border: "1px solid #e6e5e5",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#ff671f",
                        mb: 0.5,
                      }}
                    >
                      {riskToleranceLabels[bar as keyof typeof riskToleranceLabels]}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        color: "#4f4a4a",
                        lineHeight: 1.5,
                      }}
                    >
                      {riskToleranceDescriptions[bar as keyof typeof riskToleranceDescriptions]}
                    </Typography>
                  </Box>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </Box>

      {/* Selected Info */}
      {value !== null && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid #e6e5e5",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "#4f4a4a",
              lineHeight: 1.5,
            }}
          >
            <Box component="span" sx={{ fontWeight: 600, color: "#ff671f" }}>
              Ihre Auswahl:
            </Box>{" "}
            {riskToleranceLabels[value]} Risikobereitschaft
          </Typography>
        </Box>
      )}
    </Box>
    </TooltipProvider>
  );
}
