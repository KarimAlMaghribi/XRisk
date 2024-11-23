import React from "react";
import {Card} from "@mui/material";
import Container from "@mui/material/Container";
import {ChatSidebar} from "../../components/chat/chat-sidebar";


export const Chat = () => {
    return (
        <Container>
            <Card elevation={2}>
                <ChatSidebar/>
            </Card>
        </Container>

    )
}
