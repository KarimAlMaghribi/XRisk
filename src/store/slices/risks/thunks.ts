import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {addDoc, collection, deleteDoc, getDocs, onSnapshot, query, updateDoc, where, writeBatch} from "firebase/firestore";
import {auth, db} from "../../../firebase_config";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";
import {Risk} from "../../../models/Risk";
import {Publisher} from "../../../models/Publisher";
import {RootState} from "../../store";
import {selectMyTakenRiskIds} from "../my-bids/selectors";

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

export const fetchMyTakenRisks = createAsyncThunk<Risk[], void, { state: RootState }>(
    ActionTypes.FETCH_MY_TAKEN_RISKS,
    async (_, { getState, rejectWithValue }) => {
        try {
            const riskIds = selectMyTakenRiskIds(getState());
            if (riskIds.length === 0) return [];

            const risksCollection = collection(db, FirestoreCollectionEnum.RISKS);
            const risksQuery = query(risksCollection, where("id", "in", riskIds));

            const snapshot = await getDocs(risksQuery);
            const risks: Risk[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Risk[];

            return risks;
        } catch (error: any) {
            console.error("Error in fetchMyTakenRisks:", error);
            return rejectWithValue(error.message);
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

            if (!riskToPublish.publisher?.name || !riskToPublish.publisher?.imagePath) {
                return rejectWithValue("Publisher information missing");
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

export const updateRisk = createAsyncThunk(
    ActionTypes.UPDATE_RISK,
    async (riskToUpdate: Risk, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, FirestoreCollectionEnum.RISKS);
            const riskQuery = query(
                risksCollection,
                where("uid", "==", user.uid),
                where("id", "==", riskToUpdate.id)
            );

            const riskDocs = await getDocs(riskQuery);

            if (riskDocs.empty) {
                return rejectWithValue("Risk not found");
            }

            const riskDocRef = riskDocs.docs[0].ref;

            await updateDoc(riskDocRef, {
                ...riskToUpdate,
                updatedAt: new Date().toISOString(),
            });

            console.log("Updated risk-overview:", riskToUpdate.id);

            return riskToUpdate;
        } catch (error) {
            console.error("Error updating risk-overview:", error);
            return rejectWithValue("Failed to update risk-overview due to permissions or other error");
        }
    }
);

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

export const updateProviderDetails = createAsyncThunk(
    ActionTypes.UPDATE_PROVIDER_IMAGE_ON_ALL_MY_RISKS,
    async (publisher: Publisher, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, FirestoreCollectionEnum.RISKS);
            const riskQuery = query(risksCollection, where("uid", "==", user.uid));
            const riskDocs = await getDocs(riskQuery);

            if (riskDocs.empty) {
                return rejectWithValue("No risks found");
            }

            const batch = writeBatch(db);

            riskDocs.forEach((doc) => {
                batch.update(doc.ref, { publisher: publisher });
            });

            await batch.commit();

            console.log("Updated provider details on all my risks");
            return publisher;
        } catch (error: any) {
            console.error("Error updating provider details on all my risks:", error);
            return rejectWithValue("Failed to update provider details on all my risks");
        }
    }
);
