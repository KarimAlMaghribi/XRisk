import React from "react";
import {auth} from "../../../firebase_config";
import {RiskAgreement} from "../../../models/RiskAgreement";
import {updateMyRiskAgreement} from "../../../store/slices/my-risk-agreements/thunks";
import {AppDispatch} from "../../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveRiskAgreement} from "../../../store/slices/my-risk-agreements/selectors";
import {NotificationStatusEnum} from "../../../enums/Notifications.enum";
import {serverTimestamp} from "firebase/firestore";
import {addNotification} from "../../../store/slices/my-notifications/thunks";
import {Chat} from "../../../store/slices/my-bids/types";
import {selectActiveChat} from "../../../store/slices/my-bids/selectors";
import {Box, Button, Chip, DialogActions, DialogContentText} from "@mui/material";
import {RiskAgreementHeader} from "./risk-agreement-header";
import {RiskAgreementForm} from "./risk-agreement-form";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

export interface RiskAgreementDiscussionProps {
    hasApprovedExistingAgreement: boolean;
    riskTitle: string;
    riskType: string[];
    activeChat: any;
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

export const RiskAgreementDiscussion = (props: RiskAgreementDiscussionProps) => {
    const dispatch: AppDispatch = useDispatch();
    const activeChat: Chat | undefined = useSelector(selectActiveChat);
    const existingAgreement: RiskAgreement | null = useSelector(selectActiveRiskAgreement);

    const handleUpdateNotification = async (msg?: string) => {
        const recipient = activeChat?.riskTaker.uid === auth.currentUser?.uid ? activeChat?.riskProvider.uid : activeChat?.riskTaker.uid;
        const senderName = activeChat?.riskTaker.uid !== auth.currentUser?.uid ? activeChat?.riskProvider.name : activeChat?.riskTaker.name;
        const chatroomId = activeChat?.id;

        const newNotification = {
            message: msg ? msg : `${activeChat?.topic} Vereinbarung angepasst durch ${senderName}`,
            chatroomId: chatroomId!,
            status: NotificationStatusEnum.UNREAD,
            createdAt: serverTimestamp(),
        };
        dispatch(addNotification({uid: recipient, newNotification: newNotification}));
    }

    const handleWithdrawApprovals = () => {
        const senderName: string | undefined = activeChat?.riskTaker.uid !== auth.currentUser?.uid ? activeChat?.riskProvider.name : activeChat?.riskTaker.name;
        const withdrawMsg: string = `${activeChat?.topic} Vereinbarung zurückgezogen von ${senderName}`

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
                    const costsApproved = existingAgreement.riskGiverApprovals.costs && existingAgreement.costs === props.costs;
                    const timeframeApproved = existingAgreement.riskGiverApprovals.timeframe && existingAgreement.timeframe === props.timeframe;
                    const insuranceSumApproved = existingAgreement.riskGiverApprovals.insuranceSum && existingAgreement.insuranceSum === props.insuranceSum;
                    const evidenceApproved = existingAgreement.riskGiverApprovals.evidence && existingAgreement.evidence === props.evidence;
                    const detailsApproved = existingAgreement.riskGiverApprovals.details && existingAgreement.details === props.riskDetails;

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
                    const costsApproved = existingAgreement.riskTakerApprovals.costs && existingAgreement.costs === props.costs;
                    const timeframeApproved = existingAgreement.riskTakerApprovals.timeframe && existingAgreement.timeframe === props.timeframe;
                    const insuranceSumApproved = existingAgreement.riskTakerApprovals.insuranceSum && existingAgreement.insuranceSum === props.insuranceSum;
                    const evidenceApproved = existingAgreement.riskTakerApprovals.evidence && existingAgreement.evidence === props.evidence;
                    const detailsApproved = existingAgreement.riskTakerApprovals.details && existingAgreement.details === props.riskDetails;

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
                Haltet nochmal fest, was vereinbart wurde! <br/>
                Diese Informationen werden später Bestandteil des Vertrags.
            </DialogContentText>
            <br/>
            {props.hasApprovedExistingAgreement && (
                <DialogContentText>
                    Du hast dein Angebot abgegeben. <br/>
                    Warte auf die Zustimmung deines Verhandlungspartners.
                </DialogContentText>
            )}
            {!props.hasApprovedExistingAgreement && (
                <DialogContentText>
                    Die folgende Vereinbarung wurde vorgeschlagen. <br/>
                    Stimme der aktuellen Risikovereinbarung zu oder passe die Punkte an,
                    mit denen du nicht einverstanden bist.
                </DialogContentText>
            )}

            <Box position="relative">
                <RiskAgreementHeader riskTitle={props.riskTitle} riskType={props.riskType} />
                <Chip
                    icon={props.hasApprovedExistingAgreement ? <TaskAltIcon /> : <ReportGmailerrorredIcon />}
                    label={props.hasApprovedExistingAgreement ? "Dein Angebot wird geprüft" : "Neues Angebot prüfen"}
                    color={!props.hasApprovedExistingAgreement ? "success" : "warning"}
                    sx={{position: "absolute", bottom: 0, right: 0}}
                />
            </Box>


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
                {props.hasApprovedExistingAgreement && (
                    <Button onClick={handleWithdrawApprovals} variant="contained">
                        Zustimmung zurückziehen
                    </Button>
                )}

                <Button
                    onClick={handleAffirmRiskAgreement}
                    variant="contained"
                    disabled={!riskAgreementChanged()}
                    color="primary">
                    Vorschlag anpassen
                </Button>

                {!props.hasApprovedExistingAgreement && (
                    <Button
                        onClick={handleAffirmRiskAgreement}
                        variant="contained"
                        disabled={riskAgreementChanged()}
                        color="primary">
                        Vereinbarung zustimmen
                    </Button>
                )}
                <Button onClick={props.handleClose} variant="contained">
                    Schließen
                </Button>
            </DialogActions>
        </>
    )
}
