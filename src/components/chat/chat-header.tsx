import React, { useEffect, useState } from "react";
import {
    Box,
    IconButton,
    Stack,
    Typography,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { auth } from "../../firebase_config";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
    selectActiveChat,
    selectActiveChatId,
    selectOpposingImagePath,
} from "../../store/slices/my-bids/selectors";
import { selectRiskById } from "../../store/slices/risks/selectors";
import { updateRiskProviderAgreement, updateRiskTakerAgreement } from "../../store/slices/my-bids/thunks";

import { AvatarWithBadge } from "../profile/avatar-with-badge-count";
import { RiskDisplayDialog } from "./risk-display-dialog";
import { Chat } from "../../store/slices/my-bids/types";
import { Risk } from "../../models/Risk";
import { Trans } from "react-i18next";
import i18next from "i18next";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";

type Props = {
    /** Mobile/Tablet: Back-Button anzeigen */
    onMobileBack?: () => void;
};

export const ChatHeader: React.FC<Props> = ({ onMobileBack }) => {
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    // Back-Button für <= md (auch Tablets im Hochformat)
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const uid: string = auth.currentUser?.uid || "";
    const activeChatId = useSelector(selectActiveChatId);
    const activeChat: Chat | undefined = useSelector(selectActiveChat);
    const risk: Risk | undefined = useSelector((state: RootState) =>
        selectRiskById(state, activeChat?.riskId)
    );
    const opposingImagePath: string = useSelector((state: RootState) =>
        selectOpposingImagePath({ myBids: state.myBids }, auth.currentUser?.uid)
    );

    const isRiskProvider = activeChat?.riskProvider?.uid === uid;
    const opposingUid = isRiskProvider ? activeChat?.riskTaker?.uid : activeChat?.riskProvider?.uid;
    const opposingName = isRiskProvider ? activeChat?.riskTaker?.name : activeChat?.riskProvider?.name;

    const [openRiskDetails, setOpenRiskDetails] = useState(false);

    useEffect(() => {
        // Platzhalter für künftige Abos
    }, [activeChatId]);

    const handleAgreeNow = () => {
        if (!activeChatId) return;
        if (uid === activeChat?.riskProvider?.uid) {
            dispatch(updateRiskProviderAgreement({ chatId: activeChatId, agreement: true }));
        } else {
            dispatch(updateRiskTakerAgreement({ chatId: activeChatId, agreement: true }));
        }
    };

    if (!activeChat) {
        return (
            <Box
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    bgcolor: "background.paper",
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                {isMobile && onMobileBack && (
                    <IconButton onClick={onMobileBack} aria-label="Zurück" sx={{ mr: 1 }}>
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                )}
                <Typography variant="h6" fontWeight={700}>
                    <Trans i18nKey="chat.chats_list.last_chats" defaults="Chats" />
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Sticky Header */}
            <Box
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    bgcolor: "background.paper",
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    minHeight: 56,
                }}
            >
                {isMobile && onMobileBack && (
                    <IconButton onClick={onMobileBack} aria-label={i18next.t("terms.Back") || "Back"} sx={{ mr: 0.5 }}>
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                )}

                {/* Avatar + Name */}
                <ListItem dense disableGutters sx={{ pl: 0 }}>
                    <ListItemAvatar>
                        <AvatarWithBadge
                            avatarSize={isMobile ? 44 : 52}
                            onClick={() => setOpenRiskDetails(true)}
                            image={opposingImagePath}
                            alt={opposingName}
                            uid={opposingUid}
                            name={opposingName}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography variant="body1" fontWeight={600} noWrap title={opposingName}>
                                {opposingName}
                            </Typography>
                        }
                    />
                </ListItem>

                {/* Topic */}
                <Box sx={{ flexGrow: 1, textAlign: "center", px: 1 }} onClick={() => setOpenRiskDetails(true)}>
                    <Typography
                        variant={isMobile ? "subtitle1" : "h5"}
                        fontWeight={600}
                        sx={{ cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        title={activeChat?.topic}
                    >
                        {activeChat?.topic}
                    </Typography>
                </Box>

                {/* Actions */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Tooltip title={i18next.t("chat.chat_header.agreement") || ""}>
                        <IconButton
                            aria-label={i18next.t("chat.chat_header.agreement") || "agree"}
                            onClick={handleAgreeNow}
                            disabled={risk?.status === RiskStatusEnum.AGREEMENT}
                        >
                            <HandshakeIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={i18next.t("chat.chat_header.cancel_negotiation") || ""}>
                        <IconButton
                            aria-label={i18next.t("chat.chat_header.cancel_negotiation") || "cancel"}
                            disabled={risk?.status === RiskStatusEnum.AGREEMENT}
                        >
                            <NotInterestedIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            <Divider />

            <RiskDisplayDialog open={openRiskDetails} setOpen={setOpenRiskDetails} risk={risk} />
        </Box>
    );
};
