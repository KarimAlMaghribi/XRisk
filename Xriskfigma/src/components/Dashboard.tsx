import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  LocalOffer as OfferIcon,
  Euro as EuroIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { communityRisks } from "../lib/community-mock-data";
import { offers as allOffers } from "../lib/offers-mock-data";
import {
  categoryLabels,
  Risk,
} from "../types/risk";

import { RiskCard } from "./RiskCard";
import { CreateRiskCard } from "./CreateRiskCard";
import { users } from "../lib/user-mock-data";
import { DeleteRiskDialog } from "./DeleteRiskDialog";
import { toast } from "sonner@2.0.3";
import { CURRENT_USER_ID } from "../lib/current-user";
import { StatusBadge, CustomBadge } from "./StatusBadge";

interface DashboardProps {
  newRisks?: Risk[];
  onCreateRiskClick?: () => void;
  onDeleteRisk?: (riskId: string) => void;
  onRiskDetails?: (risk: Risk) => void;
}

export function Dashboard({ newRisks = [], onCreateRiskClick, onDeleteRisk, onRiskDetails }: DashboardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [riskToDelete, setRiskToDelete] = useState<Risk | null>(null);

  // Angebotene Risiken vom aktuellen Nutzer (combine with new risks, include drafts)
  const myOfferedRisks = [
    ...newRisks,
    ...communityRisks.filter(
      (r) =>
        (r.status === "pending" || r.status === "active" || r.status === "evaluating" || r.status === "draft") &&
        r.createdByUserId === CURRENT_USER_ID
    )
  ];

  // Abgesicherte Risiken (wo Nutzer als Taker agiert)
  const mySecuredRisks = communityRisks.filter(
    (r) => r.status === "active" && r.userRole === "taker"
  );



  const handleCreateRisk = () => {
    if (onCreateRiskClick) {
      onCreateRiskClick();
    }
  };

  const handleDeleteClick = (risk: Risk) => {
    setRiskToDelete(risk);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (riskToDelete) {
      if (onDeleteRisk) {
        onDeleteRisk(riskToDelete.id);
      }
      toast.success(`Risiko "${riskToDelete.title}" wurde gelöscht`);
      setDeleteDialogOpen(false);
      setRiskToDelete(null);
    }
  };

  const handlePublishRisk = (risk: Risk) => {
    // In a real app, this would make an API call to publish the risk
    // For now, we'll just show a success message
    toast.success(`Risiko "${risk.title}" wurde veröffentlicht`, {
      description: "Das Risiko ist jetzt in der Riskobörse sichtbar und kann von anderen Nutzern übernommen werden.",
      duration: 5000,
    });
    
    // Update the risk status in the communityRisks array
    const riskIndex = communityRisks.findIndex(r => r.id === risk.id);
    if (riskIndex !== -1) {
      communityRisks[riskIndex].status = "evaluating";
    }
  };

  const getRiskOffers = (riskId: string) => {
    return allOffers.filter((o) => o.riskId === riskId && o.status === "pending");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "32px",
            color: "#353131",
            mb: 0.5,
          }}
        >
          Dashboard
        </Typography>
        <Typography className="body-sm text-secondary">
          Übersicht Ihrer Risiken
        </Typography>
      </Box>

      {/* Angebotene Risiken Section */}
      <Box>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#353131",
            mb: 2,
          }}
        >
          Meine angebotenen Risiken
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {myOfferedRisks.map((risk) => {
            const riskOffers = getRiskOffers(risk.id);
            const cheapestOffer = riskOffers.length > 0 
              ? riskOffers.reduce((min, offer) => offer.premium < min.premium ? offer : min, riskOffers[0])
              : null;
            
            // Custom badges for offered risks
            const customBadges = risk.status === "evaluating" ? (
              <StatusBadge status="evaluating" />
            ) : cheapestOffer ? (
              <CustomBadge 
                label={`Bestes Angebot: ${cheapestOffer.premium} €`}
                variant="success"
              />
            ) : riskOffers.length > 0 ? (
              <CustomBadge 
                label={`${riskOffers.length} ${riskOffers.length === 1 ? "Angebot" : "Angebote"}`}
                variant="warning"
              />
            ) : null;

            return (
              <RiskCard
                key={risk.id}
                risk={risk}
                variant="dashboard"
                onTakeRisk={() => {}}
                onDetailsClick={onRiskDetails}
                onPublish={handlePublishRisk}
                customBadges={customBadges}
                hideUser={true}
                showDelete={true}
                onDelete={handleDeleteClick}
                showDescription={false}
                hidePrimaryAction={true}
              />
            );
          })}
          <CreateRiskCard onClick={handleCreateRisk} />
        </Box>
      </Box>

      {/* Abgesicherte Risiken Section */}
      <Box>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#353131",
            mb: 2,
          }}
        >
          Meine abgesicherten Risiken
        </Typography>

        {mySecuredRisks.length === 0 ? (
          <Card elevation={0} sx={{ bgcolor: "#f3f2f2" }}>
            <CardContent sx={{ py: 4, textAlign: "center" }}>
              <Typography className="body-sm text-secondary">
                Sie haben noch keine Risiken abgesichert
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {mySecuredRisks.map((risk) => {
              const daysRemaining = risk.expiresAt
                ? Math.ceil(
                    (risk.expiresAt.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;
              
              // Custom badges for secured risks
              const customBadges = (
                <>
                  <CustomBadge 
                    label={`Noch ${daysRemaining} ${daysRemaining === 1 ? "Tag" : "Tage"}`}
                    variant="success"
                  />
                  <CustomBadge 
                    label={`+${risk.premium} € Prämie`}
                    variant="success"
                  />
                </>
              );

              return (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  variant="dashboard"
                  onTakeRisk={() => {}}
                  onDetailsClick={onRiskDetails}
                  customActionLabel="Laufend"
                  customActionDisabled={true}
                  customBadges={customBadges}
                  hideAction={true}
                  showDescription={false}
                />
              );
            })}
          </Box>
        )}
      </Box>

      {/* Delete Risk Dialog */}
      <DeleteRiskDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        riskTitle={riskToDelete?.title || ""}
      />
    </Box>
  );
}
