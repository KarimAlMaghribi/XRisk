export interface Risk {
    id: string;
    name: string;
    description: string;
    type: string;
    value: number;
    publisher: any; // image
    declinationDate: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    riskStatus: string;
    riskCategory: string;
    riskProbability: number;
    offerer?: string;
}
