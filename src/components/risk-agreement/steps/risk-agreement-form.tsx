import React from "react";
import { TextField } from "@mui/material";
import { EuroNumberFormat } from "../../my-risks/creation-dialog/my-risk-creation-dialog";
import {InfoTooltip} from "./info-tooltip";
import i18next from "i18next";

export interface RiskAgreementFormProps {
    timeframe: string;
    setTimeframe: (value: string) => void;
    evidence: string;
    setEvidence: (value: string) => void;
    costs: number;
    setCosts: (value: number) => void;
    insuranceSum: number;
    setInsuranceSum: (value: number) => void;
    riskDetails: string;
    setRiskDetails: (value: string) => void;
}

export const RiskAgreementForm: React.FC<RiskAgreementFormProps> = ({
     timeframe,
     setTimeframe,
     evidence,
     setEvidence,
     costs,
     setCosts,
     insuranceSum,
     setInsuranceSum,
     riskDetails,
     setRiskDetails,
}) => {
    return (
        <>
            <TextField
                margin="dense"
                fullWidth
                label={i18next.t("risk_agreement.risk_agreement_form.timeframe")}
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
            />
            <TextField
                margin="dense"
                fullWidth
                label={i18next.t("risk_agreement.risk_agreement_form.evidence")}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                InputProps={{ endAdornment: <InfoTooltip title={i18next.t("risk_agreement.risk_agreement_form.evidence_tooltip")} /> }}
            />
            <TextField
                margin="dense"
                fullWidth
                label={i18next.t("risk_agreement.risk_agreement_form.costs")}
                color="secondary"
                value={costs}
                onChange={(e) => setCosts(Number(e.target.value.replace(/€\s?|(,*)/g, "")))}
                InputProps={{
                    endAdornment: <InfoTooltip title={i18next.t("risk_agreement.risk_agreement_form.costs_tooltip")} />,
                    inputComponent: EuroNumberFormat,
                    inputProps: {
                        decimalScale: 2,
                        fixedDecimalScale: false,
                    },
                }}
            />
            <TextField
                margin="dense"
                fullWidth
                label={i18next.t("risk_agreement.risk_agreement_form.insuranceSum")}
                value={insuranceSum}
                onChange={(e) => setInsuranceSum(Number(e.target.value.replace(/€\s?|(,*)/g, "")))}
                InputProps={{
                    endAdornment: <InfoTooltip title={i18next.t("risk_agreement.risk_agreement_form.insuranceSum_tooltip")} />,
                    inputComponent: EuroNumberFormat,
                    inputProps: {
                        decimalScale: 2,
                        fixedDecimalScale: false,
                    },
                }}
            />
            <TextField
                margin="dense"
                fullWidth
                multiline
                label={i18next.t("risk_agreement.risk_agreement_form.details")}
                value={riskDetails}
                onChange={(e) => setRiskDetails(e.target.value)}
                InputProps={{ endAdornment: <InfoTooltip title={i18next.t("risk_agreement.risk_agreement_form.details_tooltip")} /> }}
            />
        </>
    );
};
