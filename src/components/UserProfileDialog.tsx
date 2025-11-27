import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { User, getDisplayName } from "./types/user";
import { VerifiedBadge } from "./VerifiedBadge";
import { Risk, categoryLabels } from "./types/risk";
import { communityRisks } from "./lib/community-mock-data";
import { calculateRiskScore, getRiskLevel } from "./types/risk";
import { BaseModal } from "./BaseModal";

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserProfileDialog({ open, onClose, user }: UserProfileDialogProps) {
  if (!user) return null;

  // Get all pending risks from this user
  const userRisks = communityRisks.filter(
    (r) => r.createdByUserId === user.id && r.status === "pending"
  );

  const actions = (
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
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={getDisplayName(user, 'initial')}
      subtitle={`Mitglied seit ${user.memberSince.toLocaleDateString("de-DE", {
        month: "long",
        year: "numeric",
      })}`}
      icon={<PersonIcon sx={{ color: "#e6e5e5", fontSize: 24 }} />}
      actions={actions}
      maxWidth="md"
      showCloseButton
    >
      {/* Profile Avatar Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <VerifiedBadge user={user} avatarSize={120}>
          <Avatar
            src={user.avatar}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #e6e5e5",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </VerifiedBadge>
      </Box>

      {/* Score Section */}
      <Box
        sx={{
          bgcolor: "#f3f2f2",
          borderRadius: 2,
          p: 3,
          mb: 3,
          border: "1px solid #e6e5e5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 1,
              }}
            >
              <StarIcon sx={{ color: "#ff671f", fontSize: 32 }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#353131",
                }}
              >
                {user.score} / 100
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "13px",
                color: "#4f4a4a",
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Vertrauensscore
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 1,
              }}
            >
              <CheckCircleIcon sx={{ color: "#00a63e", fontSize: 32 }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#353131",
                }}
              >
                {user.completedRisks}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "13px",
                color: "#4f4a4a",
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Abgeschlossene Risiken
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bio Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#353131",
            mb: 1.5,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          Über mich
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            color: "#4f4a4a",
            lineHeight: 1.6,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {user.bio}
        </Typography>
      </Box>

      {/* Current Risks Section */}
      <Box>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#353131",
            mb: 2,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          Weitere aktuelle Absicherungen ({userRisks.length})
        </Typography>

        {userRisks.length === 0 ? (
          <Box
            sx={{
              bgcolor: "#f3f2f2",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              border: "1px solid #e6e5e5",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "13px",
                color: "#4f4a4a",
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Keine weiteren aktiven Absicherungen
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {userRisks.map((risk) => {
              const riskScore = calculateRiskScore(risk);
              const riskLevel = getRiskLevel(riskScore);

              return (
                <Box
                  key={risk.id}
                  sx={{
                    bgcolor: "#f3f2f2",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #e6e5e5",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#e6e5e5",
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#353131",
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {risk.title}
                      </Typography>
                      <Chip
                        label={categoryLabels[risk.category]}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "11px",
                          bgcolor: "#cecaca",
                          color: "#353131",
                          fontFamily: "'Roboto', sans-serif",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "13px",
                          color: "#4f4a4a",
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {risk.coverageAmount.toLocaleString("de-DE")} €
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "13px",
                          color: "#4f4a4a",
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        •
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "13px",
                          color: "#4f4a4a",
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {risk.duration} Tag{risk.duration !== 1 ? "e" : ""}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {[...Array(riskLevel)].map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 16,
                          height: 8,
                          bgcolor: "#ff671f",
                          borderRadius: "200px",
                        }}
                      />
                    ))}
                    {[...Array(5 - riskLevel)].map((_, i) => (
                      <Box
                        key={i + riskLevel}
                        sx={{
                          width: 16,
                          height: 8,
                          bgcolor: "#cecaca",
                          borderRadius: "200px",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </BaseModal>
  );
}
