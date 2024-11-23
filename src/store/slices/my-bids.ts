import { createSlice } from "@reduxjs/toolkit";
import {ChatType} from "../../types/ChatType";


export interface ChatMessage {
    id: string;
    created: string;
    type: ChatType;
    senderId: string; // uid
    attachments?: any[];
    content: string;
}

export interface Chat {
    id: string;
    created: string;
    topic: string;
    riskProvider: string;
    riskTaker: string;
    messages: ChatMessage[]
}

export interface MyBidsState {
    chats: Chat[];
    chatSearch: string;
}

const initialState: MyBidsState = {
    chats: [],
    chatSearch: ""
};

export const myBisSlice = createSlice({
    name: "myBids",
    initialState: initialState,
    reducers: {

    },
});

export const { } = myBisSlice.actions;

export default myBisSlice.reducer;
