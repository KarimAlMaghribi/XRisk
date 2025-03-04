import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {MyNotificationsState} from "./types";
import {Notification} from "../../../models/Notification";
import { fetchNotifications, addNotification } from "./thunks";
import { NotificationStatusEnum } from "../../../enums/Notifications.enum";


const initialState: MyNotificationsState = {
    notifications: [],
    activeNotifications: null,
    error: undefined,
    status: FetchStatusEnum.IDLE
};


// Notification Slice
const notificationsSlice = createSlice({
    name: "notification",
    initialState: {
      list: [] as Notification[],
      loading: false,
      error: null as string | null,
    },
    reducers: {
      setNotifications(state, action: PayloadAction<Notification[]>) {
        state.list = action.payload;
    },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchNotifications.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchNotifications.fulfilled, (state, action) => {
          state.list = action.payload as Notification[];
          state.loading = false;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Error fetching notifications";
        })
        .addCase(addNotification.fulfilled, (state, action) => {
          state.list.push(action.payload);
        })
        // .addCase(markAsRead.fulfilled, (state, action) => {
        //   const notification = state.list.find((n) => n.id === action.payload.id);
        //   if (notification) {
        //     notification.status = NotificationStatusEnum.READ;
        //   }
        //});
    },
  });
  

export default notificationsSlice.reducer;
export const {setNotifications} = notificationsSlice.actions;
