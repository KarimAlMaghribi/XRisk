import React, {useEffect} from "react";
import {Card} from "@mui/material";
import Container from "@mui/material/Container";
import {ChatSidebar} from "../../components/chat/chat-sidebar";
import Box from "@mui/material/Box";
import {ChatHeader} from "../../components/chat/chat-header";
import {ChatMessages} from "../../components/chat/chat-messages";
import {fetchMyChats} from "../../store/slices/my-bids/thunks";
import {AppDispatch} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {ChatSender} from "../../components/chat/chat-sender";
import {selectActiveChatId, selectChats} from "../../store/slices/my-bids/selectors";
import {Chat as ChatModel} from "../../store/slices/my-bids/types";


export const Chat = () => {
    const dispatch: AppDispatch = useDispatch();
    const myChats: ChatModel[] = useSelector(selectChats);
    const activeChatId: string | null = useSelector(selectActiveChatId);

    useEffect(() => {
        dispatch(fetchMyChats());
    }, [])

    return (
        <Container maxWidth={false}>
            <Card elevation={2} sx={{ display: 'flex', margin: "0 5% 0 5%"}}>
                <ChatSidebar/>
                <Box flexGrow={1}>
                    <ChatHeader />
                    <ChatMessages />
                    {
                        myChats.length > 0 && activeChatId && <ChatSender />
                    }
                </Box>
            </Card>
        </Container>

    )
}
