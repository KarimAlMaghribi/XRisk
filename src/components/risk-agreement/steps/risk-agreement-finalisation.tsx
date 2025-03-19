import React, { useEffect, useRef } from "react";
import { Button, DialogActions, Typography } from "@mui/material";
import { AgreementTable } from "../../my-risks/my-risk-row-details/agreement-details/agreement-table";
import { RiskAgreement } from "../../../models/RiskAgreement";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase_config";

export interface RiskAgreementFinalisationProps {
  handleClose: () => void;
  riskAgreement: RiskAgreement | null;
}

export const RiskAgreementFinalisation = (
  props: RiskAgreementFinalisationProps
) => {
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
        origin: { y: 0.6 },
      });
    }
  }, []);

  const navigate = useNavigate();

  const handleToRiskOverview = () => {
    const currentUserId = auth.currentUser?.uid;

    if (currentUserId == props.riskAgreement?.riskGiverId) {
      navigate("/my-risks");
    } else {
      navigate("/my-risks");
    }
  };

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
        Hier kannst du nochmal einen Blick auf eure Vereinbarung werfen.
      </Typography>
      <AgreementTable riskAgreement={props.riskAgreement} />
      <DialogActions sx={{ marginTop: "20px" }}>
        <Button
          onClick={handleToRiskOverview}
          variant="contained"
          color="primary"
        >
          Zur Risikoübersicht
        </Button>
        <Button onClick={props.handleClose} variant="contained">
          Schließen
        </Button>
      </DialogActions>
    </>
  );
};
