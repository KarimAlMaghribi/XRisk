import {MessageType} from "../../../types/MessageType";
import {ChatStatus} from "../../../types/ChatStatus";
import {FetchStatus} from "../../../types/FetchStatus";

export interface ChatMessage {
    id: string;
    created: string;
    type: MessageType;
    uid: string;
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
