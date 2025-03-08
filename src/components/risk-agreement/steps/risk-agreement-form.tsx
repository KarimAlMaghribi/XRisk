import React from "react";
import { TextField } from "@mui/material";
import { EuroNumberFormat } from "../../my-risks/creation-dialog/my-risk-creation-dialog";
import {InfoTooltip} from "./info-tooltip";

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
                label="Zeitspanne"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
            />
            <TextField
                margin="dense"
                fullWidth
                label="Beweismittel"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                InputProps={{ endAdornment: <InfoTooltip title="Beweise für den Schadenfall" /> }}
            />
            <TextField
                margin="dense"
                fullWidth
                label="Kosten"
                color="secondary"
                value={costs}
                onChange={(e) => setCosts(Number(e.target.value.replace(/€\s?|(,*)/g, "")))}
                InputProps={{
                    endAdornment: <InfoTooltip title="Kosten des Risikogeber" />,
                    inputComponent: EuroNumberFormat,
                }}
            />
            <TextField
                margin="dense"
                fullWidth
                label="Absicherungssumme"
                value={insuranceSum}
                onChange={(e) => setInsuranceSum(Number(e.target.value.replace(/€\s?|(,*)/g, "")))}
                InputProps={{
                    endAdornment: <InfoTooltip title="Maximal auszuzahlende Summe" />,
                    inputComponent: EuroNumberFormat,
                }}
            />
            <TextField
                margin="dense"
                fullWidth
                multiline
                label="Sonstige Anmerkungen"
                value={riskDetails}
                onChange={(e) => setRiskDetails(e.target.value)}
                InputProps={{ endAdornment: <InfoTooltip title="Vertraglich relevante Informationen" /> }}
            />
        </>
    );
};
