import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {addDoc, collection, deleteDoc, getDocs, onSnapshot, query, where} from "firebase/firestore";
import {auth, db} from "../../../firebase_config";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";
import {Risk} from "../../../models/Risk";

export const fetchRisks = createAsyncThunk(
    ActionTypes.FETCH_RISKS,
    async (_) => {
        try {
            const risksCollection = collection(db, FirestoreCollectionEnum.RISKS);

            const publishedRisksQuery = query(
                risksCollection,
                where("status", "==", RiskStatusEnum.PUBLISHED)
            );

            return new Promise<Risk[]>((resolve, reject) => {
                const unsubscribe = onSnapshot(
                    publishedRisksQuery,
                    (snapshot) => {
                        const risks: Risk[] = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })) as Risk[];

                        resolve(risks);
                    },
                    (error) => {
                        console.error("Error fetching risks:", error);
                        reject(error);
                    }
                );

                return () => unsubscribe();
            });
        } catch (error) {
            console.error("Error in fetchRisks:", error);
            throw error;
        }
    }
);

export const fetchRiskTypes = createAsyncThunk(
    ActionTypes.FETCH_RISK_TYPES,
    async (_) => {
        try {
            const riskTypesCollection = collection(db, FirestoreCollectionEnum.RISK_TYPES);

            return new Promise<string[]>((resolve, reject) => {
                const unsubscribe = onSnapshot(
                    riskTypesCollection,
                    (snapshot) => {
                        const riskTypes = snapshot.docs.map((doc) => doc.data().name as string);
                        const uniqueRiskTypes = Array.from(new Set(riskTypes));
                        resolve(uniqueRiskTypes); // Rückgabe der aktuellen Typen
                    },
                    (error) => {
                        console.error("Error fetching risk-overview types:", error);
                        reject(error);
                    }
                );

                return () => unsubscribe();
            });
        } catch (error) {
            console.error("Error in fetchRiskTypesWithListener:", error);
            throw error;
        }
    }
);

export const addRiskType = createAsyncThunk(
    ActionTypes.ADD_RISK_TYPE,
    async (newType: string, thunkAPI) => {
        try {
            const uid = auth.currentUser?.uid;
            const riskTypesCollection = collection(db, FirestoreCollectionEnum.RISK_TYPES);

            const docRef = await addDoc(riskTypesCollection, {
                name: newType,
                createdAt: new Date().toISOString(),
                creator: uid || undefined
            });

            console.log("Added risk-overview type:", docRef.id);
            return newType; // Rückgabe des neuen Typs
        } catch (error) {
            console.error("Error adding risk-overview type:", error);
            return thunkAPI.rejectWithValue("Failed to add risk-overview type");
        }
    }
);

export const addRisk = createAsyncThunk(
    ActionTypes.ADD_RISK,
    async (riskToPublish: Omit<Risk, "id">, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue("User not authenticated")
            }

            const risksCollection = collection(db, FirestoreCollectionEnum.RISKS);
            const docRef = await addDoc(risksCollection, {
                ...riskToPublish,
                publishedAt: new Date().toISOString(),
                uid: user.uid
            });

            return {id: docRef.id, ...riskToPublish} as Risk;

        } catch (error) {
            console.error("Error adding risk-overview: ", error);
            return rejectWithValue(error);
        }
    }
)

export const deleteRisk = createAsyncThunk(
    ActionTypes.DELETE_RISK,
    async (riskId: string, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, FirestoreCollectionEnum.RISKS);
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
