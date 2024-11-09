import {RiskStatus} from "../types/RiskStatus";

export interface Risk {
    id: string;
    name: string; // title
    description: string;
    type: string | null;
    value: number;
    publisher?: any; // image
    publisherAddress?: string;
    declinationDate: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    status?: string;
    riskCategory?: string;
    riskProbability?: number;
    offerer?: string;
    deleted?: boolean;
}
