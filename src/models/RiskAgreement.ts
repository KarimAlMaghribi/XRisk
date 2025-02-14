export interface RiskAgreement {
    id: string;
    riskId: string;
    riskTakerId: string;
    riskGiverId: string;
    chatId: string;
    title: string;
    type: string[];
    insuranceSum: number;
    costs: number;
    timeframe: string;
    evidence: string;
    details: string;

    riskTakerApprovals: {
        [attribute: string]: boolean;
    };

    riskGiverApprovals: {
        [attribute: string]: boolean;
    };
}
