import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Chat, ChatMessage } from "../../../store/slices/my-bids/types";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveChat,
  selectActiveMessages,
} from "../../../store/slices/my-bids/selectors";
import { DataExtractionBot } from "../../../extraction/DataExtractionBot";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai/index";
import { z } from "zod";
import { Risk } from "../../../models/Risk";
import { auth } from "../../../firebase_config";
import { RiskAgreement } from "../../../models/RiskAgreement";
import { v4 as uuidv4 } from "uuid";
import { addMyRiskAgreement } from "../../../store/slices/my-risk-agreements/thunks";
import { AppDispatch } from "../../../store/store";
import { NotificationStatusEnum } from "../../../enums/Notifications.enum";
import { serverTimestamp } from "firebase/firestore";
import { addNotification } from "../../../store/slices/my-notifications/thunks";
import { useSnackbarContext } from "../../snackbar/custom-snackbar";
import { RiskAgreementHeader } from "./risk-agreement-header";
import { RiskAgreementForm } from "./risk-agreement-form";
import { Trans } from "react-i18next";

export interface RiskAgreementDefinitionProps {
  risk: Risk | undefined;
  riskTitle: string;
  riskType: string[];
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
  handleTimeframeChange: (value: string) => void;
  handleEvidenceChange: (value: string) => void;
  handleCostsChange: (value: number) => void;
  handleInsuranceSumChange: (value: number) => void;
  handleDetailsChange: (value: string) => void;
  handleClose: () => void;
}

