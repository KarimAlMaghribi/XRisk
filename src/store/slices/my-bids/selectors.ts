import {Chat, MyBidsState} from "./types";
import {RootState} from "../../store";
import {auth} from "../../../firebase_config";

export const selectChats = (state: { myBids: MyBidsState }) => state.myBids.chats;
export const selectActiveChat = (state: { myBids: MyBidsState }) => {
    return state.myBids.chats.find((chat) => chat.id === state.myBids.activeChatId);
}
export const selectActiveChatId = (state: { myBids: MyBidsState }) => state.myBids.activeChatId;
export const selectActiveMessages = (state: { myBids: MyBidsState }) => state.myBids.activeMessages;

export const selectOpposingImagePath = (
    state: { myBids: MyBidsState },
    uid?: string
): string => {
    const activeChat = selectActiveChat(state);
    if (!uid || !activeChat?.riskProvider || !activeChat?.riskTaker) {
        return "";
    }
    return activeChat.riskProvider.uid === uid
        ? activeChat.riskTaker.imagePath || ""
        : activeChat.riskProvider.imagePath || "";
};

export const selectOtherChatMemberName = (
    state: { myBids: MyBidsState },
    uid: string | undefined
): string => {
    if (!uid) {
        return "";
    }

    const activeChat: Chat | undefined = selectActiveChat(state);

    if (!activeChat) {
        return "";
    }

    const {riskProvider, riskTaker} = activeChat;

    if (riskProvider?.uid === uid) {
        return riskTaker?.name || "";
    } else if (riskTaker?.uid === uid) {
        return riskProvider?.name || "";
    }

    return "";
};

export const selectRiskId = (state: { myBids: MyBidsState }) => {
    const activeChat = selectActiveChat(state);
    return activeChat?.riskId;
};

export const selectChatsToDisplay = (state: RootState) => {
    if (state.myBids.filteredChats === null) {
        return [];
    }
    return state.myBids.filteredChats.length > 0
        ? state.myBids.filteredChats
        : state.myBids.chats;
};

export const selectMyTakenRiskIds = (state: { myBids: MyBidsState }) => {
    const userUid = auth.currentUser?.uid;
    if (!userUid) return [];

    return state.myBids.chats
        .filter(chat => chat.riskTaker.uid === userUid)
        .map(chat => chat.riskId);
};

export const selectChatsByRiskId = (riskId: string) => (state: { myBids: MyBidsState }): Chat[] =>
    state.myBids.chats.filter(chat => chat.riskId === riskId) || [];

export const selectChatByRiskId = (riskId: string) => (state: { myBids: MyBidsState }): Chat | undefined =>
    state.myBids.chats.find(chat => chat.riskId === riskId);
