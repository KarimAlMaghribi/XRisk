import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, deleteDoc, getDocs, query, updateDoc, where, setDoc, getDoc, orderBy, onSnapshot} from "firebase/firestore";
import { Notification } from "../../../models/Notification";
import { doc } from "firebase/firestore";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import { setNotifications } from "./reducers";



export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId: string) => {
    const userNotificationsRef = collection(db, "notifications", userId, "notifications");
    const querySnapshot = await getDocs(userNotificationsRef);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);
  
  // export const addNotification = createAsyncThunk(
  //   "notifications/add",
  //   async (notification: Omit<Notification, "id">) => {
  //     const docRef = await addDoc(collection(db, "notifications"), notification);
  //     return { id: docRef.id, ...notification };
  //   }
  // );
  
  export let notificationsUnsubscribe: (() => void) | null = null;
  
  export const subscribeToNotifications = createAsyncThunk<
      void,
      void,
      { rejectValue: string }
  >(
      ActionTypes.SUBSCRIBE_TO_NOTIFICATIONS,
      async (_, { dispatch, rejectWithValue }) => {
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
                      .map(doc => ({ id: doc.id, ...doc.data() } as Notification))
                      // .filter(notification =>
                      //     notification.id === currentUserId
                      // );
                  dispatch(setNotifications(notifications));
              });
          } catch (error) {
              return rejectWithValue("Error subscribing to Notifications");
          }
      }
  );

  export const addNotification = createAsyncThunk(
    ActionTypes.ADD_MY_NOTIFICATION,
    async ({ uid, newNotification }: { uid: string | undefined; newNotification: Omit<Notification, "id"> }, { rejectWithValue }) => {
      try {
        if (!uid) {
          return rejectWithValue("User ID is required");
        }
  
        // Step 1: Reference the user's document inside the "notifications" collection
        const userDocRef = doc(db, "notifications", uid);
        const userDocSnap = await getDoc(userDocRef);
  
        // Step 2: If the user document does not exist, create it
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {});  // Creates an empty document inside "notifications/{uid}"
        }
  
        // Step 3: Reference the "notifications" subcollection inside this document
        const userNotificationsCollection = collection(db, `notifications/${uid}/notifications`);
  
        // Step 4: Add the new notification
        const notificationDocRef = await addDoc(userNotificationsCollection, {
          ...newNotification,
          uid: uid,
          createdAt: new Date().toISOString(),
        });
  
        return { id: notificationDocRef.id, ...newNotification } as Notification;
      } catch (error) {
        console.error("Error adding notification: ", error);
        return rejectWithValue(error);
      }
    }
  );