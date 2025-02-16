import {Risk} from "../../../models/Risk";
import {Chat} from "../../../store/slices/my-bids/types";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import React from "react";
import {ROUTES} from "../../../routing/routes";
import {setActiveChatByRiskId} from "../../../store/slices/my-bids/reducers";
import {useSnackbarContext} from "../../snackbar/custom-snackbar";
import {auth} from "../../../firebase_config";
import Grid from "@mui/material/Grid2";
import {Accordion, AccordionDetails, AccordionSummary, Box, Popover, Typography} from "@mui/material";
import {elementBottomMargin} from "../../risk/risk-overview-element";
import Avatar from "@mui/material/Avatar";
import {Publisher} from "../../../models/Publisher";
import {PublisherProfile} from "../../risk/publisher-profile";
import Button from "@mui/material/Button";
import {NotInterested} from "@mui/icons-material";
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DealsTableHeader = () => {
    return (
        <Grid container sx={{ width: "100%", minWidth: 0 }}>
            <Grid size={1}>
                <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Nr.
                </Typography>
            </Grid>
            <Grid size={1}>
                <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Risikoträger
                </Typography>
            </Grid>
            <Grid size={2}>
                <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Titel
                </Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Letzte Nachricht
                </Typography>
            </Grid>
            <Grid size={1}>
                <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Beginn
                </Typography>
            </Grid>
            <Grid size={1}>
                <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Letzte Aktivität
                </Typography>
            </Grid>
        </Grid>
    )
}

interface DealsTableBodyProps {
    chat: Chat;
    index: number;
}

const DealsTableBodyElement = (props: DealsTableBodyProps) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleAbort = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (
        <Accordion elevation={0} expanded={expanded} onChange={(event, isExpanded) => setExpanded(isExpanded)}>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                sx={{
                    minHeight: 0,
                    padding: 0,
                    "& .MuiAccordionSummary-content": {
                        margin: 0,
                        flexGrow: 1,
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center"
                    }
                }}>
                <Grid container sx={{ width: "100%", minWidth: 0 }}>
                    <Grid size={1}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                            {props.index + 1}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                            {props.chat.riskTaker?.name}
                        </Typography>
                    </Grid>
                    <Grid size={2}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                            {props.chat.topic}
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                            {props.chat.lastMessage}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                            {new Date(props.chat.created).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                            {new Date(props.chat.lastActivity).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    <Grid size={2} sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "10px" }}>
                        <Button startIcon={<NotInterestedIcon />} variant="outlined" onClick={handleAbort}>
                            Beenden
                        </Button>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body2" sx={{color: "grey", fontWeight: "bold"}}>
                    Einigungsdetails
                </Typography>

            </AccordionDetails>

        </Accordion>

    )
}

export const DealDetails = ({ risk, chats }: { risk: Risk, chats: Chat[] }) => {
    const riskTaker: boolean = risk.publisher?.uid !== auth.currentUser?.uid;
    const [openPublisherProfileDialog, setOpenPublisherProfileDialog] = React.useState<boolean>(false);
    const [publisherProfile, setPublisherProfile] = React.useState<Publisher | null | undefined>(null);

    const { showSnackbar } = useSnackbarContext();
    const uid: string | undefined = auth.currentUser?.uid;

    if (!uid) {
        console.error("Could not get user id in deals-details component");
        showSnackbar(
            "Authentifizierung fehlgeschlagen!",
            "Uid konnte nicht gefunden werden. Melde dich erneut an.",
            { vertical: "top", horizontal: "center" },
            "error"
        );
    }

    const displayPublisherProfile = (event: any, publisher: Publisher | undefined) => {
        event.stopPropagation();

        if (!publisher) {
            console.error("Error displaying publisher information. Publisher is undefined!", publisher);
            showSnackbar("Probleme bei der Profilanzeige!", "Profil des Anbieters konnte nicht geladen werden. Lade die Seite erneut!", { vertical: "top", horizontal: "center" }, "error")
        }

        setPublisherProfile(publisher);
        setOpenPublisherProfileDialog(true);
    }

    return (
        <>
            <Grid container>
                <Grid size={4}>
                    <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                        Beschreibung
                    </Typography>
                    <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                        {risk.description}
                    </Typography>
                </Grid>
                <Grid size={8}>
                    {
                        riskTaker &&
                        <>
                            <Typography variant="body1" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Verhandlungspartner
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    onClick={(event) => displayPublisherProfile(event, risk.publisher)}
                                    src={risk.publisher?.imagePath}
                                    sx={{cursor: "pointer"}}/>
                                <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px", marginLeft: "10px"}}>
                                    {risk.publisher?.name}
                                </Typography>
                            </Box>
                        </>
                    }

                    {
                        !riskTaker && <>
                            <Typography variant="body1" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Verhandlungen
                            </Typography>
                            <DealsTableHeader />
                            {
                                chats.map((chat, index) => (
                                    <DealsTableBodyElement key={chat.id} chat={chat} index={index} />
                                ))
                            }
                        </>
                    }
                </Grid>
            </Grid>
            <PublisherProfile
                open={openPublisherProfileDialog}
                setOpen={setOpenPublisherProfileDialog}
                publisher={publisherProfile}
                setPublisher={setPublisherProfile}
            />
        </>
    )
}
