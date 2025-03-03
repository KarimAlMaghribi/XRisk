import {MyNotificationsState} from "./types";
import { RootState } from "../../store";
import { NotificationStatusEnum } from "../../../enums/Notifications.enum";

// Selectors
export const selectNotificationById = (state: RootState, id: string) => {
    return state.notification.list.find(notification => notification.id === id) || null;
  };
  
  export const selectUnreadNotifications = (state: RootState) => {
    return state.notification.list.filter(notification => notification.status === NotificationStatusEnum.UNREAD);
  };
  
  export const selectAllNotifications = (state: RootState) => {
    return state.notification.list;
  };
  
  export const selectNotificationByMessage = (message: string) => (state: RootState) =>
    state.notification.list.filter(
      notification => notification.message === message
    )[0];