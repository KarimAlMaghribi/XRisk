import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {ChatStatus} from "../../../types/ChatStatus";
import {Chat, ChatMessage, MyBidsState} from "./types";
import {
    createChat,
    deleteChatById,
    deleteChatsByRiskId,
    fetchMyChats,
    fetchProviderChats,
    subscribeToMessages, updateRiskProviderAgreement, updateRiskTakerAgreement
} from "./thunks";
import {ChatSort} from "../../../components/chat/chats-list";

const initialState: MyBidsState = {
    chats: [],
    filteredChats: [],
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
            const query = action.payload.trim().toLowerCase();

            if (!query) {
                state.filteredChats = [];
                return;
            }

            const hasMatches = state.chats.some((chat) =>
                chat.topic.toLowerCase().includes(query)
            );

            state.filteredChats = hasMatches
                ? state.chats.filter((chat) =>
                    chat.topic.toLowerCase().includes(query)
                )
                : null;
        },
        setActiveChat(state, action: PayloadAction<string>) {
            state.activeChatId = action.payload;
            state.activeMessages = [];
        },
        setActiveChatByRiskId(state, action: PayloadAction<string>) {
            const chat = state.chats.find((chat) => chat.riskId === action.payload);
            if (chat) {
                state.activeChatId = chat.id;
            }
        },
        clearActiveChat(state) {
            state.activeChatId = null;
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
        },
        setChatSort(state, action: PayloadAction<ChatSort>) {
            const sortChats = (chats: Chat[], isLatest: boolean) => {
                chats.sort((a, b) => {
                    const dateA = new Date(a.created).getTime();
                    const dateB = new Date(b.created).getTime();
                    return isLatest ? dateB - dateA : dateA - dateB;
                });
            };

            const isLatest = action.payload === ChatSort.LATEST;

            if (state.filteredChats && state.filteredChats.length > 0) {
                sortChats(state.filteredChats, isLatest);
            } else {
                sortChats(state.chats, isLatest);
            }
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
                state.chats = action.payload.sort((a, b) => {
                    const dateA = new Date(a.created).getTime();
                    const dateB = new Date(b.created).getTime();
                    return dateB - dateA;
                });
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
                state.chats = action.payload.sort((a, b) => {
                    const dateA = new Date(a.created).getTime();
                    const dateB = new Date(b.created).getTime();
                    return dateB - dateA;
                });
            })
            .addCase(fetchMyChats.rejected, (state, action) => {
                state.loading = FetchStatusEnum.FAILED;
                state.error = action.payload as string;
            })
            .addCase(deleteChatById.pending, (state) => {
                state.loading = FetchStatusEnum.PENDING;
                state.error = null;
            })
            .addCase(deleteChatById.fulfilled, (state, action) => {
                state.loading = FetchStatusEnum.SUCCEEDED;
                state.chats = state.chats.filter((chat) => chat.id !== action.payload);
            })
            .addCase(deleteChatById.rejected, (state, action) => {
                state.loading = FetchStatusEnum.FAILED;
                state.error = action.payload as string;
            })
            .addCase(deleteChatsByRiskId.pending, (state) => {
                state.loading = FetchStatusEnum.PENDING;
                state.error = null;
            })
            .addCase(deleteChatsByRiskId.fulfilled, (state, action) => {
                state.loading = FetchStatusEnum.SUCCEEDED;
                state.chats = state.chats.filter((chat) => chat.riskId !== action.payload);
            })
            .addCase(deleteChatsByRiskId.rejected, (state, action) => {
                state.loading = FetchStatusEnum.FAILED;
                state.error = action.payload as string;
            })
            .addCase(updateRiskProviderAgreement.pending, (state) => {
                state.loading = FetchStatusEnum.PENDING;
                state.error = null;
            })
            .addCase(updateRiskProviderAgreement.fulfilled, (state, action) => {
                state.loading = FetchStatusEnum.SUCCEEDED;
                const { chatId, agreement } = action.meta.arg;
                const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
                if (chatIndex !== -1) {
                    state.chats[chatIndex].riskProvider = {
                        ...state.chats[chatIndex].riskProvider,
                        agreement,
                    };
                }
            })
            .addCase(updateRiskProviderAgreement.rejected, (state, action) => {
                state.loading = FetchStatusEnum.FAILED;
                state.error = action.payload as string;
            })
            .addCase(updateRiskTakerAgreement.pending, (state) => {
                state.loading = FetchStatusEnum.PENDING;
                state.error = null;
            })
            .addCase(updateRiskTakerAgreement.fulfilled, (state, action) => {
                state.loading = FetchStatusEnum.SUCCEEDED;
                const { chatId, agreement } = action.meta.arg;
                const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
                if (chatIndex !== -1) {
                    state.chats[chatIndex].riskTaker = {
                        ...state.chats[chatIndex].riskTaker,
                        agreement,
                    };
                }
            })
            .addCase(updateRiskTakerAgreement.rejected, (state, action) => {
                state.loading = FetchStatusEnum.FAILED;
                state.error = action.payload as string;
            })
        }

});

export const {setChats, setChatSort, searchChats, setActiveChat, clearActiveChat, setChatStatus, setMessages, setActiveChatByRiskId} = myBidsSlice.actions;
export default myBidsSlice.reducer;
