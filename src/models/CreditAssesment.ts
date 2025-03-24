import {LiquidAssetsStatus, AnnualIncomeStatus, CurrentLoanStatus, MontlyFixedCosts, AdditionalAssetsStatus} from "../types/CreditAssesmentStatus";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface CreditAssesment {
    id: string;
    liquidAssets: number | null;
    annualIncome: number | null;
    currentLoan: number | null;
    monthlyFixedCosts: number | null;
    additionalAssets: number | null;
};