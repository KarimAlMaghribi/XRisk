import {MyNotificationsState} from "./types";
import { RootState } from "../../store";
import { NotificationStatusEnum } from "../../../enums/Notifications.enum";
import { createSelector } from "reselect";

// Selectors
export const selectNotificationById = (state: RootState, id: string) => {
    return state.notifications.list.find(notification => notification.id === id) || null;
  };
  
  export const selectNotifications = (uid: string | undefined) => (state: RootState) => {
    return state.notifications.list.filter(notification =>
      notification.id === uid
    );
  };
