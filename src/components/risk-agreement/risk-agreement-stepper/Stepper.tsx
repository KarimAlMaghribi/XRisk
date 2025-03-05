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
} from "@mui/material";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { useSelector } from "react-redux";
import { z } from "zod";
import { DataExtractionBot } from "../../../extraction/DataExtractionBot";
import { Risk } from "../../../models/Risk";
import {
  selectActiveChat,
  selectRiskId,
  selectActiveMessages,
} from "../../../store/slices/my-bids/selectors";
import { Chat, ChatMessage } from "../../../store/slices/my-bids/types";
import { selectActiveRiskAgreement } from "../../../store/slices/my-risk-agreements/selectors";
import { selectRisks } from "../../../store/slices/risks/selectors";
import { NumericFormat } from "react-number-format";
import Step2 from "./Step2";
import Step3 from "./Step3";

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
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Schritt 1", "Schritt 2", "Schritt 3"];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

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

  const Step1 = (
    <div>
      <br />
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
      />
    </div>
  );

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
          <DialogContentText>
            Haltet nochmal fest, was vereinbart wurde!
          </DialogContentText>

          {activeStep === 0 && Step1}
          {activeStep === 1 && <Step2 />}
          {activeStep === 2 && <Step3 />}
        </div>
      </DialogContent>

      <DialogActions>
        {activeStep == 0 && (
          <Button onClick={handleNext}>Risikovereinbarung vorschlagen</Button>
        )}
        {activeStep == 0 && (
          <Button onClick={handleDataExtraction}>Automatisch füllen</Button>
        )}
        {activeStep > 0 && <Button onClick={handleBack}>Zurück</Button>}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained">
            Weiter
          </Button>
        ) : (
          <Button onClick={handleClose} variant="contained" color="primary">
            Fertigstellen
          </Button>
        )}
        <Button onClick={handleClose} color="secondary">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
