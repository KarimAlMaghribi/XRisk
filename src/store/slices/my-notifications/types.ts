import {Notification} from "../../../models/Notification";
import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_MY_NOTIFICATION = "myNotifications/fetchMyNotifications",
    ADD_MY_NOTIFICATION = "myNotifications/addNotifications",
}

export interface MyNotificationsState {
    notifications: Notification[];
    activeNotifications: Notification | null;
    error?: string;
    status: FetchStatus;
}