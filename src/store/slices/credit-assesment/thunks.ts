import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import { CreditAssesment } from "../../../models/CreditAssesment";
import {setAssesments} from "./reducers";


export const fetchAssesments = createAsyncThunk(
    "myAssesments/fetchAssesments",
    async (userId: string) => {
        const userAssesmentsRef = collection(db, "creditAssesment", userId, "assesments");
        const querySnapshot = await getDocs(userAssesmentsRef);

        return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    }
);


export let assesmentsUnsubscribe: (() => void) | null = null;

export const subscribeToAssesments = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    ActionTypes.SUBSCRIBE_TO_ASSESMENTS,
    async (_, {dispatch, rejectWithValue}) => {
        try {
            if (assesmentsUnsubscribe) {
                assesmentsUnsubscribe();
                assesmentsUnsubscribe = null;
            }

            const currentUserId = auth.currentUser?.uid;
            if (!currentUserId) {
                return rejectWithValue("User not authenticated");
            }

            const assesmentsRef = collection(db, "creditAssesment", currentUserId, "assesments");
            assesmentsUnsubscribe = onSnapshot(assesmentsRef, (snapshot) => {
                const assesments = snapshot.docs
                    .map(doc => ({id: doc.id, ...doc.data()} as CreditAssesment))
                // .filter(notification =>
                //     notification.id === currentUserId
                // );
                dispatch(setAssesments(assesments));
            });
        } catch (error) {
            return rejectWithValue("Error subscribing to Creditassesments");
        }
    }
);

export const addAssesments = createAsyncThunk(
    ActionTypes.ADD_MY_ASSESMENTS,
    async ({
               uid,
               newAssesment
           }: { uid: string | undefined; newAssesment: Omit<CreditAssesment, "id"> }, {rejectWithValue}) => {
        try {
            if (!uid) {
                return rejectWithValue("User ID is required");
            }

            const userDocRef = doc(db, "creditAssesment", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {});
            }

            const userAssesmentsCollection = collection(db, `creditAssesment/${uid}/assesments`);

            const assesmentsDocRef = await addDoc(userAssesmentsCollection, {
                ...newAssesment,
                uid: uid,
                createdAt: new Date().toISOString(),
            });

            return {id: assesmentsDocRef.id, ...newAssesment} as CreditAssesment;
        } catch (error) {
            console.error("Error adding credit assesment: ", error);
            return rejectWithValue(error);
        }
    }
);

export const updateAssesment = createAsyncThunk(
    ActionTypes.UPDATE_MY_ASSESMENTS,
    async (assesment: CreditAssesment, { rejectWithValue }) => {
      try {
        const user = auth.currentUser;
  
        if (!user) {
          return rejectWithValue("User not authenticated");
        }
  
        if (!assesment.id) {
          return rejectWithValue("Assessment ID is required");
        }
  
        // Step 1: Reference the specific document
        const assesmentDocRef = doc(db, `creditAssesment/${user.uid}/assesments/${assesment.id}`);
  
        // Step 2: Check if it exists
        const docSnap = await getDoc(assesmentDocRef);
        if (!docSnap.exists()) {
          return rejectWithValue("Assessment not found");
        }
  
        // Step 3: Update it
        const updatedData = { ...assesment, updatedAt: new Date().toISOString() };
        await updateDoc(assesmentDocRef, updatedData);
  
        console.log("Assessment updated:", assesment.id);
        return { ...updatedData };
      } catch (error) {
        console.error("Error updating assessment:", error);
        return rejectWithValue("Failed to update assessment");
      }
    }
  );
