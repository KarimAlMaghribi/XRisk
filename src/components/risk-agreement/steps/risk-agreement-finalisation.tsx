import React, {useEffect, useRef} from "react";
import {Button, DialogActions, Typography} from "@mui/material";
import {AgreementTable} from "../../my-risks/my-risk-row-details/agreement-details/agreement-table";
import {RiskAgreement} from "../../../models/RiskAgreement";
import confetti from "canvas-confetti";
import {Trans} from "react-i18next";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import {cleanOutdatedDeals} from "../../../store/slices/my-bids/thunks";

export interface RiskAgreementFinalisationProps {
    handleClose: () => void;
    riskAgreement: RiskAgreement | null;
}

export const RiskAgreementFinalisation = (props: RiskAgreementFinalisationProps) => {
    const dispatch: AppDispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const myConfetti = confetti.create(canvasRef.current, {
                resize: true,
                useWorker: true,
            });
            myConfetti({
                particleCount: 150,
                spread: 60,
                origin: {y: 0.6},
            });
        }

        if (props.riskAgreement !== null) {
            dispatch(cleanOutdatedDeals({riskAgreement: props.riskAgreement}));
        }

    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 2000,
                }}
            />
            <Typography variant="body1" margin="20px">
                <Trans
                    i18nKey={"risk_agreement.risk_agreement_finalisation.final_glance"}
                />
            </Typography>
            <AgreementTable riskAgreement={props.riskAgreement}/>
            <DialogActions sx={{marginTop: "20px"}}>
                <Button onClick={props.handleClose} variant="contained" color="primary">
                    <Trans i18nKey={"risk_agreement.risk_agreement_finalisation.done"}/>
                </Button>
                <Button onClick={props.handleClose} variant="contained">
                    <Trans i18nKey={"risk_agreement.risk_agreement_finalisation.close"}/>
                </Button>
            </DialogActions>
        </>
    );
};
