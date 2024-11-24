import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MessageType} from "../../types/MessageType";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {FetchStatus} from "../../types/FetchStatus";
import {collection, getDocs, query, orderBy, limit, onSnapshot, doc, setDoc, where} from "firebase/firestore";
import {auth, db} from "../../firebase_config";
import {ChatStatus} from "../../types/ChatStatus";
import {ChatStatusEnum} from "../../enums/ChatStatus.enum";
import {FirestoreCollectionEnum} from "../../enums/FirestoreCollectionEnum";


export interface ChatMessage {
    id: string;
    created: string;
    type: MessageType;
    uid: string;
    attachments?: any[];
    content: any; // string | audio | video | image
    read: boolean;
}

const exampleData: Chat[] = [
    {
        id: "1",
        riskId: "3",
        created: "2021-08-01T12:00:00",
        topic: "Wegbasicherung",
        riskProvider: {
            name: "Risk Provider 1"
        },
        riskTaker: {
            name: "Risk Taker 1"
        },
        lastMessage: "Das Angebot nehme ich gern an",
        lastActivity: "2021-08-01T12:00:00",
        status: ChatStatusEnum.ONLINE
    },
    {
        id: "2",
        riskId: "434",
        created: "2021-08-01T12:00:00",
        topic: "Todesfall Hamster",
        riskProvider: {
            name: "Risk Provider 2"
        },
        riskTaker: {
            name: "Risk Taker 2"
        },
        lastMessage: "Super, danke!",
        lastActivity: "2021-08-01T12:00:00",
        status: ChatStatusEnum.BUSY
    },
    {
        id: "3",
        riskId: "123",
        created: "2021-08-01T12:00:00",
        topic: "Hochzeit Regen",
        riskProvider: {
            name: "Risk Provider 3"
        },
        riskTaker: {
            name: "Risk Taker 3"
        },
        lastMessage: "Das ist mir zu teuer!",
        lastActivity: "2021-08-01T12:00:00",
        status: ChatStatusEnum.AWAY
    },
];

export interface Chat {
    id: string;
    riskId: string;
    created: string;
    topic: string;
    riskProvider: {
        name?: string;
        uid?: string;
    };
    riskTaker: {
        name?: string;
        uid?: string;
    };
    lastMessage?: string;
    lastActivity: string;
    status?: ChatStatus;
}

export interface MyBidsState {
    chats: Chat[];
    chatSearch: string;
    activeChatId: string | null;
    loading: FetchStatus;
    error?: string | null;
    activeMessages: ChatMessage[];
}

const initialState: MyBidsState = {
    chats: exampleData,
    chatSearch: "",
    activeChatId: null,
    loading: FetchStatusEnum.IDLE,
    activeMessages: [],
};

export let messagesUnsubscribe: (() => void) | null = null;

export const subscribeToMessages = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>(
    "myBids/subscribeToMessages",
    async (chatId, { dispatch, rejectWithValue }) => {
        try {
            if (messagesUnsubscribe) {
                messagesUnsubscribe();
                messagesUnsubscribe = null;
            }
            const messagesRef = collection(db, FirestoreCollectionEnum.CHATS, chatId, FirestoreCollectionEnum.MESSAGES);
            const q = query(messagesRef, orderBy("created", "desc"), limit(50));

            messagesUnsubscribe = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as ChatMessage[];
                dispatch(setMessages(messages));
            });
        } catch (error) {
            return rejectWithValue("Error subscribing to messages");
        }
    }
);

export const createChat = createAsyncThunk<
    Chat,
    Omit<Chat, "id">,
    { rejectValue: string }
>(
    "myBids/createChat",
    async (chatData, { rejectWithValue }) => {
        try {
            const chatRef = doc(collection(db, "chats"));

            const newChat: Chat = {
                ...chatData,
                id: chatRef.id,
            };

            await setDoc(chatRef, newChat);

            return newChat;
        } catch (error) {
            console.error("Error in createChat:", error);
            return rejectWithValue("Error creating chat");
        }
    }
);

export const fetchProviderChats = createAsyncThunk<
    Chat[],
    void,
    { rejectValue: string }
>(
    "myBids/fetchChats",
    async (_, { rejectWithValue, getState }) => {
        try {
            const userUid = auth.currentUser?.uid;
            if (!userUid) throw new Error("User not authenticated");

            const chatsRef = collection(db, "chats");

            const q = query(chatsRef, where("riskTaker.uid", "==", userUid));
            const querySnapshot = await getDocs(q);

            const chats = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Chat[];

            return chats;
        } catch (error) {
            console.error("Error fetching chats:", error);
            return rejectWithValue("Error fetching chats");
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
                state.chats.push(action.payload);
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
            });
        }
    }
);

export const selectChats = (state: { myBids: MyBidsState }) => state.myBids.chats;
export const selectActiveChat = (state: { myBids: MyBidsState }) => {
    return state.myBids.chats.find((chat) => chat.id === state.myBids.activeChatId);
}
export const selectActiveChatId = (state: { myBids: MyBidsState }) => state.myBids.activeChatId;
export const selectActiveMessages = (state: { myBids: MyBidsState }) => state.myBids.activeMessages;

export const selectOtherChatMemberName = (
    state: { myBids: MyBidsState },
    uid: string | undefined
): string => {
    if (!uid) {
        return "";
    }

    const activeChat = state.myBids.chats.find(
        (chat) => chat.id === state.myBids.activeChatId
    );

    if (!activeChat) {
        return "";
    }

    const { riskProvider, riskTaker } = activeChat;

    if (riskProvider?.uid === uid) {
        return riskTaker?.name || "";
    } else if (riskTaker?.uid === uid) {
        return riskProvider?.name || "";
    }

    return "";
};

export const { setChats, searchChats, setActiveChat, setChatStatus, setMessages } = myBidsSlice.actions;
export default myBidsSlice.reducer;
