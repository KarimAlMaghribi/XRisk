import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Accordion, AccordionDetails, AccordionSummary, Chip, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useEffect} from "react";
import {Risk} from "../../models/Risk";
import {FetchStatus} from "../../types/FetchStatus";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ModeIcon from '@mui/icons-material/Mode';
import {AppDispatch, RootState} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {createChat} from "../../store/slices/my-bids/thunks";
import {ChatStatusEnum} from "../../enums/ChatStatus.enum";
import {auth} from "../../firebase_config";
import {useNavigate} from "react-router-dom";
import {Chat} from "../../store/slices/my-bids/types";
import {selectChats} from "../../store/slices/my-bids/selectors";
import {setActiveChat} from "../../store/slices/my-bids/reducers";
import {selectProfileInformation, selectUserProfile} from "../../store/slices/user-profile/selectors";
import {ProfileInformation, UserProfile} from "../../store/slices/user-profile/types";
import {formatDate} from '../../utils/dateFormatter';
import {Publisher} from "../../models/Publisher";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import {PublisherProfile} from "./publisher-profile";
import {updateRiskStatus} from "../../store/slices/risks/thunks";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {selectShowTaken} from "../../store/slices/risks/selectors";
import DeleteIcon from "@mui/icons-material/Delete";
import {RiskDeletionDialog} from "./risk-deletion-dialog";
import {fetchAssessments} from '../../store/slices/credit-assesment/thunks';
import {selectAssessmentById, selectLatestAcquisitionLimit} from '../../store/slices/credit-assesment/selectors';
import {CreditAssesment} from '../../models/CreditAssesment';
import {AvatarWithBadge} from "../profile/avatar-with-badge-count";
import {EuroNumberFormat} from "../my-risks/creation-dialog/my-risk-creation-dialog";

export const elementBottomMargin: number = 20;

export interface RiskOverviewElementProps {
    risks: Risk[];
    status: FetchStatus;
}

