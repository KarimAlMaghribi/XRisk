export interface Offer {
  id: string;
  riskId: string;
  riskTitle: string; // Title of the risk
  riskCategory: string; // Category for display
  riskLevel: 1 | 2 | 3 | 4 | 5; // AI-calculated risk level
  coverageAmount: number; // Coverage amount
  offeredBy: string;
  offeredByUserId: string;
  premium: number;
  offeredPremium?: number;
  message: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'declined';
  takerId?: string;
  takerName?: string;
  takerAvatar?: string;
  giverId?: string;
  giverName?: string;
  amount?: number;
  coverageTypes: {
    damage: boolean;
    replacement: boolean;
    lossOrTheft: boolean;
  };
  recommendedPriceRange?: {
    min: number;
    max: number;
  }; // AI-recommended price range from risk
}
