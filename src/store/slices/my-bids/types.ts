import {MessageType} from "../../../types/MessageType";
import {ChatStatus} from "../../../types/ChatStatus";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    SUBSCRIBE_TO_MESSAGES = "myBids/subscribeToMessages",
    SUBSCRIBE_TO_CHATS = "myBids/subscribeToChats",
    CREATE_CHAT = "myBids/createChat",
    FETCH_PROVIDER_CHATS = "myBids/fetchProviderChats",
    FETCH_MY_CHATS = "myBids/fetchMyChats",
    SEND_MESSAGE = "myBids/sendMessage",
    FETCH_MESSAGES = "myBids/fetchMessages",
    DELETE_CHATS_BY_RISK_ID = "myBids/deleteChatsByRiskId",
    DELETE_CHAT_BY_ID = "myBids/deleteChatById",
    UPDATE_LAST_MESSAGE = "myBids/updateLastMessage",
    DELETE_UNAGREED_CHATS = "myBids/deleteUnagreedChats",
    DELETE_CHATS_BY_UID = "myBids/deleteChatsByUid",
}

export interface ChatMessage {
    id: string;
    created: string;
    type: MessageType;
    uid: string;
    name: string;
    attachments?: any[];
    content: any; // string | audio | video | image
    read: boolean;
    prompt?: string;
}

export interface Chat {
    id: string;
    riskId: string;
    created: string;
    topic: string;
    riskProvider: {
        name?: string;
        uid?: string;
        imagePath?: string;
        agreement?: boolean; // true if provider started RiskAgreement
    };
    riskTaker: {
        name?: string;
        uid?: string;
        imagePath?: string;
        agreement?: boolean; // true if riskTaker started RiskAgreement
    };
    lastMessage?: string;
    lastActivity: string;
    status?: ChatStatus;
    agreement?: boolean;
}

export interface MyBidsState {
    chats: Chat[];
    filteredChats: Chat[] | null;
    chatSearch: string;
    activeChatId: string | null;
    loading: FetchStatus;
    error?: string | null;
    activeMessages: ChatMessage[];
}
