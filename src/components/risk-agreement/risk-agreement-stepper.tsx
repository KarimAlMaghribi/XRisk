import React, {useEffect, useState} from "react";
import {Box, Dialog, DialogContent, DialogTitle, Step, StepLabel, Stepper,} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {Risk} from "../../models/Risk";
import {selectActiveChat, selectRiskId,} from "../../store/slices/my-bids/selectors";
import {Chat} from "../../store/slices/my-bids/types";
import {selectActiveRiskAgreement} from "../../store/slices/my-risk-agreements/selectors";
import {selectRisks} from "../../store/slices/risks/selectors";
import {auth} from "../../firebase_config";
import {RiskAgreementDefinition} from "./steps/risk-agreement-definition";
import {RiskAgreementDiscussion} from "./steps/risk-agreement-discussion";
import {RiskAgreementFinalisation} from "./steps/risk-agreement-finalisation";
import {AppDispatch} from "../../store/store";
import {updateRiskStatus} from "../../store/slices/risks/thunks";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {updateMyRiskStatus} from "../../store/slices/my-risks/thunks";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import {RiskAgreement} from "../../models/RiskAgreement";

interface RiskStepperDialogProps {
    open: boolean;
    handleClose: () => void;
}

export default function RiskStepperDialog(props: RiskStepperDialogProps) {
    const dispatch: AppDispatch = useDispatch();
    const [costs, setCosts] = useState<number>(0);
    const [timeframe, setTimeframe] = useState<string>("");
    const [evidence, setEvidence] = useState<string>("");
    const [insuranceSum, setInsuranceSum] = useState<number>(0);
    const [riskDetails, setRiskDetails] = useState<string>("");
    const {showSnackbar} = useSnackbarContext();

    const activeChat: Chat | undefined = useSelector(selectActiveChat);

    const riskId = useSelector(selectRiskId);
    const risks = useSelector(selectRisks);
    const risk: Risk | undefined = risks.find((risk) => risk.id === riskId);
    const riskTitle: string = risk?.name ? risk?.name : "";
    const riskType: string[] = risk?.type ? risk.type : [];

    const [riskGiverApproved, setRiskGiverApproved] = useState(false);
    const [riskTakerApproved, setRiskTakerApproved] = useState(false);

    const existingAgreement: RiskAgreement | null = useSelector(selectActiveRiskAgreement);

    const stepLabels = ["Risikovereinbarung definieren", "Einigung finden", "Vertrag erstellen",];

    useEffect(() => {
        setApprovedExistingAgreement(checkApprovedExistingAgreement());
    }, [existingAgreement]);

    useEffect(() => {
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

    useEffect(() => {
        setActiveStep(currentStep());
    }, [existingAgreement]);

    useEffect(() => {
        if (!riskId || !risk) return;

        if (riskGiverApproved && riskTakerApproved && risk?.status !== RiskStatusEnum.AGREEMENT) {
            if (!riskId) {
                showSnackbar(
                    "Risikostatus nicht aktualisiert!",
                    "Risikostatus konnte nicht aktualisiert werden. RisikoId inkonsistent.",
                    {vertical: "top", horizontal: "center"},
                    "error"
                );
                return;
            }

            dispatch(updateRiskStatus({id: riskId, status: RiskStatusEnum.AGREEMENT}));
            dispatch(updateMyRiskStatus({riskId: riskId, status: RiskStatusEnum.AGREEMENT}));
        }
    }, [riskGiverApproved, riskTakerApproved]);

    const currentStep = () => {
        if (!existingAgreement) {
            return 0;
        }

        const riskGiverApproved = Object.values(existingAgreement.riskGiverApprovals).every((approval) => approval === true);
        const riskTakerApproved = Object.values(existingAgreement.riskTakerApprovals).every((approval) => approval === true);

        setRiskGiverApproved(riskGiverApproved);
        setRiskTakerApproved(riskTakerApproved);

        if (riskGiverApproved && riskTakerApproved) {
            return 2;
        }

        return 1;
    };

    const [activeStep, setActiveStep] = useState(0);
    const [hasApprovedExistingAgreement, setApprovedExistingAgreement] = useState(false);

    const checkApprovedExistingAgreement = () => {
        if (!existingAgreement) {
            return false;
        }

        const isRiskGiver = existingAgreement.riskGiverId === auth?.currentUser?.uid;

        const userApprovals = isRiskGiver
            ? existingAgreement.riskGiverApprovals
            : existingAgreement.riskTakerApprovals;

        const userHasApprovedAll = Object.values(userApprovals).every(
            (approval) => approval === true
        );

        return userHasApprovedAll;
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

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="md">
            <DialogTitle marginBottom="20px">Risiko Vereinbarung</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {stepLabels.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box marginTop="20px">
                    {
                        activeStep === 0 &&
                        <RiskAgreementDefinition
                            risk={risk}
                            riskTitle={riskTitle}
                            riskType={riskType}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                            evidence={evidence}
                            setEvidence={setEvidence}
                            costs={costs}
                            setCosts={setCosts}
                            insuranceSum={insuranceSum}
                            setInsuranceSum={setInsuranceSum}
                            riskDetails={riskDetails}
                            setRiskDetails={setRiskDetails}
                            handleClose={props.handleClose}
                            handleTimeframeChange={handleTimeframeChange}
                            handleEvidenceChange={handleEvidenceChange}
                            handleCostsChange={handleCostsChange}
                            handleInsuranceSumChange={handleInsuranceSumChange}
                            handleDetailsChange={handleDetailsChange}
                        />
                    }
                    {
                        activeStep === 1 &&
                        <RiskAgreementDiscussion
                            riskTitle={riskTitle}
                            riskType={riskType}
                            activeChat={activeChat}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                            evidence={evidence}
                            setEvidence={setEvidence}
                            costs={costs}
                            setCosts={setCosts}
                            insuranceSum={insuranceSum}
                            setInsuranceSum={setInsuranceSum}
                            riskDetails={riskDetails}
                            setRiskDetails={setRiskDetails}
                            handleTimeframeChange={handleTimeframeChange}
                            handleEvidenceChange={handleEvidenceChange}
                            handleCostsChange={handleCostsChange}
                            handleInsuranceSumChange={handleInsuranceSumChange}
                            handleDetailsChange={handleDetailsChange}
                            hasApprovedExistingAgreement={hasApprovedExistingAgreement}
                            handleClose={props.handleClose}
                        />
                    }
                    {
                        activeStep === 2 &&
                        <RiskAgreementFinalisation handleClose={props.handleClose} riskAgreement={existingAgreement}/>
                    }
                </Box>
            </DialogContent>
        </Dialog>
    );
}
