export type RiskStatus = 'active' | 'pending' | 'completed' | 'draft' | 'expired' | 'evaluating';
export type RiskCategory = 'property' | 'vehicles' | 'electronics' | 'tools' | 'sports' | 'travel' | 'household' | 'other';
export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export const categoryLabels: Record<RiskCategory, string> = {
  property: 'Immobilien & Schlüssel',
  vehicles: 'Fahrzeuge',
  electronics: 'Elektronik',
  tools: 'Werkzeug & Geräte',
  sports: 'Sport & Freizeit',
  travel: 'Reise & Transport',
  household: 'Haushalt',
  other: 'Sonstiges',
};

export interface Risk {
  id: string;
  title: string;
  category: RiskCategory;
  description: string;
  coverageAmount: number;
  premium: number;
  duration: number; // in days
  status: RiskStatus;
  createdBy: string;
  createdByUserId: string; // User ID reference
  createdAt: Date;
  expiresAt?: Date;
  takenBy?: string;
  takenByUserId?: string; // User ID reference
  userRole: 'giver' | 'taker'; // Role of current user
  riskScore?: number; // 0-100 calculated risk score
  images?: string[]; // Image URLs of the insured object
  views?: number; // Number of views
  favorites?: number; // Number of favorites
  isFavorite?: boolean; // Whether current user has favorited this risk
  recommendedPriceRange?: {
    min: number;
    max: number;
  }; // AI-recommended price range
}

// Calculate risk score based on premium rate and duration
export function calculateRiskScore(risk: Risk): number {
  const premiumRate = (risk.premium / risk.coverageAmount) * 100;
  const durationFactor = Math.min(risk.duration / 14, 1); // Normalize to max 14 days
  
  // Base score from premium rate (0-50 points) - reduced from 70
  let score = premiumRate * 25;
  
  // Add duration factor (0-20 points) - reduced from 30
  score += durationFactor * 20;
  
  // Apply reduction factor to lower overall scores
  score = score * 0.7;
  
  return Math.min(Math.round(score), 100);
}

// Get risk level from score (1-5 scale)
export function getRiskLevel(score: number): RiskLevel {
  if (score < 15) return 1;
  if (score < 30) return 2;
  if (score < 50) return 3;
  if (score < 70) return 4;
  return 5;
}

// Get risk level label
export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    1: 'Sehr niedrig',
    2: 'Niedrig',
    3: 'Mittel',
    4: 'Hoch',
    5: 'Sehr hoch',
  };
  return labels[level];
}

// Get risk level color
export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-green-100 text-green-700',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
  };
  return colors[level];
}

// Get risk level icon color for visual representation
export function getRiskLevelIconColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    1: 'text-green-600',
    2: 'text-green-500',
    3: 'text-yellow-600',
    4: 'text-orange-600',
    5: 'text-red-600',
  };
  return colors[level];
}
