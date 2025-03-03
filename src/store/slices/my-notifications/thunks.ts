import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, deleteDoc, getDocs, query, updateDoc, where, setDoc, getDoc} from "firebase/firestore";
import { Notification } from "../../../models/Notification";
import { doc } from "firebase/firestore";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";


export const fetchNotifications = createAsyncThunk("notifications/fetch", async () => {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
  
  // export const addNotification = createAsyncThunk(
  //   "notifications/add",
  //   async (notification: Omit<Notification, "id">) => {
  //     const docRef = await addDoc(collection(db, "notifications"), notification);
  //     return { id: docRef.id, ...notification };
  //   }
  // );
  
  export const markAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (id: string) => {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { status: "Read" });
      return { id, status: "Read" };
    }
  );

  // export const fetchMyRiskAgreements = createAsyncThunk(
  //     ActionTypes.FETCH_MY_RISK_AGREEMENTS,
  //     async (_, {rejectWithValue}) => {
  //         try {
  //             const user = auth.currentUser;
  
  //             if (!user) {
  //                 return rejectWithValue("User not authenticated");
  //             }
  
  //             const riskAgreementsCollection = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);
  
  //             const riskGiverQuery = query(
  //                 riskAgreementsCollection,
  //                 where("riskGiverId", "==", user.uid)
  //             );
  
  //             const riskTakerQuery = query(
  //                 riskAgreementsCollection,
  //                 where("riskTakerId", "==", user.uid)
  //             );
  
  //             const [riskGiverSnapshot, riskTakerSnapshot] = await Promise.all([
  //                 getDocs(riskGiverQuery),
  //                 getDocs(riskTakerQuery)
  //             ]);
  
  //             const riskAgreements: RiskAgreement[] = [
  //                 ...riskGiverSnapshot.docs.map((doc) => ({
  //                     id: doc.id,
  //                     ...doc.data(),
  //                 })) as RiskAgreement[],
  //                 ...riskTakerSnapshot.docs.map((doc) => ({
  //                     id: doc.id,
  //                     ...doc.data(),
  //                 })) as RiskAgreement[]
  //             ];
          
  //             return riskAgreements;
  //         } catch (error) {
  //             console.error("Error fetching risk agreements: ", error);
  //             return rejectWithValue("Failed to fetch risk agreements");
  //         }
  //     }
  // );
//   export const addNotification = createAsyncThunk(
//     ActionTypes.ADD_MY_NOTIFICATION,
//     async ({ uid, newNotification }: { uid: string | undefined; newNotification: Omit<Notification, "id"> }, { rejectWithValue }) => {
//       try {
//         if (!uid) {
//           return rejectWithValue("User ID is required");
//         }
  
//         // Step 1: Reference the user's document inside the "notifications" collection
//         const userDocRef = doc(db, "notifications", uid);
//         const userDocSnap = await getDoc(userDocRef);
  
//         // Step 2: If the user document does not exist, create it
//         if (!userDocSnap.exists()) {
//           await setDoc(userDocRef, {});  // Creates an empty user document
//         }
  
//         // Step 3: Reference the notifications subcollection
//         const userNotificationsCollection = collection(db, `notifications/${uid}/notifications`);
  
//         // Step 4: Add the new notification
//         const notificationDocRef = await addDoc(userNotificationsCollection, {
//           ...newNotification,
//           uid: uid,
//           createdAt: new Date().toISOString(),
//         });
  
//         return { id: notificationDocRef.id, ...newNotification } as Notification;
//       } catch (error) {
//         console.error("Error adding notification: ", error);
//         return rejectWithValue(error);
//       }
//     }
//   );

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