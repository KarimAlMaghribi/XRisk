import React from "react";
import {Button, DialogActions} from "@mui/material";
import {AgreementTable} from "../../my-risks/my-risk-row-details/agreement-details/agreement-table";
import {RiskAgreement} from "../../../models/RiskAgreement";

export interface RiskAgreementFinalisationProps {
    handleClose: () => void;
    riskAgreement: RiskAgreement | null;
}

export const RiskAgreementFinalisation = (props: RiskAgreementFinalisationProps) => {
    return (
        <>
            <AgreementTable riskAgreement={props.riskAgreement} />
            <DialogActions>
                <Button onClick={props.handleClose} variant="contained" color="primary">
                    Fertigstellen
                </Button>
                <Button onClick={props.handleClose} variant="contained">
                    Schließen
                </Button>
            </DialogActions>
        </>

    )
}
