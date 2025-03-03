import {NotificationStatus} from "../types/NotificationStatus";

export interface Notification {
    id: string;
    message: string;
    chatroomId: string;
    status?: NotificationStatus;
};