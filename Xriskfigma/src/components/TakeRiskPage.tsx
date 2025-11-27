import { Box, Container, Button, Chip, Avatar, Divider } from "@mui/material";
import { ArrowLeft, Calendar } from "lucide-react";
import { Risk, calculateRiskScore, getRiskLevel, categoryLabels } from "../types/risk";
import { users } from "../lib/user-mock-data";
import { VerifiedBadge } from "./VerifiedBadge";
import { TakeRiskForm } from "./TakeRiskForm";

interface TakeRiskPageProps {
  risk: Risk;
  onBack: () => void;
  onSubmit?: (premium: number, coverages: string[]) => void;
  onUserClick?: (userId: string) => void;
}

export function TakeRiskPage({ risk, onBack, onSubmit, onUserClick }: TakeRiskPageProps) {
  const score = calculateRiskScore(risk);
  const level = getRiskLevel(score);
  const user = users[risk.createdByUserId];

  const handleSubmit = (premium: number, coverages: string[]) => {
    console.log("Submit offer:", { riskId: risk.id, premium, coverages });
    if (onSubmit) {
      onSubmit(premium, coverages);
    }
    // Navigate back after submission
    onBack();
  };

  return (
    <Box sx={{ bgcolor: "#fdfcfc", minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={onBack}
          sx={{
            mb: 3,
            color: "#4f4a4a",
            "&:hover": {
              bgcolor: "rgba(255, 103, 31, 0.08)",
            },
          }}
        >
          Zurück zur Risikobörse
        </Button>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Main Content - Risk Details */}
          <Box sx={{ flex: 1 }}>
            <Box
              className="bg-white relative rounded-[8px]"
              sx={{
                border: "1px solid #e6e5e5",
                p: 4,
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                  <h2 className="text-2xl-semibold flex-1">{risk.title}</h2>
                  <Chip
                    label={categoryLabels[risk.category]}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: "12px",
                      bgcolor: "#e6e5e5",
                      color: "#353131",
                      fontFamily: "'Roboto', sans-serif",
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                </Box>
                <p className="body-base text-secondary">{risk.description}</p>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Details Grid */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 3 }}>
                {/* Value */}
                <Box>
                  <span className="label mb-2 block">Wert</span>
                  <span className="display-value">{risk.coverageAmount.toLocaleString("de-DE")} €</span>
                </Box>

                {/* Duration */}
                <Box>
                  <span className="label mb-2 block">Laufzeit</span>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Calendar className="size-[14px] text-secondary" />
                    <span className="body-base">
                      {risk.duration} {risk.duration === 1 ? "Tag" : "Tage"}
                    </span>
                  </Box>
                </Box>

                {/* Category */}
                <Box>
                  <span className="label mb-2 block">Kategorie</span>
                  <span className="body-base">{categoryLabels[risk.category]}</span>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Risk Assessment */}
              <Box sx={{ mb: 3 }}>
                <span className="label mb-2 block">Risikoeinschätzung</span>
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`basis-0 grow h-[8px] min-h-px min-w-px rounded-[200px] shrink-0 ${
                        i <= level ? "bg-[#ff671f]" : "bg-[#cecaca]"
                      }`}
                    />
                  ))}
                </Box>
              </Box>

              {/* User Profile Section */}
              <Box
                sx={{
                  bgcolor: "#f3f2f2",
                  borderRadius: "8px",
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#e6e5e5",
                  },
                }}
                onClick={() => onUserClick?.(risk.createdByUserId)}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <VerifiedBadge user={user} avatarSize={48}>
                    <Avatar
                      src={user?.avatar}
                      alt={`Profilbild von ${risk.createdBy}`}
                      sx={{
                        width: 48,
                        height: 48,
                      }}
                    />
                  </VerifiedBadge>
                  <Box sx={{ flex: 1 }}>
                    <p className="body-base-medium mb-1">{risk.createdBy}</p>
                    <p className="body-sm">Vertrauensscore: {user?.score || 0} / 100</p>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Sidebar - Take Risk Form */}
          <Box sx={{ width: { xs: "100%", md: "400px" } }}>
            <Box
              className="bg-white rounded-[8px]"
              sx={{
                border: "1px solid #e6e5e5",
                p: 3,
              }}
            >
              <h3 className="text-xl-semibold mb-3">Angebot abgeben</h3>
              <p className="body-sm text-secondary mb-4">
                Geben Sie Ihr Angebot ab und übernehmen Sie dieses Risiko.
              </p>
              
              <TakeRiskForm 
                risk={risk} 
                onSubmit={handleSubmit}
                onCancel={onBack}
                showActions={true}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
