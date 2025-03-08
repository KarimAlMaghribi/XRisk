import React from "react";
import {Button, DialogActions, Typography} from "@mui/material";
import {AgreementTable} from "../../my-risks/my-risk-row-details/agreement-details/agreement-table";
import {RiskAgreement} from "../../../models/RiskAgreement";

export interface RiskAgreementFinalisationProps {
    handleClose: () => void;
    riskAgreement: RiskAgreement | null;
}

export const RiskAgreementFinalisation = (props: RiskAgreementFinalisationProps) => {
    return (
        <>
            <Typography variant="body1" margin="20px">Hier kannst du nochmal einen Blick auf eure Vereinbarung werfen.</Typography>
            <AgreementTable riskAgreement={props.riskAgreement} />
            <DialogActions sx={{marginTop: "20px"}}>
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
