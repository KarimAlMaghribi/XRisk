import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  CalendarMonth as CalendarIcon,
  EuroSymbol as EuroIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Risk, calculateRiskScore, getRiskLevel, categoryLabels } from "../types/risk";
import { users } from "../lib/user-mock-data";
import { offers as allOffers } from "../lib/offers-mock-data";
import { BaseModal } from "./BaseModal";
import { OfferDetailsCard } from "./OfferDetailsCard";

interface RiskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  risk: Risk | null;
  onTakeRisk: (risk: Risk) => void;
  onUserClick: (userId: string) => void;
}

export function RiskDetailDialog({
  open,
  onClose,
  risk,
  onTakeRisk,
  onUserClick,
}: RiskDetailDialogProps) {
  if (!risk) return null;

  const riskScore = calculateRiskScore(risk);
  const riskLevel = getRiskLevel(riskScore);
  const user = users[risk.createdByUserId];

  const getRiskLevelColor = (level: number) => {
    if (level === 1) return "#00a63e";
    if (level === 2) return "#7cb342";
    if (level === 3) return "#fdd835";
    if (level === 4) return "#fb8c00";
    return "#f54900";
  };

  const getRiskLevelLabel = (level: number) => {
    if (level === 1) return "Sehr niedrig";
    if (level === 2) return "Niedrig";
    if (level === 3) return "Mittel";
    if (level === 4) return "Hoch";
    return "Sehr hoch";
  };

  const actions = (
    <>
      <Button
        variant="outlined"
        onClick={onClose}
        sx={{
          borderColor: "#e6e5e5",
          color: "#353131",
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          "&:hover": {
            borderColor: "#cecaca",
            bgcolor: "transparent",
          },
        }}
      >
        Schließen
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          onTakeRisk(risk);
          onClose();
        }}
        sx={{
          bgcolor: "#ff671f",
          color: "#e6e5e5",
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          "&:hover": {
            bgcolor: "#ff671f",
            opacity: 0.9,
          },
        }}
      >
        Risiko übernehmen
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Risiko Details"
      icon={<InfoIcon sx={{ color: "#e6e5e5", fontSize: 24 }} />}
      actions={actions}
      maxWidth="md"
      showCloseButton
    >
      {/* Images Gallery */}
      {risk.images && risk.images.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: risk.images.length === 1 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
              mb: 3,
            }}
          >
            {risk.images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`${risk.title} - Bild ${index + 1}`}
                sx={{
                  width: "100%",
                  height: risk.images!.length === 1 ? 400 : 250,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #e6e5e5",
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Title and Category */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#353131",
            mb: 1,
          }}
        >
          {risk.title}
        </Typography>
        <Chip
          label={categoryLabels[risk.category]}
          size="small"
          sx={{
            bgcolor: "#f3f2f2",
            color: "#4f4a4a",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "12px",
            height: 24,
          }}
        />
      </Box>

      {/* Description */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            color: "#4f4a4a",
            lineHeight: 1.6,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {risk.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Risk Details Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 3,
          mb: 3,
        }}
      >
        {/* Coverage Amount */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <EuroIcon sx={{ fontSize: 16, color: "#4f4a4a" }} />
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "12px",
                color: "#4f4a4a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Versicherungswert
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#353131",
            }}
          >
            {risk.coverageAmount.toLocaleString("de-DE")} €
          </Typography>
        </Box>

        {/* Premium */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <InfoIcon sx={{ fontSize: 16, color: "#4f4a4a" }} />
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "12px",
                color: "#4f4a4a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Prämie
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#ff671f",
            }}
          >
            {risk.premium.toLocaleString("de-DE")} €
          </Typography>
        </Box>

        {/* Duration */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: "#4f4a4a" }} />
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "12px",
                color: "#4f4a4a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Laufzeit
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#353131",
            }}
          >
            {risk.duration} {risk.duration === 1 ? "Tag" : "Tage"}
          </Typography>
        </Box>

        {/* Risk Assessment */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "12px",
                color: "#4f4a4a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Vertrauensscore
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#353131",
              mb: 2,
            }}
          >
            {riskScore} / 100
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "12px",
                color: "#4f4a4a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Risikoeinschätzung
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: i < riskLevel ? getRiskLevelColor(riskLevel) : "#f3f2f2",
                  border: "1px solid",
                  borderColor: i < riskLevel ? getRiskLevelColor(riskLevel) : "#e6e5e5",
                }}
              />
            ))}
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                color: "#4f4a4a",
                ml: 1,
              }}
            >
              {getRiskLevelLabel(riskLevel)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* User Info */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "12px",
            color: "#4f4a4a",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: 2,
          }}
        >
          Risikogeber
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "#f3f2f2",
            borderRadius: 2,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              bgcolor: "#e6e5e5",
            },
          }}
          onClick={() => onUserClick(risk.createdByUserId)}
        >
          <VerifiedBadge user={user} avatarSize={48}>
            <Avatar
              src={user?.avatar}
              alt={risk.createdBy}
              sx={{ width: 48, height: 48 }}
            />
          </VerifiedBadge>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px",
                fontWeight: 500,
                color: "#353131",
              }}
            >
              {risk.createdBy}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                component="svg"
                sx={{ width: 12, height: 12 }}
                fill="none"
                viewBox="0 0 8 8"
              >
                <path
                  d="M3.33333 0L4.36333 2.08667L6.66667 2.42333L5 4.04667L5.39333 6.34L3.33333 5.25667L1.27333 6.34L1.66667 4.04667L0 2.42333L2.30333 2.08667L3.33333 0Z"
                  fill="#4F4A4A"
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  color: "#4f4a4a",
                }}
              >
                4.8
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "12px",
              color: "#4f4a4a",
            }}
          >
            Profil ansehen →
          </Typography>
        </Box>
      </Box>

      {/* Created Date */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <CalendarIcon sx={{ fontSize: 16, color: "#4f4a4a" }} />
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            color: "#4f4a4a",
          }}
        >
          Erstellt am {risk.createdAt.toLocaleDateString("de-DE")}
        </Typography>
      </Box>

      {/* Offers Section */}
      {(() => {
        const riskOffers = allOffers.filter(o => o.riskId === risk.id);
        if (riskOffers.length > 0) {
          // Calculate recommended premium range (±15% of original premium)
          const recommendedMin = Math.round(risk.premium * 0.85);
          const recommendedMax = Math.round(risk.premium * 1.15);

          return (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#4f4a4a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 2,
                }}
              >
                Eingegangene Angebote ({riskOffers.length})
              </Typography>
              <Stack spacing={2}>
                {riskOffers.map((offer) => (
                  <OfferDetailsCard
                    key={offer.id}
                    offer={{
                      riskTitle: risk.title,
                      riskCategory: categoryLabels[risk.category],
                      riskLevel: getRiskLevel(calculateRiskScore(risk)),
                      coverageAmount: risk.coverageAmount,
                      offeredPremium: offer.premium,
                      recommendedPriceRange: {
                        min: recommendedMin,
                        max: recommendedMax,
                      },
                      coverageTypes: offer.coverageTypes,
                      status: offer.status,
                    }}
                    showActions={false}
                  />
                ))}
              </Stack>
            </>
          );
        }
        return null;
      })()}
    </BaseModal>
  );
}
