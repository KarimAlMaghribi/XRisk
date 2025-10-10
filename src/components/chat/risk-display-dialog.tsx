import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Dialog,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSnackbarContext } from "../snackbar/custom-snackbar";
import Grid from "@mui/material/Grid2";
import { Risk } from "../../models/Risk";
import { mapStatus } from "../my-risks/utils";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import { AgreementTable } from "../my-risks/my-risk-row-details/agreement-details/agreement-table";
import { useSelector } from "react-redux";
import { selectRiskAgreements } from "../../store/slices/my-risk-agreements/selectors";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaperComponent } from "../ui/draggable-dialog";

export interface RiskDisplayDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  risk: Risk | undefined;
}

export const RiskDisplayDialog = (props: RiskDisplayDialogProps) => {
  const { showSnackbar } = useSnackbarContext();
  const riskAgreements = useSelector(selectRiskAgreements);
  const elementBottomMargin = 20;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (props.open && !props.risk) {
      console.error("Risk not found!");
      showSnackbar("Darstellung fehlerhaft!","Risikodaten konnten nicht dargestellt werden",
          { vertical: "top", horizontal: "center" }, "error");
    }
  }, [props.risk]);

  const handleClose = () => props.setOpen(false);
  const foundRiskAgreement = riskAgreements?.find(r => r.riskId === props.risk?.id);

  return (
      <Dialog
          open={props.open}
          onClose={handleClose}
          fullScreen={fullScreen}
          PaperComponent={fullScreen ? undefined : PaperComponent}
          PaperProps={{
            sx: fullScreen ? { width:'100%', height:'100%', m:0 }
                : { minWidth: "500px", position:"absolute", top:"10%", m:0 }
          }}
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: fullScreen ? "default" : "move" }}>
          {props.risk?.name}
        </DialogTitle>
        <DialogContent dividers={fullScreen}>
          <DialogContentText component="div">
            <Grid container>
              <Grid size={4}>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}><Trans i18nKey={"terms.Type"} /></Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}><Trans i18nKey={"terms.Insured_sum"} /></Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}><Trans i18nKey={"terms.Due_on"} /></Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}><Trans i18nKey={"terms.Status"} /></Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}><Trans i18nKey={"terms.Description"} /></Typography>
              </Grid>
              <Grid size={8}>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}>
                  {props.risk?.type.map((type) => type).join(", ") || "-"}
                </Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}>
                  {props.risk?.value ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(props.risk.value) : "-"}
                </Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}>
                  {props.risk?.declinationDate ? new Date(props.risk.declinationDate).toLocaleString() : "-"}
                </Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}>
                  {mapStatus(t, props.risk?.status) || "-"}
                </Typography>
                <Typography variant="body2" sx={{ mb: `${elementBottomMargin}px` }}>
                  {props.risk?.description || "-"}
                </Typography>
              </Grid>
            </Grid>

            {props.risk?.status === RiskStatusEnum.AGREEMENT && foundRiskAgreement && (
                <AgreementTable riskAgreement={foundRiskAgreement} />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}><Trans i18nKey={"terms.Close"} /></Button>
        </DialogActions>
      </Dialog>
  );
};
