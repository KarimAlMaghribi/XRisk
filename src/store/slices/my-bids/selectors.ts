import {Chat, MyBidsState} from "./types";
import {RootState} from "../../store";
import {auth} from "../../../firebase_config";

export const selectChats = (state: { myBids: MyBidsState }) => state.myBids.chats;
export const selectChatById = (state: RootState, id: string) => {
    return state.myBids.chats.find(chat => chat.id === id) || null};
export const selectActiveChat = (state: { myBids: MyBidsState }) => {
    return state.myBids.chats.find((chat) => chat.id === state.myBids.activeChatId);
}
export const selectActiveChatId = (state: { myBids: MyBidsState }) => state.myBids.activeChatId;
export const selectActiveMessages = (state: { myBids: MyBidsState }) => state.myBids.activeMessages;
export const selectActiveChatRiskProviderImagePath = (state: { myBids: MyBidsState }) => selectActiveChat(state)?.riskProvider?.imagePath;

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

export const selectFilteredChats = (state: { myBids: MyBidsState }) => state.myBids.filteredChats;

export const selectChatsToDisplay = (state: RootState) => {
    if (state.myBids.filteredChats === null) {
        return [];
    }
    return state.myBids.filteredChats.length > 0
        ? state.myBids.filteredChats
        : state.myBids.chats;
};
