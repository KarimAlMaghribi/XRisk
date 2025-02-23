import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {NumericFormat} from "react-number-format";
import {RiskAgreement} from "../../../../models/RiskAgreement";
import {auth} from "../../../../firebase_config";

const formatEuro = (value?: number) => {
    if (value == null) return "-";
    return (
        <NumericFormat
            value={value}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            suffix="€ "
        />
    );
};

export interface AgreementTableProps {
    riskAgreement: RiskAgreement | null;

}

export const AgreementTable = (props: AgreementTableProps) => {
    const getStatus = (field: keyof RiskAgreement["riskGiverApprovals"], riskAgreement: RiskAgreement | null): { text: string; color: string; } => {
        if (!riskAgreement) return {text: "Kein Vertrag", color: "gray"};

        const uid: string | undefined = auth.currentUser?.uid;

        var selfApproved: boolean;
        var partnerApproved: boolean;
        var otherUser: string;

        if (uid === riskAgreement.riskGiverId) {
            selfApproved = riskAgreement.riskGiverApprovals?.[field];
            partnerApproved = riskAgreement.riskTakerApprovals?.[field];
            otherUser = "Risikonehmer";
        } else {
            selfApproved = riskAgreement.riskTakerApprovals?.[field];
            partnerApproved = riskAgreement.riskGiverApprovals?.[field];
            otherUser = "Risikogeber";
        }

        if (selfApproved && partnerApproved) {
            return {text: "Akzeptiert", color: "green"};
        } else if (!partnerApproved) {
            return {text: "Warten auf " + otherUser, color: "yellow"};
        } else {
            return {text: "Zustimmung ausstehend", color: "blue"};
        }
    };

    return (
        <TableContainer elevation={0} component={Paper} sx={{ borderRadius: "2px", maxWidth: "100%", border: "1px solid #f0f0f0" }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Wert</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Versicherungssumme</TableCell>
                        <TableCell>{formatEuro(props.riskAgreement?.insuranceSum)}</TableCell>
                        <TableCell>{getStatus("insuranceSum", props.riskAgreement).text}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Kosten</TableCell>
                        <TableCell>{formatEuro(props.riskAgreement?.costs)}</TableCell>
                        <TableCell>{getStatus("costs", props.riskAgreement).text}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Zeitspanne</TableCell>
                        <TableCell>{props.riskAgreement?.timeframe}</TableCell>
                        <TableCell>{getStatus("timeframe", props.riskAgreement).text}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Beweismittel</TableCell>
                        <TableCell>{props.riskAgreement?.evidence}</TableCell>
                        <TableCell>{getStatus("evidence", props.riskAgreement).text}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Weitere Details</TableCell>
                        <TableCell>{props.riskAgreement?.details}</TableCell>
                        <TableCell>{getStatus("details", props.riskAgreement).text}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}
