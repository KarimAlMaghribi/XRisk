import {NotificationStatus} from "../types/NotificationStatus";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface Notification {
    id: string;
    message: string;
    chatroomId: string;
    status?: NotificationStatus;
    createdAt: Timestamp | FieldValue;
};