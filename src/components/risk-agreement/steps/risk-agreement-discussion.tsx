import React from "react";
import { auth } from "../../../firebase_config";
import { RiskAgreement } from "../../../models/RiskAgreement";
import { updateMyRiskAgreement } from "../../../store/slices/my-risk-agreements/thunks";
import { AppDispatch } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveRiskAgreement } from "../../../store/slices/my-risk-agreements/selectors";
import { NotificationStatusEnum } from "../../../enums/Notifications.enum";
import { serverTimestamp } from "firebase/firestore";
import { addNotification } from "../../../store/slices/my-notifications/thunks";
import { Chat } from "../../../store/slices/my-bids/types";
import { selectActiveChat } from "../../../store/slices/my-bids/selectors";
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { RiskAgreementHeader } from "./risk-agreement-header";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { EuroNumberFormat } from "../../my-risks/creation-dialog/my-risk-creation-dialog";
import { ExpandableTextField } from "../expandable-textfield";
import { Trans } from "react-i18next";
import i18next from "i18next";

export interface RiskAgreementDiscussionProps {
  hasApprovedExistingAgreement: boolean;
  riskTitle: string;
  riskType: string[];
  activeChat: any;
  timeframe: string;
  setTimeframe: (value: string) => void;
  prevTimeframe: string;
  timeframeColor: string;
  evidence: string;
  setEvidence: (value: string) => void;
  prevEvidence: string;
  evidenceColor: string;
  costs: number;
  setCosts: (value: number) => void;
  prevCosts: number;
  costsColor: string;
  insuranceSum: number;
  setInsuranceSum: (value: number) => void;
  prevInsuranceSum: number;
  insuranceSumColor: string;
  riskDetails: string;
  setRiskDetails: (value: string) => void;
  prevRiskDetails: string;
  riskDetailsColor: string;
  handleTimeframeChange: (value: string) => void;
  handleEvidenceChange: (value: string) => void;
  handleCostsChange: (value: number) => void;
  handleInsuranceSumChange: (value: number) => void;
  handleDetailsChange: (value: string) => void;
  handleClose: () => void;
}

