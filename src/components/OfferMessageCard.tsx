import { Box } from "@mui/material";
import { OfferMessageData } from "./types/message";
import { Offer } from "./types/offer";
import { OfferDetailsCard } from "./OfferDetailsCard";

interface OfferMessageCardProps {
  offer: OfferMessageData;
  onAccept: (offerId: string) => void;
  onDecline: (offerId: string) => void;
  isCurrentUser: boolean;
}

export function OfferMessageCard({ offer, onAccept, onDecline, isCurrentUser }: OfferMessageCardProps) {
  const normalizedOffer: Offer = {
    id: offer.offerId,
    riskId: offer.riskId,
    riskTitle: offer.riskTitle,
    riskCategory: offer.riskCategory,
    riskLevel: offer.riskLevel,
    coverageAmount: offer.coverageAmount,
    offeredBy: 'Unbekannt',
    offeredByUserId: 'unknown',
    premium: offer.offeredPremium,
    offeredPremium: offer.offeredPremium,
    message: '',
    createdAt: new Date(),
    status: offer.status,
    coverageTypes: offer.coverageTypes,
    recommendedPriceRange: offer.recommendedPriceRange,
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <OfferDetailsCard
        variant="compact"
        offer={normalizedOffer}
        onAccept={() => onAccept(offer.offerId)}
        onDecline={() => onDecline(offer.offerId)}
        showActions={offer.status === "pending" && !isCurrentUser}
      />
    </Box>
  );
}