export const RiskAgreementDefinition = (
  props: RiskAgreementDefinitionProps
) => {
  const activeChat: Chat | undefined = useSelector(selectActiveChat);
  //   const [loadingExtractInformation, setLoadingExtractInformation] =
  //     useState(false);
  const activeMessages: ChatMessage[] = useSelector(selectActiveMessages);
  const dispatch: AppDispatch = useDispatch();
  const { showSnackbar } = useSnackbarContext();

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const DataSchema = z.object({
    insuranceSum: z.number(),
    costs: z.number(),
    timeframe: z.string(),
    evidence: z.string(),
    details: z.string(),
  });

  const handleDataExtraction = async () => {
    //e.preventDefault();
    //setLoadingExtractInformation(true);
    const dataExtractionBot = new DataExtractionBot(props.risk, activeMessages);
    const promptMessages = dataExtractionBot.getMessages();

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: promptMessages,
      response_format: zodResponseFormat(DataSchema, "conversationData"),
      stream: false,
      temperature: 0.5,
      top_p: 0.4,
      presence_penalty: 0.4,
      frequency_penalty: 0.0,
    });

    const conversationData = completion.choices[0].message.parsed;

    if (!conversationData) {
      console.error("No response from OpenAI:", conversationData);
      showSnackbar(
        "Fehler bei der Datenextraktion!",
        "Die Daten konnten nicht aus dem Chat extrahiert werden. Versuche es manuell.",
        { vertical: "top", horizontal: "center" },
        "error"
      );
      //setLoadingExtractInformation(false);
      return;
    }

    props.setEvidence(conversationData.evidence || props.evidence);
    props.setTimeframe(conversationData.timeframe || props.timeframe);
    props.setCosts(Number(conversationData.costs) || props.costs);
    props.setInsuranceSum(conversationData.insuranceSum || props.insuranceSum);
    props.setRiskDetails(conversationData.details || props.riskDetails);

    //setLoadingExtractInformation(false);
  };

  // Automatically extract data when the dialog opens
  useEffect(() => {
    handleDataExtraction();
  }, []); // Runs only once when the component mounts

  const handleNotificationsUpdate = async () => {
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
      message: `${senderName} hat Konditionen für eine Risikovereinbarung zu ${activeChat?.topic} vorgeschlagen`,
      chatroomId: chatroomId!,
      status: NotificationStatusEnum.UNREAD,
      createdAt: serverTimestamp(),
    };

    dispatch(
      addNotification({ uid: recipient, newNotification: newNotification })
    );
  };

  const handleRiskAgreementProposition = () => {
    const isRiskTaker = activeChat?.riskTaker.uid === auth?.currentUser?.uid;

    const riskGiverApprovals = isRiskTaker // if riskTaker, riskGiver has to approve and vice versa
      ? {
          costs: false,
          insuranceSum: false,
          timeframe: false,
          evidence: false,
          details: false,
        }
      : {
          costs: true,
          insuranceSum: true,
          timeframe: true,
          evidence: true,
          details: true,
        };

    const riskTakerApprovals = isRiskTaker // if riskTaker, riskTaker has to approve and vice versa
      ? {
          costs: true,
          insuranceSum: true,
          timeframe: true,
          evidence: true,
          details: true,
        }
      : {
          costs: false,
          insuranceSum: false,
          timeframe: false,
          evidence: false,
          details: false,
        };

    const newRiskAgreement: RiskAgreement = {
      id: uuidv4(),
      riskId: props.risk?.id ? props.risk?.id : "",
      riskTakerId: activeChat?.riskTaker.uid ? activeChat?.riskTaker.uid : "",
      riskGiverId: activeChat?.riskProvider.uid
        ? activeChat?.riskProvider.uid
        : "",
      chatId: activeChat?.id ? activeChat?.id : "",
      title: props.riskTitle,
      type: props.riskType,
      insuranceSum: props.insuranceSum,
      costs: props.costs,
      timeframe: props.timeframe,
      evidence: props.evidence,
      details: props.riskDetails,
      riskGiverApprovals: riskGiverApprovals,
      riskTakerApprovals: riskTakerApprovals,
    };

    dispatch(addMyRiskAgreement(newRiskAgreement));
    handleNotificationsUpdate()
      .then(() => {
        showSnackbar(
          "Risikovereinbarung versendet!",
          `Dein Vorschlag wurde an ${
            activeChat?.riskTaker.uid === auth?.currentUser?.uid
              ? activeChat?.riskProvider.name
              : activeChat?.riskTaker.name
          } gesendet.`,
          { vertical: "top", horizontal: "center" },
          "success"
        );
      })
      .catch((error) => {
        console.error("Error adding notification:", error);
        showSnackbar(
          "Fehler beim Senden der Benachrichtigung!",
          "Dein Vorschlag konnte nicht gesendet werden. Versuche es erneut.",
          { vertical: "top", horizontal: "center" },
          "error"
        );
      });
  };

  return (
    <>
      <DialogContentText>
        <Trans
          i18nKey={"risk_agreement.risk_agreement_definition.dialog_context_1"}
        />{" "}
        <br />
        <Trans
          i18nKey={"risk_agreement.risk_agreement_definition.dialog_context_2"}
        />{" "}
        <br />
        <Trans
          i18nKey={"risk_agreement.risk_agreement_definition.dialog_context_3"}
        />
      </DialogContentText>

      <RiskAgreementHeader
        riskTitle={props.riskTitle}
        riskType={props.riskType}
      />

      <RiskAgreementForm
        timeframe={props.timeframe}
        setTimeframe={props.setTimeframe}
        evidence={props.evidence}
        setEvidence={props.setEvidence}
        costs={props.costs}
        setCosts={props.setCosts}
        insuranceSum={props.insuranceSum}
        setInsuranceSum={props.setInsuranceSum}
        riskDetails={props.riskDetails}
        setRiskDetails={props.setRiskDetails}
      />

      <DialogActions>
        {/* <Button
          disabled={loadingExtractInformation}
          onClick={handleDataExtraction}
        >
          {loadingExtractInformation && (
            <CircularProgress
              size={24}
              color="inherit"
              style={{ marginRight: "5px" }}
            />
          )}
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_definition.dialog_action_button1"
            }
          />
        </Button> */}
        <Button
          onClick={handleRiskAgreementProposition}
          variant="contained"
          color="primary"
        >
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_definition.dialog_action_button2"
            }
          />
        </Button>
        <Button onClick={props.handleClose} variant="contained">
          <Trans
            i18nKey={
              "risk_agreement.risk_agreement_definition.dialog_action_button3"
            }
          />
        </Button>
      </DialogActions>
    </>
  );
};
