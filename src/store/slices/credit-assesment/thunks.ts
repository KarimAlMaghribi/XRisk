import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {doc, getDoc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {CreditAssesment} from "../../../models/CreditAssesment";
import {setAssesments} from "./reducers";


export const fetchAssessments = createAsyncThunk(
    "myAssesments/fetchAssesments",
    async (userId: string) => {
        const docRef = doc(db, "creditAssesment", userId, "assesments", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return [{id: docSnap.id, ...docSnap.data()}];
        }
        return [];
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

            const assesmentDocRef = doc(db, "creditAssesment", currentUserId, "assesments", currentUserId);
            assesmentsUnsubscribe = onSnapshot(assesmentDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const assesment = {id: docSnap.id, ...docSnap.data()} as CreditAssesment;
                    dispatch(setAssesments([assesment]));
                } else {
                    dispatch(setAssesments([]));
                }
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


            const assesmentDocRef = doc(db, `creditAssesment/${uid}/assesments/${uid}`);
            await setDoc(assesmentDocRef, {
                ...newAssesment,
                uid: uid,
                createdAt: new Date().toISOString(),
            });


            return {id: assesmentDocRef.id, ...newAssesment} as CreditAssesment;
        } catch (error) {
            console.error("Error adding credit assesment: ", error);
            return rejectWithValue(error);
        }
    }
);

export const updateAssesment = createAsyncThunk(
    ActionTypes.UPDATE_MY_ASSESMENTS,
    async (assesment: CreditAssesment, {rejectWithValue}) => {
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
            const updatedData = {...assesment, updatedAt: new Date().toISOString()};
            await updateDoc(assesmentDocRef, updatedData);

            console.log("Assessment updated:", assesment.id);
            return {...updatedData};
        } catch (error) {
            console.error("Error updating assessment:", error);
            return rejectWithValue("Failed to update assessment");
        }
    }
);
