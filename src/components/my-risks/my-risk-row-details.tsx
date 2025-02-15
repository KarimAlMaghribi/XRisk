import {Risk} from "../../models/Risk";
import React from "react";
import {Box, Card, CardContent, Popover, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectChatsByRiskId} from "../../store/slices/my-bids/selectors";
import {Chat} from "../../store/slices/my-bids/types";
import Grid from "@mui/material/Grid2";
import {elementBottomMargin} from "../risk/risk-overview-element";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import Avatar from "@mui/material/Avatar";
import {auth} from "../../firebase_config";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import {ROUTES} from "../../routing/routes";
import {setActiveChatByRiskId} from "../../store/slices/my-bids/reducers";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../store/store";

export interface MyRiskRowDetailsProps {
    risk: Risk;
}

export const PublishedDetails = ({ risk }: { risk: Risk }) => {
    return (
        <Grid container>
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
                    Historie
                </Typography>
                <br />
                <Grid container>
                    <Grid size={4}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}} >
                            Erstellt am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Aktualisiert am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Veröffentlichet am
                        </Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.createdAt ? new Date(risk.createdAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.updatedAt ? new Date(risk.updatedAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.publishedAt ? new Date(risk.publishedAt).toLocaleDateString() : "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export const WithdrawnDetails = ({ risk }: { risk: Risk }) => {
    return (
        <Grid container>
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
                    Historie
                </Typography>
                <br />
                <Grid container>
                    <Grid size={4}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}} >
                            Erstellt am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Aktualisiert am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Veröffentlichet am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Zurückgezogen am am
                        </Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.createdAt ? new Date(risk.createdAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.updatedAt ? new Date(risk.updatedAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.publishedAt ? new Date(risk.publishedAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.withdrawnAt ? new Date(risk.withdrawnAt).toLocaleDateString() : "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export const DealDetails = ({ risk, chats }: { risk: Risk, chats: Chat[] }) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleDeal = (): void => {
        navigate(`/${ROUTES.CHAT}`);
        dispatch(setActiveChatByRiskId(risk.id));
    }

    const open = Boolean(anchorEl);

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

    return (
        <Grid container>
            <Grid size={6}>
                <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                    Beschreibung
                </Typography>
                <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                    {risk.description}
                </Typography>
                <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                    Aktive Verhandlungen
                </Typography>
                <Grid container>
                    {
                        chats.map((chat) => (
                            <Grid size={1} key={chat.id} sx={{marginBottom: `${elementBottomMargin}px`, padding: "5px"}}>
                                <Avatar
                                    onClick={handleDeal}
                                    onMouseEnter={handlePopoverOpen}
                                    onMouseLeave={handlePopoverClose}
                                    src={chat.riskTaker.uid === uid ? chat.riskProvider.imagePath : chat.riskTaker.imagePath}
                                    sx={{cursor: "pointer"}}/>
                                <Popover
                                    id="mouse-over-popover"
                                    sx={{ pointerEvents: 'none'}}
                                    open={open}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}
                                    transformOrigin={{vertical: 'top', horizontal: 'left',}}
                                    onClose={handlePopoverClose}
                                    disableRestoreFocus>
                                    <Box margin={2}>
                                        <Grid container>
                                            <Grid size={6}>
                                                <Typography variant="caption" sx={{marginBottom: `${elementBottomMargin}px`}}>
                                                    Letzte Nachricht
                                                </Typography>
                                            </Grid>
                                            <Grid size={6}>
                                                <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                                                    <b>"{chat.lastMessage}" </b> - {new Date(chat.lastActivity).toLocaleString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Popover>
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
            <Grid size={6}>
                <Typography variant="body1">
                    Historie
                </Typography>
                <br />
                <Grid container>
                    <Grid size={4}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}} >
                            Erstellt am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Aktualisiert am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Veröffentlichet am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Zurückgezogen am am
                        </Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.createdAt ? new Date(risk.createdAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.updatedAt ? new Date(risk.updatedAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.publishedAt ? new Date(risk.publishedAt).toLocaleDateString() : "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export const MyRiskRowDetails = (props: MyRiskRowDetailsProps) => {
    const riskRelatedChats: Chat[] = useSelector(selectChatsByRiskId(props.risk.id));

    const getRiskDetails = () => {
        switch (props.risk.status) {
            case RiskStatusEnum.PUBLISHED:
                return <PublishedDetails risk={props.risk} />;
            case RiskStatusEnum.WITHDRAWN:
                return <WithdrawnDetails risk={props.risk} />;
            case RiskStatusEnum.DEAL:
                return <DealDetails risk={props.risk} chats={riskRelatedChats}/>;
            default:
                return <></>;
        }
    }

    return (
        <Box margin="0 5% 0 5%">
            <Typography variant="h6">
                Details
            </Typography>
            <Box marginTop="10px" padding="10px">{getRiskDetails()}</Box>
        </Box>
    )
}