export const RiskAgreementDiscussion = (
  props: RiskAgreementDiscussionProps
) => {
  const dispatch: AppDispatch = useDispatch();
  const activeChat: Chat | undefined = useSelector(selectActiveChat);
  const existingAgreement: RiskAgreement | null = useSelector(
    selectActiveRiskAgreement
  );

  const handleUpdateNotification = async (msg?: string) => {
    const recipient =
      activeChat?.riskTaker.uid === auth.currentUser?.uid
        ? activeChat?.riskProvider.uid
        : activeChat?.riskTaker.uid;
    const senderName =
      activeChat?.riskTaker.uid !== auth.currentUser?.uid
        ? activeChat?.riskProvider.name
        : activeChat?.riskTaker.name;
    const chatroomId = activeChat?.id;

    const newNotification = {
      message: msg
        ? msg
        : `${activeChat?.topic} Vereinbarung angepasst durch ${senderName}`,
      chatroomId: chatroomId!,
      status: NotificationStatusEnum.UNREAD,
      createdAt: serverTimestamp(),
    };
    dispatch(
      addNotification({ uid: recipient, newNotification: newNotification })
    );
  };

  const handleWithdrawApprovals = () => {
    const senderName: string | undefined =
      activeChat?.riskTaker.uid !== auth.currentUser?.uid
        ? activeChat?.riskProvider.name
        : activeChat?.riskTaker.name;
    const withdrawMsg: string = `${activeChat?.topic} Vereinbarung zurückgezogen von ${senderName}`;

    if (existingAgreement) {
      if (existingAgreement.riskGiverId == auth.currentUser?.uid) {
        const riskGiverApprovals = {
          costs: false,
          insuranceSum: false,
          timeframe: false,
          evidence: false,
          details: false,
        };

        const updatedRiskAgreement: RiskAgreement = {
          ...existingAgreement,
          riskGiverApprovals: riskGiverApprovals,
        };

        dispatch(updateMyRiskAgreement(updatedRiskAgreement));
        handleUpdateNotification(withdrawMsg);
      } else {
        const riskTakerApprovals = {
          costs: false,
          insuranceSum: false,
          timeframe: false,
          evidence: false,
          details: false,
        };

        const updatedRiskAgreement: RiskAgreement = {
          ...existingAgreement,
          riskTakerApprovals: riskTakerApprovals,
        };

        dispatch(updateMyRiskAgreement(updatedRiskAgreement));
        handleUpdateNotification(withdrawMsg);
      }
    }
  };

  const handleAffirmRiskAgreement = () => {
    let riskGiverApprovals;
    let riskTakerApprovals;

    if (activeChat) {
      if (existingAgreement) {
        if (activeChat?.riskTaker.uid === auth?.currentUser?.uid) {
          const costsApproved =
            existingAgreement.riskGiverApprovals.costs &&
            existingAgreement.costs === props.costs;
          const timeframeApproved =
            existingAgreement.riskGiverApprovals.timeframe &&
            existingAgreement.timeframe === props.timeframe;
          const insuranceSumApproved =
            existingAgreement.riskGiverApprovals.insuranceSum &&
            existingAgreement.insuranceSum === props.insuranceSum;
          const evidenceApproved =
            existingAgreement.riskGiverApprovals.evidence &&
            existingAgreement.evidence === props.evidence;
          const detailsApproved =
            existingAgreement.riskGiverApprovals.details &&
            existingAgreement.details === props.riskDetails;

          riskGiverApprovals = {
            costs: costsApproved,
            insuranceSum: insuranceSumApproved,
            timeframe: timeframeApproved,
            evidence: evidenceApproved,
            details: detailsApproved,
          };

          riskTakerApprovals = {
            costs: true,
            insuranceSum: true,
            timeframe: true,
            evidence: true,
            details: true,
          };
        } else {
          const costsApproved =
            existingAgreement.riskTakerApprovals.costs &&
            existingAgreement.costs === props.costs;
          const timeframeApproved =
            existingAgreement.riskTakerApprovals.timeframe &&
            existingAgreement.timeframe === props.timeframe;
          const insuranceSumApproved =
            existingAgreement.riskTakerApprovals.insuranceSum &&
            existingAgreement.insuranceSum === props.insuranceSum;
          const evidenceApproved =
            existingAgreement.riskTakerApprovals.evidence &&
            existingAgreement.evidence === props.evidence;
          const detailsApproved =
            existingAgreement.riskTakerApprovals.details &&
            existingAgreement.details === props.riskDetails;

          riskTakerApprovals = {
            costs: costsApproved,
            insuranceSum: insuranceSumApproved,
            timeframe: timeframeApproved,
            evidence: evidenceApproved,
            details: detailsApproved,
          };
          riskGiverApprovals = {
            costs: true,
            insuranceSum: true,
            timeframe: true,
            evidence: true,
            details: true,
          };
        }

        const updatedRiskAgreement: RiskAgreement = {
          ...existingAgreement,
          previousState: {
            insuranceSum: existingAgreement.insuranceSum,
            costs: existingAgreement.costs,
            timeframe: existingAgreement.timeframe,
            evidence: existingAgreement.evidence,
            details: existingAgreement.details,
          },
          insuranceSum: props.insuranceSum,
          costs: props.costs,
          timeframe: props.timeframe,
          evidence: props.evidence,
          details: props.riskDetails,
          riskGiverApprovals: riskGiverApprovals,
          riskTakerApprovals: riskTakerApprovals,
        };

        dispatch(updateMyRiskAgreement(updatedRiskAgreement));
        handleUpdateNotification();
      }
    }
  };

  const riskAgreementChanged = () => {
    if (!existingAgreement) return false;

    return !(
      existingAgreement.costs == props.costs &&
      existingAgreement.insuranceSum == props.insuranceSum &&
      existingAgreement.timeframe == props.timeframe &&
      existingAgreement.evidence == props.evidence &&
      existingAgreement.details == props.riskDetails
    );
  };

  return (
    <>
      <DialogContentText>
        <Trans
          i18nKey={"risk_agreement.risk_agreement_definition.dialog_context_1"}
        />{" "}
        <br />
        <Trans
          i18nKey={"risk_agreement.risk_agreement_discussion.dialog_context_1"}
        />{" "}
        <br />
      </DialogContentText>
      <br />
      {props.hasApprovedExistingAgreement && (
        <DialogContentText>
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_context_2"
            }
          />{" "}
          <br />
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_context_3"
            }
          />
        </DialogContentText>
      )}
      {!props.hasApprovedExistingAgreement && (
        <DialogContentText>
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_context_4"
            }
          />{" "}
          <br />
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_context_5"
            }
          />
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_context_6"
            }
          />
        </DialogContentText>
      )}

      <Box position="relative">
        <RiskAgreementHeader
          riskTitle={props.riskTitle}
          riskType={props.riskType}
        />
        <Chip
          icon={
            props.hasApprovedExistingAgreement ? (
              <TaskAltIcon />
            ) : (
              <ReportGmailerrorredIcon />
            )
          }
          label={
            props.hasApprovedExistingAgreement
              ? i18next.t(
                  "risk_agreement.risk_agreement_discussion.box_chip_label1"
                )
              : i18next.t(
                  "risk_agreement.risk_agreement_discussion.box_chip_label2"
                )
          }
          color={!props.hasApprovedExistingAgreement ? "success" : "warning"}
          sx={{ position: "absolute", bottom: 0, right: 0 }}
        />
      </Box>

      <ExpandableTextField
        name="timeframe"
        id="timeframe"
        label={i18next.t("risk_agreement.risk_agreement_form.timeframe")}
        value={props.timeframe}
        oldValue={props.prevTimeframe}
        borderColor={props.timeframeColor}
        handlerFunction={props.handleTimeframeChange}
      />
      <ExpandableTextField
        name="evidence"
        id="evidence"
        label={i18next.t("risk_agreement.risk_agreement_form.evidence")}
        value={props.evidence}
        oldValue={props.prevEvidence}
        borderColor={props.evidenceColor}
        handlerFunction={props.handleEvidenceChange}
      />
      <ExpandableTextField
        name="costs"
        id="costs"
        label={i18next.t("risk_agreement.risk_agreement_form.costs")}
        value={props.costs}
        oldValue={props.prevCosts}
        borderColor={props.costsColor}
        handlerFunction={props.handleCostsChange}
        inputProps={{
          inputComponent: EuroNumberFormat,
        }}
      />
      <ExpandableTextField
        name="insuranceSum"
        id="insuranceSum"
        label={i18next.t("risk_agreement.risk_agreement_form.insuranceSum")}
        value={props.insuranceSum}
        oldValue={props.prevInsuranceSum}
        borderColor={props.insuranceSumColor}
        handlerFunction={props.handleInsuranceSumChange}
        inputProps={{
          inputComponent: EuroNumberFormat,
        }}
      />
      <ExpandableTextField
        name="details"
        id="details"
        label={i18next.t("risk_agreement.risk_agreement_form.details")}
        value={props.riskDetails}
        oldValue={props.prevRiskDetails}
        borderColor={props.riskDetailsColor}
        handlerFunction={props.handleDetailsChange}
      />

      <DialogActions>
        {props.hasApprovedExistingAgreement && (
          <Button onClick={handleWithdrawApprovals} variant="contained">
            <Trans
              i18nKey={
                "risk_agreement.risk_agreement_discussion.dialog_action_button1"
              }
            />
          </Button>
        )}

        <Button
          onClick={handleAffirmRiskAgreement}
          variant="contained"
          disabled={!riskAgreementChanged()}
          color="primary"
        >
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_action_button2"
            }
          />
        </Button>

        {!props.hasApprovedExistingAgreement && (
          <Button
            onClick={handleAffirmRiskAgreement}
            variant="contained"
            disabled={riskAgreementChanged()}
            color="primary"
          >
            <Trans
              i18nKey={
                "risk_agreement.risk_agreement_discussion.dialog_action_button3"
              }
            />
          </Button>
        )}
        <Button onClick={props.handleClose} variant="contained">
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_discussion.dialog_action_button4"
            }
          />
        </Button>
      </DialogActions>
    </>
  );
};
