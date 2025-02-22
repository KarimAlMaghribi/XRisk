import {Badge, Box, Button, Divider, ListItem, ListItemAvatar, ListItemText, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import HandshakeIcon from '@mui/icons-material/Handshake';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useDispatch, useSelector} from "react-redux";
import {selectActiveChat, selectActiveChatId, selectOpposingImagePath} from "../../store/slices/my-bids/selectors";
import {ChatStatusEnum} from "../../enums/ChatStatus.enum";
import {MyRiskAgreementDialog} from "../risk-agreement/risk-agreement";
import {Chat} from "../../store/slices/my-bids/types";
import {AppDispatch, RootState} from "../../store/store";
import {auth} from "../../firebase_config";
import { activeRiskAgreementUnsubscribe, subscribeToActiveRiskAgreement } from "../../store/slices/my-risk-agreements/thunks";
import {Trans} from "react-i18next";

export const ChatHeader = () => {
    const dispatch: AppDispatch = useDispatch();
    const activeChatId: string | null = useSelector(selectActiveChatId);
    const activeChat: Chat | undefined = useSelector(selectActiveChat);
    const opposingImagePath: string = useSelector((state: RootState) =>
        selectOpposingImagePath({myBids: state.myBids}, auth.currentUser?.uid)
    );
    const [openRiskAgreementCreationDialog, setOpenRiskAgreementCreationDialog] = React.useState(false);

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
        setOpenRiskAgreementCreationDialog(false);
    }

    return (
        <Box>
            {
                activeChat &&
                <Box>
                    <Box display="flex" alignItems="center" p={2}>
                        <ListItem key={activeChatId} dense disableGutters>
                            <ListItemAvatar>
                                <Badge
                                    color={
                                        activeChat?.status === ChatStatusEnum.ONLINE
                                            ? 'success'
                                            : activeChat?.status === ChatStatusEnum.BUSY
                                                ? 'error'
                                                : activeChat?.status === ChatStatusEnum.AWAY
                                                    ? 'warning'
                                                    : 'secondary'
                                    }
                                    variant="dot"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular">
                                    <Avatar
                                        alt={activeChat?.riskProvider?.name}
                                        src={opposingImagePath}
                                    />

                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant="body1"
                                                     fontWeight={600}>{activeChat?.riskProvider?.name}</Typography>}
                                secondary={<Typography variant="body2">{activeChat?.status}</Typography>}
                            />
                        </ListItem>
                        <Stack direction={'row'}>
                            <Button
                                variant="contained"
                                sx={{whiteSpace: "nowrap"}}
                                onClick={() => setOpenRiskAgreementCreationDialog(true)}
                                startIcon={<HandshakeIcon/>}>
                                <Trans i18nKey="chat.agreement"></Trans>
                            </Button>
                            <IconButton>
                                <MoreVertIcon/>
                            </IconButton>
                        </Stack>
                    </Box>
                    <Divider/>
                </Box>
            }
            <MyRiskAgreementDialog open={openRiskAgreementCreationDialog} handleClose={handleClose}/>
        </Box>
    )
}
