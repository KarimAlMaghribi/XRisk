import {Risk} from "../../../../models/Risk";
import {Chat} from "../../../../store/slices/my-bids/types";
import React, { useEffect } from "react";
import {useSnackbarContext} from "../../../snackbar/custom-snackbar";
import {auth} from "../../../../firebase_config";
import Grid from "@mui/material/Grid2";
import {Box, Typography} from "@mui/material";
import {elementBottomMargin} from "../../../risk/risk-overview-element";
import Avatar from "@mui/material/Avatar";
import {Publisher} from "../../../../models/Publisher";
import {PublisherProfile} from "../../../risk/publisher-profile";
import {DealsTableHeader} from "./deals-table-header";
import {DealsTableBodyElement} from "./deals-table-body-element";
import { riskAgreementsUnsubscribe, subscribeToRiskAgreements } from "../../../../store/slices/my-risk-agreements/thunks";
import { AppDispatch } from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveRiskAgreement, selectRiskAgreements } from "../../../../store/slices/my-risk-agreements/selectors";
import { RiskAgreement } from "../../../../models/RiskAgreement";


export const DealDetails = ({risk, chats}: { risk: Risk, chats: Chat[] }) => {
    const dispatch: AppDispatch = useDispatch();
    const riskTaker: boolean = risk.publisher?.uid !== auth.currentUser?.uid;
    const [openPublisherProfileDialog, setOpenPublisherProfileDialog] = React.useState<boolean>(false);
    const [publisherProfile, setPublisherProfile] = React.useState<Publisher | null | undefined>(null);

    useEffect(() => {
        dispatch(subscribeToRiskAgreements());
        
        return () => {
            if (riskAgreementsUnsubscribe) {
                riskAgreementsUnsubscribe();
            }
        };
    }, [dispatch]);

    const riskAgreements: RiskAgreement[] = useSelector(selectRiskAgreements);

    const {showSnackbar} = useSnackbarContext();
    const uid: string | undefined = auth.currentUser?.uid;

    if (!uid) {
        console.error("Could not get user id in deals-details component");
        showSnackbar(
            "Authentifizierung fehlgeschlagen!",
            "Uid konnte nicht gefunden werden. Melde dich erneut an.",
            {vertical: "top", horizontal: "center"},
            "error"
        );
    }

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
                            <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                                Verhandlungspartner
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    onClick={(event) => displayPublisherProfile(event, risk.publisher)}
                                    src={risk.publisher?.imagePath}
                                    sx={{cursor: "pointer"}}/>
                                <Typography variant="body2" sx={{
                                    color: "grey",
                                    marginBottom: `${elementBottomMargin}px`,
                                    paddingTop: "20px",
                                    marginLeft: "10px"
                                }}>
                                    {risk.publisher?.name}
                                </Typography>
                            </Box>
                        </>
                    }

                    {
                        !riskTaker && <>
                            <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                                Verhandlungen
                            </Typography>
                            <DealsTableHeader/>
                            {
                                chats.map((chat, index) => {
                                    const riskAgreement = riskAgreements.find((ra) => ra.chatId === chat.id) || null;
                                    return <DealsTableBodyElement key={chat.id} chat={chat} riskAgreement={riskAgreement} index={index}/>
                                })
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
