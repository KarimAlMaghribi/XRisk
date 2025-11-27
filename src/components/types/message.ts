export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderVerified?: boolean; // Verified status of sender
  content: string;
  timestamp: Date;
  isRead: boolean;
  isSystemMessage?: boolean;
  attachments?: MessageAttachment[];
  riskReferences?: RiskReference[];
  offerData?: OfferMessageData; // Embedded offer data for offer messages
}

export interface OfferMessageData {
  offerId: string;
  riskId: string;
  riskTitle: string;
  riskCategory: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  coverageAmount: number;
  offeredPremium: number;
  recommendedPriceRange?: {
    min: number;
    max: number;
  };
  coverageTypes: {
    damage: boolean;
    replacement: boolean;
    lossOrTheft: boolean;
  };
  status: 'pending' | 'accepted' | 'declined';
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'risk-assessment' | 'contract' | 'report' | 'other';
  url: string;
  size: string;
}

export interface RiskReference {
  parameter: string;
  currentValue: string;
  threshold?: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface Conversation {
  id: string;
  riskId: string;
  riskTitle: string;
  riskCoverageAmount: number;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRole: 'Risikonehmer' | 'Risikogeber';
  myRole: 'Risikonehmer' | 'Risikogeber'; // Die Rolle des aktuellen Nutzers
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  riskCategory: RiskCategory;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  riskStatus: 'active' | 'in-negotiation' | 'transferred' | 'completed';
  currentOffer?: {
    offerId: string;
    premium: number;
    status: 'pending' | 'accepted' | 'declined';
    recommendedPriceRange?: {
      min: number;
      max: number;
    };
  };
}

export type RiskCategory = 
  | 'Kreditrisiko'
  | 'Marktrisiko' 
  | 'Operationelles Risiko'
  | 'Liquiditätsrisiko'
  | 'Sachrisiko'
  | 'Haftpflichtrisiko';

export interface RiskDetails {
  id: string;
  title: string;
  category: RiskCategory;
  status: 'active' | 'in-negotiation' | 'transferred' | 'completed';
  riskLevel: 1 | 2 | 3 | 4 | 5;
  volume: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  description: string;
  keyParameters: {
    probability: number; // in %
    potentialDamage: number;
    var: number; // Value at Risk
  };
  parties: {
    riskGiver: {
      id: string;
      name: string;
      share: number; // in %
    };
    riskTaker: {
      id: string;
      name: string;
      share: number; // in %
    };
  };
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  milestones: {
    id: string;
    title: string;
    date: Date;
    completed: boolean;
  }[];
  historicalData: {
    date: Date;
    riskLevel: number;
  }[];
  alerts?: {
    type: 'threshold' | 'regulatory' | 'critical';
    message: string;
    severity: 'info' | 'warning' | 'error';
  }[];
}
