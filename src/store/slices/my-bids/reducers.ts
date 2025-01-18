import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {ChatStatus} from "../../../types/ChatStatus";
import {Chat, ChatMessage, MyBidsState} from "./types";
import {createChat, fetchMyChats, fetchProviderChats, subscribeToMessages} from "./thunks";

const initialState: MyBidsState = {
    chats: [],
    chatSearch: "",
    activeChatId: null,
    loading: FetchStatusEnum.IDLE,
    activeMessages: [],
};

const myBidsSlice = createSlice({
        name: "myBids",
        initialState,
        reducers: {
            setChats(state, action: PayloadAction<Chat[]>) {
                state.chats = action.payload;
            },
            searchChats(state, action: PayloadAction<string>) {
                state.chats = state.chats.filter((chat) => chat.topic.includes(action.payload));
            },
            setActiveChat(state, action: PayloadAction<string>) {
                state.activeChatId = action.payload;
                state.activeMessages = [];
            },
            setChatStatus(state, action: PayloadAction<{ chatId: string, status: ChatStatus }>) {
                const chat = state.chats.find((chat) => chat.id === action.payload.chatId);
                if (chat) {
                    chat.status = action.payload.status;
                }
            },
            setMessages(state, action: PayloadAction<ChatMessage[]>) {
                state.activeMessages = action.payload;
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(subscribeToMessages.pending, (state) => {
                    state.loading = FetchStatusEnum.PENDING;
                    state.error = null;
                })
                .addCase(subscribeToMessages.fulfilled, (state) => {
                    state.loading = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(subscribeToMessages.rejected, (state, action) => {
                    state.loading = FetchStatusEnum.FAILED;
                    state.error = action.payload as string;
                })
                .addCase(createChat.pending, (state) => {
                    state.loading = FetchStatusEnum.PENDING;
                    state.error = null;
                })
                .addCase(createChat.fulfilled, (state, action) => {
                    state.loading = FetchStatusEnum.SUCCEEDED;
                    if (!state.chats.find((chat) => chat.id === action.payload.id)) {
                        state.chats.push(action.payload);
                    }
                    state.activeChatId = action.payload.id;
                })
                .addCase(createChat.rejected, (state, action) => {
                    state.loading = FetchStatusEnum.FAILED;
                    state.error = action.payload as string;
                })
                .addCase(fetchProviderChats.pending, (state) => {
                    state.loading = FetchStatusEnum.PENDING;
                    state.error = null;
                })
                .addCase(fetchProviderChats.fulfilled, (state, action) => {
                    state.loading = FetchStatusEnum.SUCCEEDED;
                    state.chats = action.payload;
                })
                .addCase(fetchProviderChats.rejected, (state, action) => {
                    state.loading = FetchStatusEnum.FAILED;
                    state.error = action.payload as string;
                })
                .addCase(fetchMyChats.pending, (state) => {
                    state.loading = FetchStatusEnum.PENDING;
                    state.error = null;
                })
                .addCase(fetchMyChats.fulfilled, (state, action) => {
                    state.loading = FetchStatusEnum.SUCCEEDED;
                    state.chats = action.payload;
                })
                .addCase(fetchMyChats.rejected, (state, action) => {
                    state.loading = FetchStatusEnum.FAILED;
                    state.error = action.payload as string;
                });
        }
    }
);

export const {setChats, searchChats, setActiveChat, setChatStatus, setMessages} = myBidsSlice.actions;
export default myBidsSlice.reducer;
