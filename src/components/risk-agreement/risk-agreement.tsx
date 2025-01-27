import React, {useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {NumericFormat} from 'react-number-format';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routing/routes";
import {RiskAgreement} from "../../models/RiskAgreement";
import {addMyRiskAgreement} from "../../store/slices/my-risk-agreements/thunks";
import {Risk} from "../../models/Risk";
import OpenAI from "openai";
import { selectActiveChat, selectActiveMessages, selectRiskId } from "../../store/slices/my-bids/selectors";
import { Chat, ChatMessage } from "../../store/slices/my-bids/types";
import { selectRisks } from "../../store/slices/risks/selectors";
import { DataExtractionBot } from "../../extraction/DataExtractionBot";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

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
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [costs, setCosts] = useState<number>(0);
    const [timeframe, setTimeframe] = useState<string>('');
    const [evidence, setEvidence] = useState<string>('');
    const [insuranceSum, setInsuranceSum] = useState<number>(0);
    const [riskDetails, setRiskDetails] = useState<string>('');
    const [insuranceSumRequiredError, setInsuranceSumRequiredError] = useState<boolean>(false);
    const [costsRequiredError, setCostsRequiredError] = useState<boolean>(false);


    //useEffect(() => {
    //    if (!title && !nameRequiredError) {
    //        setNameRequiredError(true);
    //    }
//
    //    if (title && nameRequiredError) {
    //        setNameRequiredError(false);
    //    }
    //}, [title]);

    const activeChat: Chat | undefined = useSelector(selectActiveChat);

    const riskId = useSelector(selectRiskId);
    const risks = useSelector(selectRisks);
    console.log('risks' + risks)
    console.log('firstRiskId' + risks.at(0)?.id)
    const risk: Risk | undefined = risks.find((risk) => risk.id === riskId);
    const riskTitle = risk?.name ? risk?.name : '';
    const riskType = risk?.type ? risk.type : [];

    //data extraction

    const activeMessages: ChatMessage[] = useSelector(selectActiveMessages);
    const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

    const DataSchema = z.object({
        insuranceSum : z.number(),
        costs : z.number(),
        timeframe : z.string(),
        evidence : z.string(),
        details : z.string(),
    })

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
            frequency_penalty: 0.0
          });
          
        const conversationData = completion.choices[0].message.parsed;

        if (!conversationData) {
            console.error("No response from OpenAI:", conversationData);
            return;
        }

        // Set the extracted values into state
        if (conversationData.evidence) {
            setEvidence(conversationData.evidence);
        }
        if (conversationData.timeframe) {
            setTimeframe(conversationData.timeframe); // Assuming "Zeitspanne" corresponds to evidence
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

        console.log(conversationData)
    }

    const handleTimeframeChange = (newTimeframe: string) => {
        setTimeframe(newTimeframe);
    }

    const handleEvidenceChange = (newEvidence: string) => {
        setEvidence(newEvidence);
    }

    const handleCostsChange = (newCosts: number) => {
        if (!isNaN(newCosts)) {
            setCosts(newCosts);
        }
    }

    const handleInsuranceSumChange = (newInsuranceSum: number) => {
        if (!isNaN(newInsuranceSum)) {
            setInsuranceSum(newInsuranceSum);
        }
    }

    const handleDetailsChange = (newDetails: string) => {
        setRiskDetails(newDetails);
    }

    const handleClose = () => {
        //setTitle('');
        //setDescription('');
        //setRiskType([]);
        //setCosts(0);
        //setDate(dayjs());
        props.handleClose();
    }

    const handleCreateRiskAgreement = () => {
        //if (!title) {
        //    setNameRequiredError(true);
        //    return;
        //}

        const newRiskAgreement: RiskAgreement = {
            id: uuidv4(),
            riskId: risk?.id ? risk?.id : '',
            riskTakerId: activeChat?.riskTaker.uid ? activeChat?.riskTaker.uid : '',
            riskGiverId: activeChat?.riskProvider.uid ? activeChat?.riskProvider.uid : '',
            chatId: activeChat?.id ? activeChat?.id : '',
            title: riskTitle,
            type: riskType,
            insuranceSum: insuranceSum,
            costs: costs,
            timeframe: timeframe,
            evidence: evidence,
            details: riskDetails,
        }

        dispatch(addMyRiskAgreement(newRiskAgreement));
        navigate(`/${ROUTES.MY_RISKS}`);
        handleClose();
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}>
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
                    value={costs}
                    onChange={(event) => handleCostsChange(Number(event.target.value.replace(/€\s?|(,*)/g, '')))}
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
                    onChange={(event) => handleInsuranceSumChange(Number(event.target.value.replace(/€\s?|(,*)/g, '')))}
                    name="insuranceSum"
                    id="insuranceSum"
                    InputProps={{
                        inputComponent: EuroNumberFormat,
                    }}
                />
                <TextField
                    margin="dense"
                    fullWidth
                    label="Sonstige Anmerkungen"
                    value={riskDetails}
                    onChange={(event) => handleDetailsChange(event.target.value)}
                    name="details"
                    id="details"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleDataExtraction}>
                    Automatisch füllen
                </Button>
                <Button
                    disabled={insuranceSumRequiredError || costsRequiredError}
                    variant="contained"
                    onClick={handleCreateRiskAgreement}>
                    Vereinbaren
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
