import {createAsyncThunk} from "@reduxjs/toolkit";
import {collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where} from "firebase/firestore";
import {auth, db} from "../../../firebase_config";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {Chat, ChatMessage} from "./types";
import {setChats, setMessages} from "./reducers";
import {RootState} from "../../store";

export let messagesUnsubscribe: (() => void) | null = null;

export const subscribeToMessages = createAsyncThunk<void, string, { rejectValue: string }>(
    "myBids/subscribeToMessages",
    async (chatId, {dispatch, rejectWithValue}) => {
        try {
            if (messagesUnsubscribe) {
                messagesUnsubscribe();
                messagesUnsubscribe = null;
            }
            const messagesRef = collection(db, FirestoreCollectionEnum.CHATS, chatId, FirestoreCollectionEnum.MESSAGES);
            const q = query(messagesRef, orderBy("created", "desc"));

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

export let chatsUnsubscribe: (() => void) | null = null;

export const subscribeToChats = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "myBids/subscribeToChats",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            if (chatsUnsubscribe) {
                chatsUnsubscribe();
                chatsUnsubscribe = null;
            }

            const currentUserId = auth.currentUser?.uid;
            if (!currentUserId) {
                return rejectWithValue("User not authenticated");
            }

            const chatsRef = collection(db, FirestoreCollectionEnum.CHATS);
            const q = query(chatsRef, orderBy("lastActivity", "desc"));
            chatsUnsubscribe = onSnapshot(q, (snapshot) => {
                const chats = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Chat))
                    .filter(chat =>
                        chat.riskProvider?.uid === currentUserId || chat.riskTaker?.uid === currentUserId
                    );
                dispatch(setChats(chats));
            });
        } catch (error) {
            return rejectWithValue("Error subscribing to chats");
        }
    }
);

export const createChat = createAsyncThunk<Chat, Omit<Chat, "id">, { rejectValue: string }>(
    "myBids/createChat",
    async (chatData, {rejectWithValue}) => {
        try {
            const chatRef = doc(collection(db, FirestoreCollectionEnum.CHATS));

            const newChat: Chat = {
                ...chatData,
                id: chatRef.id,
            };

            console.log(newChat);

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
    async (_, {rejectWithValue}) => {
        try {
            const userUid = auth.currentUser?.uid;
            if (!userUid) throw new Error("User not authenticated");

            const chatsRef = collection(db, "chats");

            const q = query(chatsRef, where("riskTaker.uid", "==", userUid));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Chat[];
        } catch (error) {
            console.error("Error fetching chats:", error);
            return rejectWithValue("Error fetching chats");
        }
    }
);

export const fetchMyChats = createAsyncThunk<Chat[], void, { rejectValue: string }>(
    "myBids/fetchMyChats",
    async (_, {rejectWithValue}) => {
        try {
            const userUid = auth.currentUser?.uid;
            if (!userUid) throw new Error("User not authenticated");

            const chatsRef = collection(db, "chats");

            const providerQuery = query(chatsRef, where("riskProvider.uid", "==", userUid));
            const providerSnapshot = await getDocs(providerQuery);

            const takerQuery = query(chatsRef, where("riskTaker.uid", "==", userUid));
            const takerSnapshot = await getDocs(takerQuery);

            return [
                ...providerSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })),
                ...takerSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })),
            ] as Chat[];
        } catch (error) {
            console.error("Error fetching chats:", error);
            return rejectWithValue("Error fetching chats");
        }
    }
);

export const sendMessage = createAsyncThunk<
    void,
    { chatId: string; message: Omit<ChatMessage, "id" | "created"> },
    { rejectValue: string }
>(
    "myBids/sendMessage",
    async ({chatId, message}, {rejectWithValue}) => {
        try {
            const messageRef = doc(collection(db, FirestoreCollectionEnum.CHATS, chatId, FirestoreCollectionEnum.MESSAGES));
            const newMessage: ChatMessage = {
                ...message,
                id: messageRef.id,
                name: message.name,
                created: new Date().toISOString(),
            };
            await setDoc(messageRef, newMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            return rejectWithValue("Error sending message");
        }
    }
);

export const fetchMessages = createAsyncThunk<ChatMessage[], string, { rejectValue: string }>(
    "myBids/fetchMessages",
    async (chatId, {rejectWithValue}) => {
        try {
            const messagesRef = collection(db, FirestoreCollectionEnum.CHATS, chatId, FirestoreCollectionEnum.MESSAGES);
            const q = query(messagesRef, orderBy("created", "desc"));
            // const q = query(messagesRef, orderBy("created", "desc"), limit(50));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ChatMessage[];
        } catch (error) {
            console.error("Error fetching messages:", error);
            return rejectWithValue("Error fetching messages");
        }
    }
);

export const deleteChatsByRiskId = createAsyncThunk<
    void,
    string,
    { rejectValue: string; state: RootState }
>(
    "myBids/deleteChatsByRiskId",
    async (riskId, { rejectWithValue, getState }) => {
        try {
            if (!riskId) throw new Error("Risk ID is required");
            if (!auth.currentUser) throw new Error("User not authenticated");

            const myChats: Chat[] = (getState() as RootState).myBids.chats;
            const chatsToDelete = myChats.filter((chat) => chat.riskId === riskId);

            if (chatsToDelete.length === 0) {
                return;
            }

            await Promise.all(
                chatsToDelete.map(async (chat) => {
                    const chatDocRef = doc(db, FirestoreCollectionEnum.CHATS, chat.id);
                    const messagesRef = collection(chatDocRef, FirestoreCollectionEnum.MESSAGES);
                    const messagesSnapshot = await getDocs(messagesRef);
                    await Promise.all(
                        messagesSnapshot.docs.map((messageDoc) => deleteDoc(messageDoc.ref))
                    );
                    await deleteDoc(chatDocRef);
                })
            );
        } catch (error) {
            console.error("Error deleting chats:", error);
            return rejectWithValue("Error deleting chats");
        }
    }
);

export const updateLastMessage = createAsyncThunk<
    void,
    { chatId: string; lastMessage: string },
    { rejectValue: string }
>(
    "myBids/updateLastMessage",
    async ({chatId, lastMessage}, {rejectWithValue}) => {
        try {
            const chatDocRef = doc(db, FirestoreCollectionEnum.CHATS, chatId);
            await setDoc(chatDocRef, {lastMessage}, {merge: true});
        } catch (error) {
            console.error("Error updating last message:", error);
            return rejectWithValue("Error updating last message");
        }
    }
);
