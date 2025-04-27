import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc} from "firebase/firestore";
import {Notification} from "../../../models/Notification";
import {setNotifications} from "./reducers";


export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (userId: string) => {
        const userNotificationsRef = collection(db, "notifications", userId, "notifications");
        const querySnapshot = await getDocs(userNotificationsRef);

        return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    }
);

export let notificationsUnsubscribe: (() => void) | null = null;

export const subscribeToNotifications = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    ActionTypes.SUBSCRIBE_TO_NOTIFICATIONS,
    async (_, {dispatch, rejectWithValue}) => {
        try {
            if (notificationsUnsubscribe) {
                notificationsUnsubscribe();
                notificationsUnsubscribe = null;
            }

            const currentUserId = auth.currentUser?.uid;
            if (!currentUserId) {
                return rejectWithValue("User not authenticated");
            }

            const notificatinsRef = collection(db, "notifications", currentUserId, "notifications");
            notificationsUnsubscribe = onSnapshot(notificatinsRef, (snapshot) => {
                const notifications = snapshot.docs
                    .map(doc => ({id: doc.id, ...doc.data()} as Notification))
                dispatch(setNotifications(notifications));
            });
        } catch (error) {
            return rejectWithValue("Error subscribing to Notifications");
        }
    }
);

export const addNotification = createAsyncThunk(
    ActionTypes.ADD_MY_NOTIFICATION,
    async ({
               uid,
               newNotification
           }: { uid: string | undefined; newNotification: Omit<Notification, "id"> }, {rejectWithValue}) => {
        try {
            if (!uid) {
                return rejectWithValue("User ID is required");
            }

            const userDocRef = doc(db, "notifications", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {});
            }

            const userNotificationsCollection = collection(db, `notifications/${uid}/notifications`);

            const notificationDocRef = await addDoc(userNotificationsCollection, {
                ...newNotification,
                uid: uid,
                createdAt: new Date().toISOString(),
            });

            return {id: notificationDocRef.id, ...newNotification} as Notification;
        } catch (error) {
            console.error("Error adding notification: ", error);
            return rejectWithValue(error);
        }
    }
);
