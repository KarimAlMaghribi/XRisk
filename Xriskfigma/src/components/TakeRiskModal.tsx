import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Shield as ShieldIcon,
  TrendingUp,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Risk } from "../types/risk";
import { BaseModal } from "./BaseModal";
import { CURRENT_USER_ID } from "../lib/current-user";

interface TakeRiskModalProps {
  open: boolean;
  onClose: () => void;
  risk: Risk | null;
}

interface CoverageType {
  key: string;
  label: string;
  description: string;
}

const coverageOptions: CoverageType[] = [
  {
    key: "damage",
    label: "Beschädigung (Reparatur)",
    description: "Kosten für Reparatur bei Beschädigung",
  },
  {
    key: "replacement",
    label: "Ersatz",
    description: "Vergleichbares Gerät zur Verfügung stellen",
  },
  {
    key: "lossOrTheft",
    label: "Verlust / Diebstahl",
    description: "Schutz bei Verlust oder Diebstahl",
  },
];

export function TakeRiskModal({ open, onClose, risk }: TakeRiskModalProps) {
  const [premium, setPremium] = useState("");
  const [selectedCoverages, setSelectedCoverages] = useState<string[]>([]);

  if (!risk) return null;

  // Prevent user from taking their own risk
  if (risk.createdByUserId === CURRENT_USER_ID) {
    return null;
  }

  // Calculate recommended premium range (±15% of original premium)
  const recommendedMin = Math.round(risk.premium * 0.85);
  const recommendedMax = Math.round(risk.premium * 1.15);

  const handleCoverageToggle = (key: string) => {
    setSelectedCoverages((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    // Here you would handle the submission
    console.log("Premium:", premium);
    console.log("Coverage Types:", selectedCoverages);
    onClose();
    // Reset form
    setPremium("");
    setSelectedCoverages([]);
  };

  const premiumValue = parseFloat(premium);
  const isInRange = premiumValue >= recommendedMin && premiumValue <= recommendedMax;

  const actions = (
    <>
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          borderColor: "#e6e5e5",
          color: "#353131",
          "&:hover": {
            borderColor: "#353131",
            bgcolor: "transparent",
          },
        }}
      >
        Abbrechen
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!premium || selectedCoverages.length === 0}
        sx={{
          bgcolor: "#ff671f",
          color: "#e6e5e5",
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          "&:hover": {
            bgcolor: "#ff671f",
            opacity: 0.9,
          },
          "&:disabled": {
            bgcolor: "#e6e5e5",
            color: "#4f4a4a",
          },
        }}
      >
        Angebot absenden
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Risiko übernehmen"
      subtitle={risk.title}
      icon={<ShieldIcon sx={{ color: "#e6e5e5", fontSize: 24 }} />}
      actions={actions}
      maxWidth="sm"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Risk Info Summary */}
        <Box
          sx={{
            bgcolor: "#f3f2f2",
            borderRadius: 2,
            p: 2,
            border: "1px solid #e6e5e5",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                color: "#4f4a4a",
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Zu versichernder Wert
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#353131",
              }}
            >
              {risk.coverageAmount.toLocaleString("de-DE")} €
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                color: "#4f4a4a",
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Laufzeit
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#353131",
              }}
            >
              {risk.duration} {risk.duration === 1 ? "Tag" : "Tage"}
            </Typography>
          </Box>
        </Box>

        {/* Premium Input */}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              color: "#353131",
              mb: 1,
              fontVariationSettings: "'wdth' 100",
            }}
          >
            Ihre gewünschte Prämie
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            placeholder="Prämie eingeben"
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
              sx: {
                fontFamily: "'Roboto', sans-serif",
                "& input": {
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&:hover fieldset": {
                  borderColor: "#ff671f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff671f",
                },
              },
            }}
          />

          {/* Premium Recommendation */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#dcfce7",
              borderRadius: 1,
              border: "1px solid #bbf7d0",
              display: "flex",
              gap: 1.5,
            }}
          >
            <TrendingUp sx={{ fontSize: 20, color: "#00a63e", flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#166534",
                  mb: 0.5,
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                Empfohlene Prämienspanne
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                <Chip
                  label={`${recommendedMin} €`}
                  size="small"
                  sx={{
                    bgcolor: "#00a63e",
                    color: "white",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 500,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    color: "#166534",
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  bis
                </Typography>
                <Chip
                  label={`${recommendedMax} €`}
                  size="small"
                  sx={{
                    bgcolor: "#00a63e",
                    color: "white",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#15803d",
                  mt: 1,
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                Basierend auf Risikobewertung, Wert und Laufzeit
              </Typography>
            </Box>
          </Box>

          {/* Premium Warning */}
          {premium && !isInRange && (
            <Alert
              severity="warning"
              sx={{
                mt: 2,
                borderRadius: 1,
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                "& .MuiAlert-message": {
                  fontFamily: "'Roboto', sans-serif",
                  fontVariationSettings: "'wdth' 100",
                },
              }}
            >
              Ihre Prämie liegt außerhalb der empfohlenen Spanne. Dies könnte die Chancen auf Annahme beeinflussen.
            </Alert>
          )}
        </Box>

        {/* Coverage Types - now as Chips */}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              color: "#353131",
              mb: 1.5,
              fontVariationSettings: "'wdth' 100",
            }}
          >
            Was decken Sie ab?
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {coverageOptions.map((option) => {
              const isSelected = selectedCoverages.includes(option.key);
              return (
                <Box
                  key={option.key}
                  onClick={() => handleCoverageToggle(option.key)}
                  sx={{
                    border: "1px solid",
                    borderColor: isSelected ? "#ff671f" : "#e6e5e5",
                    borderRadius: 1,
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    bgcolor: isSelected ? "#fff3e0" : "transparent",
                    "&:hover": {
                      borderColor: "#ff671f",
                      bgcolor: isSelected ? "#fff3e0" : "#f3f2f2",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        mt: 0.25,
                        width: 20,
                        height: 20,
                        borderRadius: "4px",
                        border: "2px solid",
                        borderColor: isSelected ? "#ff671f" : "#cecaca",
                        bgcolor: isSelected ? "#ff671f" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path
                            d="M1 5L4.5 8.5L11 1.5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "14px",
                          color: "#353131",
                          fontWeight: 500,
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "12px",
                          color: "#4f4a4a",
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {selectedCoverages.length === 0 && (
            <Alert
              severity="info"
              icon={<InfoIcon />}
              sx={{
                mt: 2,
                borderRadius: 1,
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                "& .MuiAlert-message": {
                  fontFamily: "'Roboto', sans-serif",
                  fontVariationSettings: "'wdth' 100",
                },
              }}
            >
              Bitte wählen Sie mindestens eine Absicherungsoption
            </Alert>
          )}
        </Box>
      </Box>
    </BaseModal>
  );
}
