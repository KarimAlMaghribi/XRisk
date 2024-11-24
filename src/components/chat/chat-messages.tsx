import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Scrollbar from "./scrollbar";
import {ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {formatLastActivity} from "./utils";
import {
    ChatMessage, messagesUnsubscribe, selectActiveChatId,
    selectActiveMessages,
    selectOtherChatMemberName, subscribeToMessages
} from "../../store/slices/my-bids";
import {useDispatch, useSelector} from "react-redux";
import {auth} from "../../firebase_config";
import {AppDispatch, RootState} from "../../store/store";
import {MessageTypeEnum} from "../../enums/MessageTypeEnum";

export const ChatMessages = () => {
    const dispatch: AppDispatch = useDispatch();
    const activeChatId: string | null = useSelector(selectActiveChatId);
    const uid: string | undefined = auth.currentUser?.uid;
    const messages: ChatMessage[] = useSelector(selectActiveMessages);
    const otherChatMemberName: string = useSelector((state: RootState) => selectOtherChatMemberName(state, uid));

    useEffect(() => {
        if (activeChatId) {
            dispatch(subscribeToMessages(activeChatId));
        }

        return () => {
            if (messagesUnsubscribe) {
                messagesUnsubscribe();
            }
        };
    }, [activeChatId, dispatch]);

    return (
        <>
            {
                messages ?
                    <Box width="100%">
                        <Scrollbar sx={{height: '650px', overflow: 'auto', maxHeight: '800px'}}>
                            <Box p={3}>
                                {messages && messages.map((message) => {
                                    return (
                                        <Box key={message.id + "_" + message.created}>
                                            {message.uid !== uid ? (
                                                <>
                                                    <Box display="flex">
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                alt={otherChatMemberName}
                                                                src=""
                                                                sx={{width: 40, height: 40}}
                                                            />
                                                        </ListItemAvatar>
                                                        <Box>
                                                            {message.created ? (
                                                                <Typography variant="body2" color="grey.400" mb={1}>
                                                                    {otherChatMemberName},{' '}
                                                                    {formatLastActivity(message.created)}{' '}
                                                                    her
                                                                </Typography>
                                                            ) : null}
                                                            {message.type === MessageTypeEnum.TEXT ? (
                                                                <Box
                                                                    mb={2}
                                                                    sx={{
                                                                        p: 1,
                                                                        backgroundColor: 'grey.100',
                                                                        mr: 'auto',
                                                                        maxWidth: '320px',
                                                                    }}
                                                                >
                                                                    {message.content}
                                                                </Box>
                                                            ) : null}
                                                            {message.type === MessageTypeEnum.IMAGE ? (
                                                                <Box mb={1} sx={{overflow: 'hidden', lineHeight: '0px'}}>
                                                                    <img src={message.content} alt="attach" width="150"/>
                                                                </Box>
                                                            ) : null}
                                                        </Box>
                                                    </Box>
                                                </>
                                            ) : (
                                                <Box
                                                    mb={1}
                                                    display="flex"
                                                    alignItems="flex-end"
                                                    flexDirection="row-reverse">
                                                    <Box alignItems="flex-end" display="flex" flexDirection={'column'}>
                                                        {message.created ? (
                                                            <Typography variant="body2" color="grey.400" mb={1}>
                                                                her
                                                            </Typography>
                                                        ) : null}
                                                        {message.type === MessageTypeEnum.TEXT ? (
                                                            <Box
                                                                mb={1}
                                                                key={message.id}
                                                                sx={{
                                                                    p: 1,
                                                                    backgroundColor: 'primary.light',
                                                                    ml: 'auto',
                                                                    maxWidth: '320px',
                                                                }}
                                                            >
                                                                {message.content}
                                                            </Box>
                                                        ) : null}
                                                        {message.type === MessageTypeEnum.IMAGE ? (
                                                            <Box mb={1} sx={{overflow: 'hidden', lineHeight: '0px'}}>
                                                                <img src={message.content} alt="attach" width="250"/>
                                                            </Box>
                                                        ) : null}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Scrollbar>
                    </Box> :
                    <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
                        <Typography variant="h4">Wähle einen Chat</Typography>
                    </Box>
            }
        </>
    )
}
