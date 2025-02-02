import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, deleteDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {Risk} from "../../../models/Risk";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";

export const fetchMyRisks = createAsyncThunk(
    ActionTypes.FETCH_MY_RISKS,
    async (_, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, FirestoreCollectionEnum.MY_RISKS);
            const risksQuery = query(risksCollection, where("uid", "==", user.uid));
            const riskDocs = await getDocs(risksQuery);

            return riskDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Risk[];
        } catch (error) {
            console.error("Error fetching risks: ", error);
            return rejectWithValue("Failed to fetch risks");
        }
    }
);

export const addMyRisk = createAsyncThunk(
    ActionTypes.ADD_MY_RISK,
    async (newRisk: Omit<Risk, "id">, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const myRisksCollection = collection(db, FirestoreCollectionEnum.MY_RISKS);

            const docRef = await addDoc(myRisksCollection, {
                ...newRisk,
                uid: user.uid,
                createdAt: new Date().toISOString()
            });

            return {id: docRef.id, ...newRisk} as Risk;
        } catch (error) {
            console.error("Error adding myRisk: ", error);
            return rejectWithValue(error);
        }
    }
);

export const updateMyRisk = createAsyncThunk(
    ActionTypes.UPDATE_MY_RISK,
    async (risk: Risk, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("User not authenticated");
                return rejectWithValue("User not authenticated");
            }

            if (risk.status === RiskStatusEnum.PUBLISHED && !risk.publisher?.imagePath) {
                console.error("Risk publisher image path is missing. Aborted Publishing Update.");
                return rejectWithValue("Risk publisher image path is missing. Aborted Publishing Update.");
            }

            if (!risk.publisher?.name || !risk.publisher?.uid) {
                console.error("Publisher information missing in risk:", risk.publisher);
                return rejectWithValue("Publisher information missing");
            }

            console.log("Updating risk:", risk);
            console.log("User uid:", user.uid);

            const risksCollection = collection(db, FirestoreCollectionEnum.MY_RISKS);
            const riskQuery = query(
                risksCollection,
                where("uid", "==", user.uid),
                where("id", "==", risk.id)
            );

            const riskDocs = await getDocs(riskQuery);
            console.log("Found riskDocs:", riskDocs.size);

            if (riskDocs.empty) {
                console.error("Risk not found for id:", risk.id);
                return rejectWithValue("Risk not found");
            }

            const riskDocRef = riskDocs.docs[0].ref;
            console.log("Risk document ref:", riskDocRef.path);

            const updatedAt = new Date().toISOString();
            await updateDoc(riskDocRef, {
                ...risk,
                updatedAt,
            });

            console.log("Updated risk-overview", risk.id);
            return { ...risk, updatedAt };
        } catch (error: any) {
            console.error("Error updating risk-overview:", error);
            return rejectWithValue(
                error?.message || "Failed to update risk-overview due to permissions or other error"
            );
        }
    }
);

export const deleteMyRisk = createAsyncThunk(
    ActionTypes.DELETE_MY_RISK,
    async (riskId: string, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            console.log(riskId);

            const risksCollection = collection(db, FirestoreCollectionEnum.MY_RISKS);
            const riskQuery = query(
                risksCollection,
                where("uid", "==", user.uid),
                where("id", "==", riskId)
            );

            const riskDocs = await getDocs(riskQuery);

            if (riskDocs.empty) {
                return rejectWithValue("Risk not found");
            }

            const riskDocRef = riskDocs.docs[0].ref;
            await deleteDoc(riskDocRef);

            console.log("Deleted risk-overview:", riskId);

            return riskId;
        } catch (error) {
            console.error("Error deleting risk-overview:", error);
            return rejectWithValue("Failed to delete risk-overview due to permissions or other error");
        }
    }
);
