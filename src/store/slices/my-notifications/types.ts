import {Notification} from "../../../models/Notification";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_NOTIFICATION = "myNotifications/fetchNotifications",
    ADD_MY_NOTIFICATION = "myNotifications/addNotifications",
    SUBSCRIBE_TO_NOTIFICATIONS = "myNotifications/subscribeToNotifications",
}

export interface MyNotificationsState {
    notifications: Notification[];
    activeNotifications: Notification | null;
    error?: string;
    status: FetchStatus;
}