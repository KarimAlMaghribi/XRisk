import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stepper,
  Step,
  StepLabel,
  DialogContentText,
  TextField,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { DataExtractionBot } from "../../extraction/DataExtractionBot";
import { Risk } from "../../models/Risk";
import {
  selectActiveChat,
  selectRiskId,
  selectActiveMessages,
} from "../../store/slices/my-bids/selectors";
import { v4 as uuidv4 } from "uuid";
import { Chat, ChatMessage } from "../../store/slices/my-bids/types";
import { selectActiveRiskAgreement } from "../../store/slices/my-risk-agreements/selectors";
import { selectRisks } from "../../store/slices/risks/selectors";
import { NumericFormat } from "react-number-format";
import { auth } from "../../firebase_config";
import { RiskAgreement } from "../../models/RiskAgreement";
import {
  updateMyRiskAgreement,
  addMyRiskAgreement,
} from "../../store/slices/my-risk-agreements/thunks";
import { AppDispatch } from "../../store/store";
import { NotificationStatusEnum } from "../../enums/Notifications.enum";
import { addNotification } from "../../store/slices/my-notifications/thunks";
import { serverTimestamp } from "firebase/firestore";

interface RiskStepperDialogProps {
  open: boolean;
  handleClose: () => void;
}

const EuroNumberFormat = React.forwardRef(function EuroNumberFormat(
  props: any,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values: any) => {
        onChange({
          target: {
            value: values.value,
            name: props.name,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="€ "
    />
  );
});

export default function RiskStepperDialog({
  open,
  handleClose,
}: RiskStepperDialogProps) {
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

  const steps = [
    "Risikovereinbarung definieren",
    "Einigung finden",
    "Vertrag erstellen",
  ];

  const currentStep = () => {
    if (!existingAgreement) {
      return 0;
    }
    const riskGiverApproved = Object.values(
      existingAgreement.riskGiverApprovals
    ).every((approval) => approval === true);
    const riskTakerApproved = Object.values(
      existingAgreement.riskTakerApprovals
    ).every((approval) => approval === true);
    if (riskGiverApproved && riskTakerApproved) {
      return 2;
    }
    return 1;
  };

  const [activeStep, setActiveStep] = useState(0);
  const [hasApprovedExistingAgreement, setApprovedExistingAgreement] =
    useState(false);

  React.useEffect(() => {
    setActiveStep(currentStep());
  }, [existingAgreement]);

  const riskAgreementChanged = () => {
    if (!existingAgreement) return false;

    return !(
      existingAgreement.costs == costs &&
      existingAgreement.insuranceSum == insuranceSum &&
      existingAgreement.timeframe == timeframe &&
      existingAgreement.evidence == evidence &&
      existingAgreement.details == riskDetails
    );
  };

  const checkApprovedExistingAgreement = () => {
    if (!existingAgreement) {
      return false;
    }

    const isRiskGiver =
      existingAgreement.riskGiverId === auth?.currentUser?.uid;

    const userApprovals = isRiskGiver
      ? existingAgreement.riskGiverApprovals
      : existingAgreement.riskTakerApprovals;

    const userHasApprovedAll = Object.values(userApprovals).every(
      (approval) => approval === true
    );

    return userHasApprovedAll;
  };

  React.useEffect(() => {
    setApprovedExistingAgreement(checkApprovedExistingAgreement());
  }, [existingAgreement]);

  React.useEffect(() => {
    if (existingAgreement) {
      setCosts(existingAgreement.costs);
      setTimeframe(existingAgreement.timeframe);
      setEvidence(existingAgreement.evidence);
      setInsuranceSum(existingAgreement.insuranceSum);
      setRiskDetails(existingAgreement.details);
    } else {
      setCosts(0);
      setTimeframe("");
      setEvidence("");
      setInsuranceSum(risk?.value || 0);
      setRiskDetails("");
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

  const handleCostsChange = (newCosts: number) => {
    if (!isNaN(newCosts)) {
      setCosts(newCosts);
    }
  };

  const handleInsuranceSumChange = (newInsuranceSum: number) => {
    if (!isNaN(newInsuranceSum)) {
      setInsuranceSum(newInsuranceSum);
    }
  };

  const handleDetailsChange = (newDetails: string) => {
    if (riskDetails !== newDetails) {
      setRiskDetails(newDetails);
    }
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
  };

  const handleWithdrawApprovals = () => {
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
        handleNotificationsUpdate();
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
        handleNotificationsUpdate();
      }
    }
  };

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
      message: `${activeChat?.topic} agreement was updated by ${senderName}`,
      chatroomId: chatroomId!,
      status: NotificationStatusEnum.UNREAD,
      createdAt: serverTimestamp(),
    };

    dispatch(
      addNotification({ uid: recipient, newNotification: newNotification })
    );
  };

  const Step1 = (
    <div>
      <DialogContentText>
        Haltet nochmal fest, was vereinbart wurde! <br />
        Diese Informationen werden später Bestandteil des Vertrags. <br />
        Nutze die KI, um das Formular basierend auf dem Chat automatisch
        auszufüllen, oder gib die Daten manuell ein.
      </DialogContentText>
      <br />
      <Typography variant="subtitle1">
        <strong>Titel:</strong> {riskTitle}
      </Typography>
      <Typography variant="subtitle1">
        <strong>Art des Risikos:</strong> {riskType}
      </Typography>
      <Typography variant="subtitle1">
        <strong>Risikogeber:</strong> {activeChat?.riskProvider.name}
      </Typography>
      <Typography variant="subtitle1">
        <strong>Risikonehmer:</strong> {activeChat?.riskTaker.name}
      </Typography>
      <br />
      <TextField
        margin="dense"
        fullWidth
        label="Zeitspanne"
        value={timeframe}
        onChange={(event) => handleTimeframeChange(event.target.value)}
        name="timeFrame"
        id="timeFrame"
      />
      <TextField
        margin="dense"
        fullWidth
        label="Beweismittel"
        value={evidence}
        onChange={(event) => handleEvidenceChange(event.target.value)}
        name="evidence"
        id="evidence"
        InputProps={{
          endAdornment: (
            <Tooltip title="Die Beweise, die im Schadenfall vom Risikogeber vorgelegt werden müssen.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
      <TextField
        margin="dense"
        fullWidth
        label="Kosten"
        color="secondary"
        value={costs}
        onChange={(event) =>
          handleCostsChange(
            Number(event.target.value.replace(/€\s?|(,*)/g, ""))
          )
        }
        name="costs"
        id="costs"
        InputProps={{
          endAdornment: (
            <Tooltip title="Die Kosten, die der Risikogeber an den Risikonehmer bei Abschluss des Vertrags zahlen muss.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
          inputComponent: EuroNumberFormat,
        }}
      />
      <TextField
        margin="dense"
        fullWidth
        label="Absicherungssumme"
        value={insuranceSum}
        onChange={(event) =>
          handleInsuranceSumChange(
            Number(event.target.value.replace(/€\s?|(,*)/g, ""))
          )
        }
        name="insuranceSum"
        id="insuranceSum"
        InputProps={{
          endAdornment: (
            <Tooltip title="Die im Schadenfall maximal an den Risikogeber auszuzahlende Summe.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
          inputComponent: EuroNumberFormat,
        }}
      />
      <TextField
        margin="dense"
        fullWidth
        multiline
        label="Sonstige Anmerkungen"
        value={riskDetails}
        onChange={(event) => handleDetailsChange(event.target.value)}
        name="details"
        id="details"
        InputProps={{
          endAdornment: (
            <Tooltip title="Hier könnt ihr alle weiteren vertraglich relevanten Informationen festhalten.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
    </div>
  );

  const Step2 = (
    <div>
      <DialogContentText>
        Haltet nochmal fest, was vereinbart wurde! <br />
        Diese Informationen werden später Bestandteil des Vertrags.
      </DialogContentText>
      <br />
      {hasApprovedExistingAgreement && (
        <DialogContentText>
          Du hast dein Angebot abgegeben. <br />
          Warte auf die Zustimmung deines Verhandlungspartners.
        </DialogContentText>
      )}
      {!hasApprovedExistingAgreement && (
        <DialogContentText>
          Die folgende Vereinbarung wurde vorgeschlagen. <br />
          Stimme der aktuellen Risikovereinbarung zu oder passe die Punkte an,
          mit denen du nicht einverstanden bist.
        </DialogContentText>
      )}
      <br />
      <Typography variant="subtitle1">
        <strong>Titel:</strong> {riskTitle}
      </Typography>
      <Typography variant="subtitle1">
        <strong>Art des Risikos:</strong> {riskType}
      </Typography>
      <Typography variant="subtitle1">
        <strong>Risikogeber:</strong> {activeChat?.riskProvider.name}
      </Typography>
      <Typography variant="subtitle1">
        <strong>Risikonehmer:</strong> {activeChat?.riskTaker.name}
      </Typography>
      <br />
      <TextField
        margin="dense"
        fullWidth
        label="Zeitspanne"
        value={timeframe}
        onChange={(event) => handleTimeframeChange(event.target.value)}
        name="timeFrame"
        id="timeFrame"
      />
      <TextField
        margin="dense"
        fullWidth
        label="Beweismittel"
        value={evidence}
        onChange={(event) => handleEvidenceChange(event.target.value)}
        name="evidence"
        id="evidence"
        InputProps={{
          endAdornment: (
            <Tooltip title="Die Beweise, die im Schadenfall vom Risikogeber vorgelegt werden müssen.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
      <TextField
        margin="dense"
        fullWidth
        label="Kosten"
        color="secondary"
        value={costs}
        onChange={(event) =>
          handleCostsChange(
            Number(event.target.value.replace(/€\s?|(,*)/g, ""))
          )
        }
        name="costs"
        id="costs"
        InputProps={{
          endAdornment: (
            <Tooltip title="Die Kosten, die der Risikogeber an den Risikonehmer bei Abschluss des Vertrags zahlen muss.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
          inputComponent: EuroNumberFormat,
        }}
      />
      <TextField
        margin="dense"
        fullWidth
        label="Absicherungssumme"
        value={insuranceSum}
        onChange={(event) =>
          handleInsuranceSumChange(
            Number(event.target.value.replace(/€\s?|(,*)/g, ""))
          )
        }
        name="insuranceSum"
        id="insuranceSum"
        InputProps={{
          endAdornment: (
            <Tooltip title="Die im Schadenfall maximal an den Risikogeber auszuzahlende Summe.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
          inputComponent: EuroNumberFormat,
        }}
      />
      <TextField
        margin="dense"
        fullWidth
        multiline
        label="Sonstige Anmerkungen"
        value={riskDetails}
        onChange={(event) => handleDetailsChange(event.target.value)}
        name="details"
        id="details"
        InputProps={{
          endAdornment: (
            <Tooltip title="Hier könnt ihr alle weiteren vertraglich relevanten Informationen festhalten.">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
    </div>
  );
  const Step3 = <div>Risikovereinbarung abgeschlossen</div>;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Risk Management</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ marginTop: 20 }}>
          {activeStep === 0 && Step1}
          {activeStep === 1 && Step2}
          {activeStep === 2 && Step3}
        </div>
      </DialogContent>

      <DialogActions>
        {activeStep == 0 && (
          <Button onClick={handleDataExtraction}>Aus Chat übernehmen</Button>
        )}
        {activeStep == 0 && (
          <Button
            onClick={handleAffirmRiskAgreement}
            variant="contained"
            color="primary"
          >
            Vereinbarung vorschlagen
          </Button>
        )}
        {activeStep == 0 && (
          <Button onClick={handleClose} variant="contained">
            Abbrechen
          </Button>
        )}
        {activeStep == 1 && hasApprovedExistingAgreement && (
          <Button onClick={handleWithdrawApprovals} variant="contained">
            Zustimmung zurückziehen
          </Button>
        )}
        {activeStep == 1 && (
          <Button
            onClick={handleAffirmRiskAgreement}
            variant="contained"
            disabled={!riskAgreementChanged()}
            color="primary"
          >
            Vorschlag anpassen
          </Button>
        )}
        {activeStep == 1 && !hasApprovedExistingAgreement && (
          <Button
            onClick={handleAffirmRiskAgreement}
            variant="contained"
            disabled={riskAgreementChanged()}
            color="primary"
          >
            Vereinbarung zustimmen
          </Button>
        )}
        {activeStep == steps.length - 1 && (
          <Button onClick={handleClose} variant="contained" color="primary">
            Fertigstellen
          </Button>
        )}
        {activeStep > 0 && (
          <Button onClick={handleClose} variant="contained">
            Schließen
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
