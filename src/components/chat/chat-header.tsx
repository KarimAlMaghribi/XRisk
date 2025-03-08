import {Badge, Box, Button, Divider, ListItem, ListItemAvatar, ListItemText, Stack,} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import HandshakeIcon from "@mui/icons-material/Handshake";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveChat, selectActiveChatId, selectOpposingImagePath,} from "../../store/slices/my-bids/selectors";
import {ChatStatusEnum} from "../../enums/ChatStatus.enum";
import {Chat} from "../../store/slices/my-bids/types";
import {AppDispatch, RootState} from "../../store/store";
import {auth} from "../../firebase_config";
import {
    activeRiskAgreementUnsubscribe,
    subscribeToActiveRiskAgreement,
} from "../../store/slices/my-risk-agreements/thunks";
import {Trans} from "react-i18next";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {selectRiskById,} from "../../store/slices/risks/selectors";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import {PublisherProfile} from "../risk/publisher-profile";
import {Publisher} from "../../models/Publisher";
import {fetchUserProfileById} from "../../store/slices/user-profile/thunks";
import {ProfileInformation} from "../../store/slices/user-profile/types";
import {selectOpposingProfile} from "../../store/slices/user-profile/selectors";
import {RiskDisplayDialog} from "./risk-display-dialog";
import {Risk} from "../../models/Risk";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import ToolTip from "@mui/material/Tooltip";
import {CancelDealDialog} from "../my-risks/my-risk-row-details/deals-details/cancel-deal-dialog";
import RiskStepperDialog from "../risk-agreement/risk-agreement-stepper";

export const ChatHeader = () => {
    const dispatch: AppDispatch = useDispatch();
    const uid: string = auth.currentUser?.uid || "";
    const activeChatId: string | null = useSelector(selectActiveChatId);
    const activeChat: Chat | undefined = useSelector(selectActiveChat);
    const opposingProfile: ProfileInformation | undefined = useSelector(
        selectOpposingProfile
    );
    const opposingImagePath: string = useSelector((state: RootState) =>
        selectOpposingImagePath({myBids: state.myBids}, auth.currentUser?.uid)
    );
    const [openRiskAgreementDialog, setOpenRiskAgreementDialog] = React.useState(false);
    const risk: Risk | undefined = useSelector((state: RootState) =>
        selectRiskById(state, activeChat?.riskId)
    );
    const [openProfile, setOpenProfile] = React.useState(false);
    const [opposingPublisherProfile, setOpposingPublisherProfile] =
        React.useState<Publisher | null>(null);
    const [openRiskDetails, setOpenRiskDetails] = React.useState(false);
    const [openCancelDealDialog, setOpenCancelDealDialog] = React.useState(false);

    useEffect(() => {
        const mappedProfile: Publisher = {
            uid: "",
            name: opposingProfile?.name || "",
            address: `${opposingProfile?.street || ""} ${
                opposingProfile?.number || ""
            } ${opposingProfile?.zip || ""} ${opposingProfile?.city || ""}`,
            phoneNumber: opposingProfile?.phone || "",
            email: opposingProfile?.email || "",
            description: opposingProfile?.aboutMe || "",
            imagePath: opposingImagePath,
        };
        setOpposingPublisherProfile(mappedProfile);
    }, [opposingProfile]);

    useEffect(() => {
        if (uid === activeChat?.riskProvider?.uid) {
            activeChat?.riskTaker?.uid &&
            dispatch(fetchUserProfileById(activeChat?.riskTaker?.uid));
        } else {
            activeChat?.riskProvider?.uid &&
            dispatch(fetchUserProfileById(activeChat?.riskProvider?.uid));
        }
    }, [activeChat, uid, dispatch]);

    useEffect(() => {
        if (activeChatId) {
            dispatch(subscribeToActiveRiskAgreement(activeChatId));
        }

        return () => {
            if (activeRiskAgreementUnsubscribe) {
                activeRiskAgreementUnsubscribe();
            }
        };
    }, [activeChatId, dispatch]);

    const handleClose = () => {
        setOpenRiskAgreementDialog(false);
    };

    const deleteChat = () => {
        setOpenCancelDealDialog(true);
    };

    return (
        <Box>
            {activeChat && (
                <Box>
                    <Box display="flex" alignItems="center" p={2}>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <ListItem key={activeChatId} dense disableGutters>
                                <ListItemAvatar>
                                    <Badge
                                        color={
                                            activeChat?.status === ChatStatusEnum.ONLINE
                                                ? "success"
                                                : activeChat?.status === ChatStatusEnum.BUSY
                                                    ? "error"
                                                    : activeChat?.status === ChatStatusEnum.AWAY
                                                        ? "warning"
                                                        : "secondary"
                                        }
                                        variant="dot"
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        overlap="circular"
                                    >
                                        <Avatar
                                            style={{cursor: "pointer"}}
                                            onClick={() => setOpenProfile(true)}
                                            alt={activeChat?.riskProvider?.name}
                                            src={opposingImagePath}
                                        />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" fontWeight={600}>
                                            {activeChat?.riskProvider?.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2">
                                            {activeChat?.status}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </Box>
                        <Box
                            sx={{flexGrow: 1, textAlign: "center"}}
                            onClick={() => setOpenRiskDetails(true)}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                ml={2}
                                style={{cursor: "pointer"}}
                            >
                                {activeChat?.topic}
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <Stack direction={"row"}>
                                <Button
                                    disabled={risk?.status === RiskStatusEnum.AGREEMENT}
                                    variant="contained"
                                    sx={{whiteSpace: "nowrap"}}
                                    onClick={() => setOpenRiskAgreementDialog(true)}
                                    startIcon={<HandshakeIcon/>}>
                                    <Trans i18nKey="chat.agreement"></Trans>
                                </Button>
                                <ToolTip title="Verhandlung abbrechen" followCursor>
                                    <IconButton
                                        onClick={deleteChat}
                                        disabled={risk?.status === RiskStatusEnum.AGREEMENT}>
                                        <NotInterestedIcon/>
                                    </IconButton>
                                </ToolTip>
                            </Stack>
                        </Box>
                    </Box>
                    <Divider/>
                </Box>
            )}
            <RiskDisplayDialog open={openRiskDetails} setOpen={setOpenRiskDetails} risk={risk}/>
            <PublisherProfile open={openProfile} setOpen={setOpenProfile} publisher={opposingPublisherProfile}/>
            <RiskStepperDialog open={openRiskAgreementDialog} handleClose={handleClose}/>
            {activeChat && (<CancelDealDialog open={openCancelDealDialog} setOpen={setOpenCancelDealDialog} chat={activeChat}/>)}
        </Box>
    );
};
