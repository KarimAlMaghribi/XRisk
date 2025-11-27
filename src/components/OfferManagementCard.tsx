import { useState } from "react";
import { Box, Avatar, Chip, Button, TextField, Collapse, IconButton } from "@mui/material";
import { Offer } from "./types/offer";
import { getUserById } from "./lib/database";
import { VerifiedBadge } from "./VerifiedBadge";
import { Check, X, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface OfferManagementCardProps {
  offer: Offer;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  onSendMessage?: (offerId: string, message: string) => void;
}

export function OfferManagementCard({ offer, onAccept, onReject, onSendMessage }: OfferManagementCardProps) {
  const user = getUserById(offer.offeredByUserId);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleAccept = () => {
    if (onAccept) {
      onAccept(offer.id);
    }
    toast.success(`Angebot von ${offer.offeredBy} wurde akzeptiert`);
  };

  const handleReject = () => {
    if (onReject) {
      onReject(offer.id);
    }
    toast.success(`Angebot von ${offer.offeredBy} wurde abgelehnt`);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage(offer.id, messageText);
      toast.success("Nachricht wurde gesendet");
      setMessageText("");
      setShowMessageInput(false);
    }
  };

  const isPending = offer.status === "pending";

  return (
    <Box
      sx={{
        border: "1px solid #e6e5e5",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#ff671f",
          boxShadow: "0 2px 8px rgba(255, 103, 31, 0.15)",
        },
      }}
    >
      {/* Header - Always visible */}
      <Box sx={{ p: 2, bgcolor: "#fdfcfc" }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
          <VerifiedBadge user={user} avatarSize={40}>
            <Avatar
              src={user?.avatar}
              alt={offer.offeredBy}
              sx={{ width: 40, height: 40 }}
            />
          </VerifiedBadge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <p className="body-base-medium">{offer.offeredBy}</p>
            <p className="body-xs text-secondary">
              Score: {user?.score || 0} / 100
            </p>
          </Box>
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
              height: 24,
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

        {/* Premium Display */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
          <span className="label">Prämie:</span>
          <span className="text-2xl-semibold text-brand">{offer.premium} €</span>
        </Box>

        {/* Expand/Collapse Button */}
        <Button
          size="small"
          endIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          onClick={() => setExpanded(!expanded)}
          sx={{
            color: "#4f4a4a",
            textTransform: "none",
            fontSize: "12px",
            p: 0,
            minWidth: "auto",
            "&:hover": {
              bgcolor: "transparent",
              color: "#ff671f",
            },
          }}
        >
          {expanded ? "Weniger anzeigen" : "Details anzeigen"}
        </Button>
      </Box>

      {/* Expandable Details */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2, borderTop: "1px solid #e6e5e5" }}>
          {/* Coverage Types */}
          {offer.coverageTypes && (
            <Box sx={{ mb: 2, mt: 2 }}>
              <span className="label mb-2 block">Abdeckung</span>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {offer.coverageTypes.damage ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <X size={16} className="text-secondary" />
                  )}
                  <span className="body-sm">Beschädigung</span>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {offer.coverageTypes.replacement ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <X size={16} className="text-secondary" />
                  )}
                  <span className="body-sm">Ersatz</span>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {offer.coverageTypes.lossOrTheft ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <X size={16} className="text-secondary" />
                  )}
                  <span className="body-sm">Verlust/Diebstahl</span>
                </Box>
              </Box>
            </Box>
          )}

          {/* Message */}
          {offer.message && (
            <Box sx={{ mb: 2 }}>
              <span className="label mb-1 block">Nachricht vom Anbieter</span>
              <Box
                sx={{
                  bgcolor: "#f3f2f2",
                  p: 1.5,
                  borderRadius: "8px",
                }}
              >
                <p className="body-sm text-secondary">{offer.message}</p>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>

      {/* Actions - Only for pending offers */}
      {isPending && (
        <Box sx={{ p: 2, borderTop: "1px solid #e6e5e5", bgcolor: "#fdfcfc" }}>
          {/* Message Input */}
          <Collapse in={showMessageInput}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Nachricht an Anbieter..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  sx={{
                    bgcolor: "#ff671f",
                    "&:hover": { bgcolor: "#e05a1b" },
                  }}
                >
                  Senden
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShowMessageInput(false);
                    setMessageText("");
                  }}
                  sx={{
                    color: "#4f4a4a",
                    borderColor: "#e6e5e5",
                  }}
                >
                  Abbrechen
                </Button>
              </Box>
            </Box>
          </Collapse>

          {/* Action Buttons */}
          {!showMessageInput && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Check size={18} />}
                onClick={handleAccept}
                sx={{
                  bgcolor: "#00a63e",
                  color: "white",
                  "&:hover": { bgcolor: "#008f35" },
                }}
              >
                Akzeptieren
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MessageCircle size={18} />}
                onClick={() => setShowMessageInput(true)}
                sx={{
                  color: "#ff671f",
                  borderColor: "#ff671f",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.08)",
                    borderColor: "#ff671f",
                  },
                }}
              >
                Rückfrage
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<X size={18} />}
                onClick={handleReject}
                sx={{
                  color: "#f54900",
                  borderColor: "#e6e5e5",
                  "&:hover": {
                    bgcolor: "rgba(245, 73, 0, 0.08)",
                    borderColor: "#f54900",
                  },
                }}
              >
                Ablehnen
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