export const RiskOverviewElement = (props: RiskOverviewElementProps) => {
    const user = auth.currentUser;
    const acquisitionLimit: number = useSelector(selectLatestAcquisitionLimit);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const profileInfo: ProfileInformation = useSelector(selectProfileInformation);
    const showTaken: boolean = useSelector(selectShowTaken);
    const [riskToDelete, setRiskToDelete] = React.useState<Risk | null>(null);
    const [openRiskDeletionDialog, setOpenRiskDeletionDialog] = React.useState<boolean>(false);
    const [openPublisherProfileDialog, setOpenPublisherProfileDialog] = React.useState<boolean>(false);
    const [publisherProfile, setPublisherProfile] = React.useState<Publisher | null | undefined>(null);
    const [expandedPanels, setExpandedPanels] = React.useState<string[]>([]);
    const [noAddressError, setNoAddressError] = React.useState(false);
    const [noPhoneError, setNoPhoneError] = React.useState(false);
    const [noImageError, setNoImageError] = React.useState(false);
    const [creditAssessmentError, setCreditAssessmentError] = React.useState(false);
    const {showSnackbar} = useSnackbarContext();
    const userProfile: UserProfile = useSelector(selectUserProfile);

    const chats: Chat[] = useSelector(selectChats);

    useEffect(() => {
        const uid: string | undefined = auth.currentUser?.uid;

        if (!uid) {
            console.warn("User not authenticated or UID missing. Cannot guarantee creditAssessment Validation!", user);
            setCreditAssessmentError(true);
            return;
        }

        if (acquisitionLimit === 0) {
            dispatch(fetchAssessments(uid));
        }
    }, []);

    useEffect(() => {
        if (noAddressError) {
            showSnackbar(
                "Adresse fehlt!",
                "Bitte vervollständige deine Adresse in deinem Profil, um Kontakt aufzunehmen.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "warning"
            );
            setNoAddressError(false);
            return;
        }

        if (noPhoneError) {
            showSnackbar(
                "Telefonnummer fehlt!",
                "Bitte vervollständige deine Adresse in deinem Profil, um Kontakt aufzunehmen.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "warning"
            );
            setNoPhoneError(false);
            return;
        }

        if (noImageError) {
            showSnackbar(
                "Profilbild fehlt!",
                "Bitte vervollständige deine Adresse in deinem Profil, um Kontakt aufzunehmen.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "warning"
            );
            setNoImageError(false);
            return;
        }
    }, [noAddressError, noPhoneError, noImageError]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        if (isExpanded) {
            setExpandedPanels((prev) => [...prev, panel]);
        } else {
            setExpandedPanels((prev) => prev.filter((p) => p !== panel));
        }
    };

    const displayPublisherProfile = (event: any, publisher: Publisher | undefined) => {
        event.stopPropagation();

        if (!publisher) {
            console.error("Error displaying publisher information. Publisher is undefined!", publisher);
            showSnackbar("Probleme bei der Profilanzeige!", "Profil des Anbieters konnte nicht geladen werden. Lade die Seite erneut!", {
                vertical: "top",
                horizontal: "center"
            }, "error")
        }

        setPublisherProfile(publisher);
        setOpenPublisherProfileDialog(true);
    }

    const openBid = (riskIndex: number) => {
        if (!user || !user.uid) {
            console.error("User not authenticated or UID missing:", user);
            showSnackbar("Nutzer nicht authentifiziert!", "Konnte Verhandlung nicht starten, es gab Probleme mit der Authentifizierung.", {
                vertical: "top",
                horizontal: "center"
            }, "error");
            return;
        }

        if (
            !userProfile.profile.street ||
            !userProfile.profile.number ||
            !userProfile.profile.zip ||
            !userProfile.profile.city
        ) {
            setNoAddressError(true);
            return;
        }

        if (!userProfile.profile.phone) {
            setNoPhoneError(true);
            return;
        }

        if (!userProfile.profile.imagePath) {
            setNoImageError(true);
            return;
        }

        const selectedRisk = props.risks[riskIndex];

        if (!selectedRisk) {
            console.error("Selected risk not found:", selectedRisk);
            showSnackbar("Risiko nicht gefunden", "Konnte Verhandlung nicht starten, das ausgewählte Risiko wurde nicht gefunden.", {
                vertical: "top",
                horizontal: "center"
            }, "error");
            return;
        }

        if (!creditAssessmentError && acquisitionLimit <= selectedRisk.value) {
            showSnackbar("Niedrige Bonität", `Konnte Verhandlung nicht starten, da das Übernahmelimit (${acquisitionLimit.toFixed(2)}€) kleiner als die Absicherungssumme (${selectedRisk.value.toFixed(2)}€) ist.`, {
                vertical: "top",
                horizontal: "center"
            }, "error");
            return;
        }

        if (selectedRisk.publisher?.uid === user.uid) {
            console.error("User tried to bid on his own risk:", selectedRisk, user);
            showSnackbar("Falsches Risiko", "Konnte Verhandlung nicht starten, du kannst nicht auf dein eigenes Risiko bieten.", {
                vertical: "top",
                horizontal: "center"
            }, "error");
            return;
        }

        const chatAlreadyExists = chats.some(
            (chat) => chat.riskId === selectedRisk.id && chat.riskTaker.uid === user.uid
        );

        if (chatAlreadyExists) {
            const existingChat = chats.find(
                (chat) => chat.riskId === selectedRisk.id && chat.riskTaker.uid === user.uid
            );

            if (!existingChat) {
                console.error("Chat already exists but could not be found:", selectedRisk, user);
                return;
            }

            dispatch(setActiveChat(existingChat.id));
            navigate(`/chat`);
            return;
        }

        const newChat: Omit<Chat, "id"> = {
            riskId: selectedRisk.id,
            created: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            topic: selectedRisk.name,
            status: ChatStatusEnum.ONLINE,
            riskProvider: {
                name: selectedRisk.publisher?.name || "Unknown Provider",
                uid: selectedRisk.publisher?.uid || "unknown_provider_uid",
                imagePath: selectedRisk.publisher?.imagePath || ""
            },
            riskTaker: {
                name: user?.displayName || profileInfo.name,
                uid: user.uid,
                imagePath: profileInfo.imagePath || user.photoURL || ""
            },
        };

        dispatch(updateRiskStatus({id: selectedRisk.id, status: RiskStatusEnum.DEAL}));
        dispatch(createChat(newChat));
        navigate(`/chat`);
    };

    const handleRiskDeletionDialog = (risk: Risk) => {
        console.log(risk);
        setRiskToDelete(risk);
        setOpenRiskDeletionDialog(true);
    }

    const displayedRisks = !showTaken
        ? props.risks.filter(risk => risk.status !== RiskStatusEnum.AGREEMENT)
        : props.risks;

    return (
        <React.Fragment>
            {
                displayedRisks && displayedRisks.map((risk: Risk, index) => (
                    <Accordion
                        sx={{
                            margin: 0,
                            '&.MuiAccordion-root': {margin: 0},
                            '&.MuiAccordion-gutters': {margin: 0},
                        }}
                        elevation={0}
                        key={risk.id ? risk.id : index}
                        expanded={expandedPanels.includes(risk.id!)}
                        onChange={handleChange(risk.id!)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            sx={{
                                borderTop: '1px solid #f3f3f3',
                                borderBottom: '1px solid #f3f3f3',
                                borderTopLeftRadius: '5px',
                                borderTopRightRadius: '5px',
                            }}
                            id={`panel-header-${risk.id}`}>
                            <Grid container size={12} spacing={2} alignItems="center">
                                <Grid size={3}>
                                    <Typography variant="body1" sx={{
                                        cursor: 'pointer',
                                        fontWeight: "bolder",
                                        color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : "black"
                                    }}>
                                        {risk.name} {risk.status === RiskStatusEnum.AGREEMENT ?
                                        <Tooltip title={"Risiko wurde bereits übernommen"} followCursor>
                                            <Chip
                                                label="Übernommen"
                                                color="error"
                                                variant="outlined"
                                                style={{marginLeft: "10px", fontSize: "11px"}}/>
                                        </Tooltip> : ""}
                                    </Typography>
                                </Grid>
                                <Grid size={3}>
                                    <Typography variant="body1" sx={{cursor: 'pointer'}}>
                                        {
                                            risk.type.map((element, idx) => (
                                                <Chip key={idx} label={element}
                                                      clickable={risk.status !== RiskStatusEnum.AGREEMENT} sx={{
                                                    backgroundColor: risk.status === RiskStatusEnum.AGREEMENT ? "white" : '#f3f3f3',
                                                    color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : '#343434',
                                                    marginRight: '4px',
                                                    border: '1px solid',
                                                    borderColor: "#d7d7d7",
                                                }}/>
                                            ))
                                        }
                                    </Typography>
                                </Grid>
                                <Grid size={2} sx={{marginLeft: "20px"}}>
                                    <Typography variant="subtitle1" sx={{cursor: 'pointer'}}
                                                style={{color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : "black"}}>
                                        {`${risk.value.toLocaleString()},00 €`}
                                    </Typography>
                                </Grid>
                                <Grid size={2}>
                                    <Typography variant="subtitle1" sx={{cursor: 'pointer'}}
                                                style={{color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : "black"}}>
                                        {formatDate(new Date(risk.declinationDate))}
                                    </Typography>
                                </Grid>
                                <Grid size={1} display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWithBadge
                                        name={risk.publisher?.name}
                                        uid={risk.publisher?.uid}
                                        avatarSize={40}
                                        image={risk.publisher?.imagePath}
                                        onClick={(event: any) => displayPublisherProfile(event, risk.publisher)} />

                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid
                                    size={12}
                                    style={{display: 'flex', justifyContent: 'flex-end', paddingRight: "20px"}}>
                                    <Button
                                        disabled={risk.publisher?.uid === user?.uid || risk.status === RiskStatusEnum.AGREEMENT}
                                        onClick={() => openBid(index)}
                                        variant="contained"
                                        endIcon={<ModeIcon/>}
                                        style={{maxHeight: "40px", height: "40px"}}>
                                        Kontakt aufnehmen
                                    </Button>
                                    {
                                        profileInfo.admin &&
                                        <Button
                                            color="error"
                                            onClick={() => handleRiskDeletionDialog(risk)}
                                            variant="contained"
                                            endIcon={<DeleteIcon/>}
                                            style={{maxHeight: "40px", height: "40px", marginLeft: "10px"}}>
                                            Risiko löschen
                                        </Button>
                                    }
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                                        Beschreibung
                                    </Typography>
                                    <Typography variant="body2" sx={{color: "grey"}}>
                                        {risk.description}
                                    </Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body1">
                                        Details
                                    </Typography>
                                    <br/>
                                    <Grid container>
                                        <Grid size={4}>
                                            <Typography variant="body2"
                                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                                                Anbieter
                                            </Typography>
                                            <Typography variant="body2"
                                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                                                E-Mail
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin}px`}}>
                                                {risk.publisher?.name || "-"}
                                            </Typography>
                                            <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin}px`}}>
                                                {risk.publisher?.email || "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
            {
                (!displayedRisks || displayedRisks.length === 0) &&
                <Typography variant="h5" sx={{marginTop: "20px", textAlign: "center"}}>
                    Keine Risiken gefunden.
                </Typography>
            }
            <PublisherProfile
                open={openPublisherProfileDialog}
                setOpen={setOpenPublisherProfileDialog}
                publisher={publisherProfile}
                setPublisher={setPublisherProfile}
            />
            <RiskDeletionDialog
                open={openRiskDeletionDialog}
                setOpen={setOpenRiskDeletionDialog}
                risk={riskToDelete}/>
        </React.Fragment>
    );
};
