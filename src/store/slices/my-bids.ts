import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ChatType} from "../../types/ChatType";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {FetchStatus} from "../../types/FetchStatus";
import {collection, getDocs, query, orderBy, limit} from "firebase/firestore";
import {db} from "../../firebase_config";
import {ChatStatus} from "../../types/ChatStatus";
import {ChatStatusEnum} from "../../enums/ChatStatus.enum";


export interface ChatMessage {
    id: string;
    created: string;
    type: ChatType;
    senderId: string; // uid
    attachments?: any[];
    content: string;
    read: boolean;
}

const exampleData: Chat[] = [
    {
        id: "1",
        created: "2021-08-01T12:00:00",
        topic: "Wegbasicherung",
        riskProvider: "Risk Provider 1",
        riskTaker: "Risk Taker 1",
        lastMessage: "Das Angebot nehme ich gern an",
        lastActivity: "2021-08-01T12:00:00",
        status: ChatStatusEnum.ONLINE
    },
    {
        id: "2",
        created: "2021-08-01T12:00:00",
        topic: "Todesfall Hamster",
        riskProvider: "Risk Provider 2",
        riskTaker: "Risk Taker 2",
        lastMessage: "Super, danke!",
        lastActivity: "2021-08-01T12:00:00",
        status: ChatStatusEnum.BUSY
    },
    {
        id: "3",
        created: "2021-08-01T12:00:00",
        topic: "Hochzeit Regen",
        riskProvider: "Risk Provider 3",
        riskTaker: "Risk Taker 3",
        lastMessage: "Das ist mir zu teuer!",
        lastActivity: "2021-08-01T12:00:00",
        status: ChatStatusEnum.AWAY
    },
];

export interface Chat {
    id: string;
    created: string;
    topic: string;
    riskProvider: string;
    riskTaker: string;
    lastMessage?: string;
    lastActivity: string;
    status?: ChatStatus;
}

export interface MyBidsState {
    chats: Chat[];
    chatSearch: string;
    activeChatId: string | null;
    activeChatMessages: ChatMessage[];
    loading: FetchStatus;
    error?: string | null;
}

const initialState: MyBidsState = {
    chats: exampleData,
    chatSearch: "",
    activeChatId: null,
    activeChatMessages: [],
    loading: FetchStatusEnum.IDLE,
};

export const fetchMessages = createAsyncThunk(
    "myBids/fetchMessages",
    async (chatId: string, { rejectWithValue }) => {
        try {
            const messagesRef = collection(db, "chats", chatId, "messages");
            const q = query(messagesRef, orderBy("created",  "desc"), limit(20));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ChatMessage[];
        } catch (error) {
            return rejectWithValue("Error fetching messages");
        }
    }
);

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
            state.activeChatMessages = [];
        },
        setChatStatus(state, action: PayloadAction<{ chatId: string, status: ChatStatus }>) {
            const chat = state.chats.find((chat) => chat.id === action.payload.chatId);
            if (chat) {
                chat.status = action.payload.status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = FetchStatusEnum.PENDING;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = FetchStatusEnum.SUCCEEDED;
                state.activeChatMessages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = FetchStatusEnum.FAILED;
                state.error = action.payload as string;
            });
    },
});

export const selectChats = (state: { myBids: MyBidsState }) => state.myBids.chats;
export const selectActiveChatId = (state: { myBids: MyBidsState }) => state.myBids.activeChatId;

export const { setChats, searchChats, setActiveChat, setChatStatus } = myBidsSlice.actions;
export default myBidsSlice.reducer;
