import { Box } from "@mui/material";
import { OfferMessageData } from "../types/message";
import { OfferDetailsCard } from "./OfferDetailsCard";

interface OfferMessageCardProps {
  offer: OfferMessageData;
  onAccept: (offerId: string) => void;
  onDecline: (offerId: string) => void;
  isCurrentUser: boolean;
}

export function OfferMessageCard({ offer, onAccept, onDecline, isCurrentUser }: OfferMessageCardProps) {
  return (
    <Box sx={{ maxWidth: 500 }}>
      <OfferDetailsCard
        variant="compact"
        offer={{
          riskTitle: offer.riskTitle,
          riskCategory: offer.riskCategory,
          riskLevel: offer.riskLevel,
          coverageAmount: offer.coverageAmount,
          offeredPremium: offer.offeredPremium,
          recommendedPriceRange: offer.recommendedPriceRange,
          coverageTypes: offer.coverageTypes,
          status: offer.status,
        }}
        onAccept={() => onAccept(offer.offerId)}
        onDecline={() => onDecline(offer.offerId)}
        showActions={offer.status === "pending" && !isCurrentUser}
      />
    </Box>
  );
}
