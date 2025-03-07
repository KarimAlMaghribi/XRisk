import React, {useEffect, useState, useRef} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {NumericFormat} from 'react-number-format';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routing/routes";
import {RiskAgreement} from "../../models/RiskAgreement";
import {addMyRiskAgreement, updateMyRiskAgreement} from "../../store/slices/my-risk-agreements/thunks";
import {Risk} from "../../models/Risk";
import OpenAI from "openai";
import { selectActiveChat, selectActiveMessages, selectRiskId } from "../../store/slices/my-bids/selectors";
import { Chat, ChatMessage } from "../../store/slices/my-bids/types";
import { selectRisks } from "../../store/slices/risks/selectors";
import { DataExtractionBot } from "../../extraction/DataExtractionBot";
import { zodResponseFormat } from "openai/helpers/zod";
import { number, z } from "zod";
import { selectActiveRiskAgreement } from "../../store/slices/my-risk-agreements/selectors";
import { auth } from "../../firebase_config";
import ToolTip from '@mui/material/Tooltip';
import { doc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase_config";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {updateRiskStatus} from "../../store/slices/risks/thunks";
import {deleteUnagreedChats} from "../../store/slices/my-bids/thunks";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import { addNotification } from "../../store/slices/my-notifications/thunks";
import { NotificationStatusEnum } from "../../enums/Notifications.enum";
import { Timestamp } from "firebase/firestore";
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { Typography } from "@mui/material/styles/createTypography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandableTextField from "./expandable-textfield";


export interface RiskAgreementDialogProps {
    open: boolean;
    handleClose: () => void;
}

const EuroNumberFormat = React.forwardRef(function EuroNumberFormat(props: any, ref) {
    const {onChange, ...other} = props;
    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values: any) => {
                onChange({
                    target: {
                        value: values.value,
                        name: props.name
                    }
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="€ "
        />
    );
});

export const MyRiskAgreementDialog = (props: RiskAgreementDialogProps) => {
    const dispatch: AppDispatch = useDispatch();

  const [costs, setCosts] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<string>("");
  const [evidence, setEvidence] = useState<string>("");
  const [insuranceSum, setInsuranceSum] = useState<number>(0);
  const [riskDetails, setRiskDetails] = useState<string>("");

  const activeChat: Chat | undefined = useSelector(selectActiveChat);

  const riskId = useSelector(selectRiskId);
  const risks = useSelector(selectRisks);
  const risk: Risk | undefined = risks.find((risk) => risk.id === riskId);
  const riskTitle = risk?.name ? risk?.name : "";
  const riskType = risk?.type ? risk.type : [];

  const existingAgreement = useSelector(selectActiveRiskAgreement);

  // colors
  const [timeframeColor, setTimeframeColor] = useState("grey");
  const [evidenceColor, setEvidenceColor] = useState("grey");
  const [insuranceSumColor, setInsuranceSumColor] = useState("grey");
  const [costsColor, setCostsColor] = useState("grey");
  const [detailsColor, setDetailsColor] = useState("grey");

    const [agreement, SetAgreement] = useState(false);

    const [affirmation, SetAffirmation] = useState(false);

  const previousAgreementRef = useRef<RiskAgreement | null>(null); // Store previous agreeme

  const { showSnackbar } = useSnackbarContext();

  const checkEquality = () => {
    if (existingAgreement) {
      let checkValid: boolean = true;

      if (
        existingAgreement?.riskGiverApprovals.timeframe ===
        existingAgreement?.riskTakerApprovals.timeframe
      ) {
        setTimeframeColor("grey");
        checkValid = checkValid && true;
      } else {
        checkValid = checkValid && false;
      }
      if (
        existingAgreement?.riskGiverApprovals.evidence ===
        existingAgreement?.riskTakerApprovals.evidence
      ) {
        setEvidenceColor("grey");
        checkValid = checkValid && true;
      } else {
        checkValid = checkValid && false;
      }
      if (
        existingAgreement?.riskGiverApprovals.costs ===
        existingAgreement?.riskTakerApprovals.costs
      ) {
        setCostsColor("grey");
        checkValid = checkValid && true;
      } else {
        checkValid = checkValid && false;
      }
      if (
        existingAgreement?.riskGiverApprovals.insuranceSum ===
        existingAgreement?.riskTakerApprovals.insuranceSum
      ) {
        setInsuranceSumColor("grey");
        checkValid = checkValid && true;
      } else {
        checkValid = checkValid && false;
      }
      if (
        existingAgreement?.riskGiverApprovals.details ===
        existingAgreement?.riskTakerApprovals.details
      ) {
        setDetailsColor("grey");
        checkValid = checkValid && true;
      } else {
        checkValid = checkValid && false;
      }

      setAgreement(checkValid);
    } else {
      setAgreement(false);
    }
  };

  useEffect(() => {
    checkEquality();

    if (
      !existingAgreement?.riskGiverApprovals.timeframe ||
      !existingAgreement?.riskTakerApprovals.timeframe
    ) {
      setTimeframeColor("red");
    }

    if (
      !existingAgreement?.riskGiverApprovals.evidence ||
      !existingAgreement?.riskTakerApprovals.evidence
    ) {
      setEvidenceColor("red");
    }

    if (
      !existingAgreement?.riskGiverApprovals.costs ||
      !existingAgreement?.riskTakerApprovals.costs
    ) {
      setCostsColor("red");
    }

    if (
      !existingAgreement?.riskGiverApprovals.insuranceSum ||
      !existingAgreement?.riskTakerApprovals.insuranceSum
    ) {
      setInsuranceSumColor("red");
    }

        if ((!(existingAgreement?.riskGiverApprovals.details) || !(existingAgreement?.riskTakerApprovals.details))){
            setDetailsColor("red");
        }
        

    }, [
        existingAgreement?.timeframe,
        existingAgreement?.evidence,
        existingAgreement?.costs,
        existingAgreement?.insuranceSum,
        existingAgreement?.details,
        existingAgreement?.riskGiverApprovals.costs,
        existingAgreement?.riskGiverApprovals.details,
        existingAgreement?.riskGiverApprovals.evidence,
        existingAgreement?.riskGiverApprovals.insuranceSum,
        existingAgreement?.riskGiverApprovals.timeframe,
        existingAgreement?.riskTakerApprovals.costs,
        existingAgreement?.riskTakerApprovals.details,
        existingAgreement?.riskTakerApprovals.evidence,
        existingAgreement?.riskTakerApprovals.insuranceSum,
        existingAgreement?.riskTakerApprovals.timeframe,
    ]);
    
    
    
    
    
    React.useEffect(() => {
        if (existingAgreement) {
            setCosts(existingAgreement.costs);
            setTimeframe(existingAgreement.timeframe);
            setEvidence(existingAgreement.evidence);
            setInsuranceSum(existingAgreement.insuranceSum);
            setRiskDetails(existingAgreement.details);
        }
        else {
            setCosts(0);
            setTimeframe('');
            setEvidence('');
            setInsuranceSum(risk?.value || 0);
            setRiskDetails('');
        }
    }, [existingAgreement]);

  //data extraction

  const activeMessages: ChatMessage[] = useSelector(selectActiveMessages);
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

    const handleNotificationsUpdate = async () => {
        const recipient = activeChat?.riskTaker.uid === auth.currentUser?.uid ? activeChat?.riskProvider.uid : activeChat?.riskTaker.uid;
        const senderName = activeChat?.riskTaker.uid !== auth.currentUser?.uid ? activeChat?.riskProvider.name : activeChat?.riskTaker.name;
        const chatroomId = activeChat?.id;

        const newNotification = {
            message: `${activeChat?.topic} agreement was updated by ${senderName}`,
            chatroomId: chatroomId!,
            status: NotificationStatusEnum.UNREAD,
            createdAt: serverTimestamp()
            };

        dispatch(addNotification({uid: recipient, newNotification: newNotification}));
    }

  const handleDataExtraction = async (e: any) => {
    const dataExtractionBot = new DataExtractionBot(risk, activeMessages);
    const promptMessages = dataExtractionBot.getMessages();

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: promptMessages,
      response_format: zodResponseFormat(DataSchema, "conversationData"),
      stream: false,
      //max_tokens: 200,
      temperature: 0.5,
      top_p: 0.4,
      presence_penalty: 0.4,
      frequency_penalty: 0.0,
    });

    const conversationData = completion.choices[0].message.parsed;

    if (!conversationData) {
      console.error("No response from OpenAI:", conversationData);
      return;
    }

    if (conversationData.evidence) {
      setEvidence(conversationData.evidence);
    }
    if (conversationData.timeframe) {
      setTimeframe(conversationData.timeframe);
    }
    if (conversationData.costs) {
      setCosts(Number(conversationData.costs));
    }
    if (conversationData.insuranceSum) {
      setInsuranceSum(conversationData.insuranceSum);
    }
    if (conversationData.details) {
      setRiskDetails(conversationData.details);
    }
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  const handleEvidenceChange = (newEvidence: string) => {
    setEvidence(newEvidence);
  };

    const handleCostsChange = (newCosts: string | undefined) => {
        if (!newCosts) {
            return; // Exit function if undefined or null
        }
    
        let newCostsNumber = Number(newCosts.replace(/€\s?|(,*)/g, ''));
        if (!isNaN(newCostsNumber)) {
            setCosts(newCostsNumber);
        }
    }
  };

    const handleInsuranceSumChange = (newInsuranceSum: string | undefined) => {
        if (!newInsuranceSum) {
            return; // Exit function if undefined or null
        }
    
        let newInsuranceSumNumber = Number(newInsuranceSum.replace(/€\s?|(,*)/g, ''));
        if (!isNaN(newInsuranceSumNumber)) {
            setInsuranceSum(newInsuranceSumNumber);
        }
    }
  };

  const handleDetailsChange = (newDetails: string) => {
    if (riskDetails !== newDetails) {
      setRiskDetails(newDetails);
    }
  };

  const handleClose = () => {
    props.handleClose();
  };

  const handleAffirmRiskAgreement = () => {
    if (activeChat) {
      if (existingAgreement) {
        if (activeChat?.riskTaker.uid === auth?.currentUser?.uid) {
          const costsApproved =
            existingAgreement.riskGiverApprovals.costs &&
            existingAgreement.costs === costs;
          const timeframeApproved =
            existingAgreement.riskGiverApprovals.timeframe &&
            existingAgreement.timeframe === timeframe;
          const insuranceSumApproved =
            existingAgreement.riskGiverApprovals.insuranceSum &&
            existingAgreement.insuranceSum === insuranceSum;
          const evidenceApproved =
            existingAgreement.riskGiverApprovals.evidence &&
            existingAgreement.evidence === evidence;
          const detailsApproved =
            existingAgreement.riskGiverApprovals.details &&
            existingAgreement.details === riskDetails;

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
            existingAgreement.costs === costs;
          const timeframeApproved =
            existingAgreement.riskTakerApprovals.timeframe &&
            existingAgreement.timeframe === timeframe;
          const insuranceSumApproved =
            existingAgreement.riskTakerApprovals.insuranceSum &&
            existingAgreement.insuranceSum === insuranceSum;
          const evidenceApproved =
            existingAgreement.riskTakerApprovals.evidence &&
            existingAgreement.evidence === evidence;
          const detailsApproved =
            existingAgreement.riskTakerApprovals.details &&
            existingAgreement.details === riskDetails;

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
          insuranceSum: insuranceSum,
          costs: costs,
          timeframe: timeframe,
          evidence: evidence,
          details: riskDetails,
          riskGiverApprovals: riskGiverApprovals,
          riskTakerApprovals: riskTakerApprovals,
        };
        dispatch(updateMyRiskAgreement(updatedRiskAgreement));
        handleNotificationsUpdate();

      } else {
        var riskGiverApprovals;
        var riskTakerApprovals;

        if (activeChat?.riskTaker.uid === auth?.currentUser?.uid) {
          riskGiverApprovals = {
            costs: false,
            insuranceSum: false,
            timeframe: false,
            evidence: false,
            details: false,
          };
          riskTakerApprovals = {
            costs: true,
            insuranceSum: true,
            timeframe: true,
            evidence: true,
            details: true,
          };
        } else {
          riskGiverApprovals = {
            costs: true,
            insuranceSum: true,
            timeframe: true,
            evidence: true,
            details: true,
          };
          riskTakerApprovals = {
            costs: false,
            insuranceSum: false,
            timeframe: false,
            evidence: false,
            details: false,
          };
        }

        const newRiskAgreement: RiskAgreement = {
          id: uuidv4(),
          riskId: risk?.id ? risk?.id : "",
          riskTakerId: activeChat?.riskTaker.uid
            ? activeChat?.riskTaker.uid
            : "",
          riskGiverId: activeChat?.riskProvider.uid
            ? activeChat?.riskProvider.uid
            : "",
          chatId: activeChat?.id ? activeChat?.id : "",
          title: riskTitle,
          type: riskType,
          insuranceSum: insuranceSum,
          costs: costs,
          timeframe: timeframe,
          evidence: evidence,
          details: riskDetails,
          riskGiverApprovals: riskGiverApprovals,
          riskTakerApprovals: riskTakerApprovals,
        };
        dispatch(addMyRiskAgreement(newRiskAgreement));
      }
    }

        //handleClose();
    }

  const handleComingToTherms = () => {
    if (!existingAgreement) {
      showSnackbar(
        "Einigung Fehlgeschlagen!",
        "Bestehende Einigung konnte nicht gefunden werden!",
        { vertical: "top", horizontal: "center" },
        "error"
      );
      return;
    }

    if (!riskId) {
      showSnackbar(
        "Einigung Fehlgeschlagen!",
        "Risiko konnte nicht gefunden werden!",
        { vertical: "top", horizontal: "center" },
        "error"
      );
      return;
    }

    dispatch(updateMyRiskAgreement({ ...existingAgreement!, agreed: true }));
    dispatch(
      updateRiskStatus({
        status: RiskStatusEnum.AGREEMENT,
        id: existingAgreement.riskId,
      })
    );
    dispatch(
      deleteUnagreedChats({ riskId: riskId, chatId: existingAgreement.chatId })
    );

        // remove risk from riskOverview
        // Grey out Riskargreement Infos and Buttons
        // move to my-risks/geeinigt


    }

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Risikovereinbarung</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Haltet nochmal fest, was vereinbart wurde!
        </DialogContentText>

                <br/>
                <TextField
                    margin="dense"
                    fullWidth
                    label="Titel"
                    value={riskTitle}
                    disabled={true}
                    name="title"
                    id="title"
                />
                <TextField
                    margin="dense"
                    fullWidth
                    label="Art des Risikos"
                    value={riskType}
                    disabled={true}
                    name="riskType"
                    id="riskType"
                />
                <TextField
                    margin="dense"
                    fullWidth
                    label="Risikogeber"
                    value={activeChat?.riskProvider.name}
                    disabled={true}
                    name="riskGiver"
                    id="riskGiver"
                />
                <TextField
                    margin="dense"
                    fullWidth
                    label="Risikonehmer"
                    value={activeChat?.riskTaker.name}
                    disabled={true}
                    name="riskTaker"
                    id="riskTaker"
                />
                <ExpandableTextField 
                    name = "timeframe"
                    id = "timeframe"
                    label="Zeitspanne"
                    value={timeframe}
                    borderColor={timeframeColor}
                    handlerFunction={handleTimeframeChange}
                />
                <ExpandableTextField 
                    name = "evidence"
                    id = "evidence"
                    label="Beweismittel"
                    value={evidence}
                    borderColor={evidenceColor}
                    handlerFunction={handleEvidenceChange}
                />
                <ExpandableTextField 
                name = "costs"
                id = "costs"
                label="Kosten"
                value={costs}
                borderColor={costsColor}
                handlerFunction={handleCostsChange}
                inputProps={{
                    inputComponent: EuroNumberFormat,
                }}
                />
                <ExpandableTextField 
                    name = "insuranceSum"
                    id = "insuranceSum"
                    label="Absicherungssumme"
                    value={insuranceSum}
                    borderColor={insuranceSumColor}
                    handlerFunction={handleInsuranceSumChange}
                    inputProps={{
                        inputComponent: EuroNumberFormat,
                    }}
                />
                <ExpandableTextField 
                    name = "details"
                    id = "details"
                    label="Sonstige Anmerkungen"
                    value={riskDetails}
                    borderColor={detailsColor}
                    handlerFunction={handleDetailsChange}
                />

            </DialogContent>
            <DialogActions>
                <Button
                    disabled={!agreement}
                    variant="contained"
                    onClick={handleComingToTherms}
                    color="success">
                    Einigen
                </Button>
                <Button
                    variant="contained"
                    onClick={handleDataExtraction}>
                    Automatisch füllen
                </Button>
                <Button
                    disabled={insuranceSumRequiredError || costsRequiredError}
                    variant="contained"
                    onClick={handleAffirmRiskAgreement}>
                    Bestätigen
                </Button>
                <Button
                    onClick={handleClose}
                    variant="outlined">
                    Abbrechen
                </Button>
            </DialogActions>
        </Dialog>
    )

}
