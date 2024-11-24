import React from "react";
import {Card} from "@mui/material";
import Container from "@mui/material/Container";
import {ChatSidebar} from "../../components/chat/chat-sidebar";
import Box from "@mui/material/Box";
import {ChatHeader} from "../../components/chat/chat-header";
import {ChatMessages} from "../../components/chat/chat-messages";


export const Chat = () => {
    return (
        <Container>
            <Card elevation={2} sx={{ display: 'flex', p: 0 }}>
                <ChatSidebar/>
                <Box flexGrow={1}>
                    <ChatHeader />
                    <ChatMessages />
                </Box>
            </Card>
        </Container>

    )
}
