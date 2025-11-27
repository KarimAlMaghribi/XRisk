import { Box, Avatar, Chip } from "@mui/material";
import { Offer } from "../types/offer";
import { getUserById } from "../lib/database";
import { VerifiedBadge } from "./VerifiedBadge";
import { Check, X } from "lucide-react";

interface OfferDetailsCardProps {
  offer: Offer;
}

export function OfferDetailsCard({ offer }: OfferDetailsCardProps) {
  const user = getUserById(offer.offeredByUserId);

  return (
    <Box
      sx={{
        border: "1px solid #e6e5e5",
        borderRadius: "8px",
        p: 2,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#ff671f",
          boxShadow: "0 2px 8px rgba(255, 103, 31, 0.15)",
        },
      }}
    >
      {/* User Info */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2 }}>
        <VerifiedBadge user={user} avatarSize={32}>
          <Avatar
            src={user?.avatar}
            alt={offer.offeredBy}
            sx={{ width: 32, height: 32 }}
          />
        </VerifiedBadge>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <p className="body-sm-medium truncate">{offer.offeredBy}</p>
          <p className="body-xs text-secondary">
            Score: {user?.score || 0}
          </p>
        </Box>
      </Box>

      {/* Premium */}
      <Box sx={{ mb: 2 }}>
        <span className="label mb-1 block">Prämie</span>
        <p className="text-xl-semibold text-brand">{offer.premium} €</p>
      </Box>

      {/* Coverage Types */}
      {offer.coverageTypes && (
        <Box sx={{ mb: 2 }}>
          <span className="label mb-1 block">Abdeckung</span>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {offer.coverageTypes.damage ? (
                <Check size={14} className="text-success" />
              ) : (
                <X size={14} className="text-secondary" />
              )}
              <span className="body-xs">Beschädigung</span>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {offer.coverageTypes.replacement ? (
                <Check size={14} className="text-success" />
              ) : (
                <X size={14} className="text-secondary" />
              )}
              <span className="body-xs">Ersatz</span>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {offer.coverageTypes.lossOrTheft ? (
                <Check size={14} className="text-success" />
              ) : (
                <X size={14} className="text-secondary" />
              )}
              <span className="body-xs">Verlust/Diebstahl</span>
            </Box>
          </Box>
        </Box>
      )}

      {/* Message */}
      {offer.message && (
        <Box>
          <span className="label mb-1 block">Nachricht</span>
          <p className="body-xs text-secondary">{offer.message}</p>
        </Box>
      )}

      {/* Status Badge */}
      <Box sx={{ mt: 2 }}>
        <Chip
          label={
            offer.status === "pending"
              ? "Ausstehend"
              : offer.status === "accepted"
              ? "Akzeptiert"
              : "Abgelehnt"
          }
          size="small"
          sx={{
            height: 20,
            fontSize: "11px",
            bgcolor:
              offer.status === "pending"
                ? "#fff3e0"
                : offer.status === "accepted"
                ? "#e8f5e9"
                : "#ffebee",
            color:
              offer.status === "pending"
                ? "#ff671f"
                : offer.status === "accepted"
                ? "#00a63e"
                : "#f54900",
            fontWeight: 600,
          }}
        />
      </Box>
    </Box>
  );
}
