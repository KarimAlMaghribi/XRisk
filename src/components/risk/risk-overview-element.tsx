import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Accordion, AccordionDetails, AccordionSummary, Chip, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { Risk } from "../../models/Risk";
import { FetchStatus } from "../../types/FetchStatus";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ModeIcon from '@mui/icons-material/Mode';
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "../../store/slices/my-bids/thunks";
import { ChatStatusEnum } from "../../enums/ChatStatus.enum";
import { auth } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { Chat } from "../../store/slices/my-bids/types";
import { selectChats } from "../../store/slices/my-bids/selectors";
import { setActiveChat } from "../../store/slices/my-bids/reducers";
import {selectProfileInformation} from "../../store/slices/user-profile/selectors";
import {ProfileInformation} from "../../store/slices/user-profile/types";
import { formatDate } from '../../utils/dateFormatter';

export interface RiskOverviewElementProps {
    risks: Risk[];
    status: FetchStatus;
}

export const RiskOverviewElement = (props: RiskOverviewElementProps) => {
    const user = auth.currentUser;
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const profileInfo: ProfileInformation = useSelector(selectProfileInformation);
    const [expandedPanels, setExpandedPanels] = React.useState<string[]>([]);

    const chats: Chat[] = useSelector(selectChats);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        if (isExpanded) {
            setExpandedPanels((prev) => [...prev, panel]);
        } else {
            setExpandedPanels((prev) => prev.filter((p) => p !== panel));
        }
    };

    const openBid = (riskIndex: number) => {
        if (!user || !user.uid) {
            console.error("User not authenticated or UID missing:", user);
            alert("Konnte Verhandlung nicht starten, es gab Probleme mit der Authentifizierung.");
            return;
        }

        const selectedRisk = props.risks[riskIndex];

        if (!selectedRisk) {
            console.error("Selected risk not found:", selectedRisk);
            alert("Konnte Verhandlung nicht starten, das ausgewählte Risiko wurde nicht gefunden.");
            return;
        }

        if (selectedRisk.publisher?.uid === user.uid) {
            console.error("User tried to bid on his own risk:", selectedRisk, user);
            alert("Konnte Verhandlung nicht starten, du kannst nicht auf dein eigenes Risiko bieten.");
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

        dispatch(createChat(newChat));
        navigate(`/chat`);
    };

    return (
        <React.Fragment>
            {
                props.risks && props.risks.map((risk: Risk, index) => (
                    <Accordion
                        sx={{
                            margin: 0,
                            '&.MuiAccordion-root': {
                                margin: 0
                            },
                            '&.MuiAccordion-gutters': {
                                margin: 0
                            },
                        }}
                        elevation={0}
                        key={risk.id ? risk.id : index}
                        expanded={expandedPanels.includes(risk.id!)}
                        onChange={handleChange(risk.id!)}>
                        <AccordionSummary

                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                borderTop: '1px solid #f3f3f3',
                                borderBottom: '1px solid #f3f3f3',
                                borderTopLeftRadius: '5px',
                                borderTopRightRadius: '5px',
                            }}
                            id={`panel-header-${risk.id}`}>
                            <Grid container size={12} spacing={2} alignItems="center">
                                <Grid size={3}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer', fontWeight: "bolder"}}>
                                        {risk.name}
                                    </Typography>
                                </Grid>

                                <Grid size={3}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                                        {
                                             risk.type.map((element, idx) => (
                                                <Chip key={idx} label={element} sx={{
                                                    backgroundColor: '#f3f3f3',
                                                    color: '#343434',
                                                    marginRight: '4px',
                                                    border: '1px solid',
                                                    borderColor: "#d7d7d7",
                                                }}/>
                                            ))
                                        }
                                    </Typography>
                                </Grid>
                                <Grid size={2} sx={{ marginLeft: "20px" }}>
                                    <Typography variant="subtitle1" sx={{ cursor: 'pointer'}}>
                                        {`${risk.value.toLocaleString()},00 €`}
                                    </Typography>
                                </Grid>
                                <Grid size={2}>
                                    <Typography variant="subtitle1" sx={{ cursor: 'pointer' }}>
                                        {formatDate(new Date(risk.declinationDate))}
                                    </Typography>
                                </Grid>
                                <Grid  size={1} display="flex" justifyContent="center" alignItems="center">
                                    <Tooltip title={risk.publisher && risk.publisher.name}>
                                        <Avatar src={risk.publisher?.imagePath} />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid
                                    size={12}
                                    style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: "20px" }}>
                                    <Button
                                        disabled={risk.publisher?.uid === user?.uid}
                                        onClick={() => openBid(index)}
                                        variant="contained"
                                        endIcon={<ModeIcon />}
                                        style={{ maxHeight: "40px", height: "40px" }}>
                                        Kontakt aufnehmen
                                    </Button>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body1">
                                        Beschreibung
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" sx={{color: "grey"}}>
                                        {risk.description}
                                    </Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body1">
                                        Details
                                    </Typography>
                                    <br />
                                    <Grid container>
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{color: "grey"}}>
                                                Anbieter
                                            </Typography>
                                            <br />
                                            <Typography variant="body2" sx={{color: "grey"}}>
                                                Telefonnummer
                                            </Typography>
                                            <br />
                                            <Typography variant="body2" sx={{color: "grey"}}>
                                                E-Mail
                                            </Typography>
                                            <br />
                                            <Typography variant="body2" sx={{color: "grey"}}>
                                                Adresse
                                            </Typography>
                                            <br />
                                            <Typography variant="body2" sx={{color: "grey"}}>
                                                Vorstellung
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Typography variant="body2">
                                                {risk.publisher?.name}
                                            </Typography>
                                            <br />
                                            <Typography variant="body2">
                                                {risk.publisher?.phoneNumber}
                                            </Typography>
                                            <br />
                                            <Typography variant="body2">
                                                {risk.publisher?.email}
                                            </Typography>
                                            <br />
                                            <Typography variant="body2">
                                                {risk.publisher?.address}
                                            </Typography>
                                            <br />
                                            <Typography variant="body2">
                                                {risk.publisher?.description}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </React.Fragment>
    );
};
