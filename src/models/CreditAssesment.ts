import { FieldValue, Timestamp } from "firebase/firestore";

export interface CreditAssesment {
    id: string;
    liquidAssets: number | null;
    monthlyIncome: number | null;
    currentLoan: number | null;
    monthlyFixedCosts: number | null;
    additionalAssets: number | null;
    acquisitionLimit: number;
};