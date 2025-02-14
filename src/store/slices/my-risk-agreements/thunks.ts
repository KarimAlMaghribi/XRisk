import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {RiskAgreement} from "../../../models/RiskAgreement";

export const fetchMyRiskAgreements = createAsyncThunk(
    ActionTypes.FETCH_MY_RISK_AGREEMENTS,
    async (_, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const riskAgreementsCollection = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);

            const riskGiverQuery = query(
                riskAgreementsCollection,
                where("riskGiverId", "==", user.uid)
            );

            const riskTakerQuery = query(
                riskAgreementsCollection,
                where("riskTakerId", "==", user.uid)
            );

            const [riskGiverSnapshot, riskTakerSnapshot] = await Promise.all([
                getDocs(riskGiverQuery),
                getDocs(riskTakerQuery)
            ]);

            const riskAgreements: RiskAgreement[] = [
                ...riskGiverSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as RiskAgreement[],
                ...riskTakerSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as RiskAgreement[]
            ];
        
            return riskAgreements;
        } catch (error) {
            console.error("Error fetching risk agreements: ", error);
            return rejectWithValue("Failed to fetch risk agreements");
        }
    }
);

export const addMyRiskAgreement = createAsyncThunk(
    ActionTypes.ADD_MY_RISK_AGREEMENTS,
    async (newRiskAgreement: Omit<RiskAgreement, "id">, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const myRiskAgreementsCollection = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);
            const docRef = await addDoc(myRiskAgreementsCollection, {
                ...newRiskAgreement,
                uid: user.uid,
                createdAt: new Date().toISOString()
            });

            return {id: docRef.id, ...newRiskAgreement} as RiskAgreement;
        } catch (error) {
            console.error("Error adding myRiskAgreement: ", error);
            return rejectWithValue(error);
        }
    }
);

export const updateMyRiskAgreement = createAsyncThunk(
    ActionTypes.UPDATE_MY_RISK_AGREEMENTS,
    async (riskAgreement: RiskAgreement, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const riskAgreementsCollection = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);

            const riskGiverQuery = query(
                riskAgreementsCollection,
                where("riskGiverId", "==", user.uid),
                where("id", "==", riskAgreement.id)
            );

            const riskTakerQuery = query(
                riskAgreementsCollection,
                where("riskTakerId", "==", user.uid),
                where("id", "==", riskAgreement.id)
            );

            const [riskGiverDocs, riskTakerDocs] = await Promise.all([
                getDocs(riskGiverQuery),
                getDocs(riskTakerQuery),
            ]);

            const foundDocs = [...riskGiverDocs.docs, ...riskTakerDocs.docs];

            if (foundDocs.length === 0) {
                return rejectWithValue("Risk Agreement not found");
            }

            const riskAgreementDocRef = foundDocs[0].ref;

            const updatedData = { ...riskAgreement, updatedAt: new Date().toISOString() };
            await updateDoc(riskAgreementDocRef, updatedData);

            console.log("Updated risk-agreement-overview", riskAgreement.id);
            return updatedData;
        } catch (error) {
            console.error("Error updating risk-agreement-overview:", error);
            return rejectWithValue("Failed to update risk-agreement-overview due to permissions or other error");
    }
}
);

/*export const deleteMyRiskAgreement = createAsyncThunk(
    ActionTypes.DELETE_MY_RISK_AGREEMENTS,
    async (riskAgreementId: string, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const riskAgreementsCollection = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);
            const riskAgreementQuery = query(
                riskAgreementsCollection,
                where("uid", "==", user.uid),
                where("id", "==", riskAgreementId)
            );

            const riskAgreementDocs = await getDocs(riskAgreementQuery);

            if (riskAgreementDocs.empty) {
                return rejectWithValue("Risk agreement not found");
            }

            const riskAgreementDocRef = riskAgreementDocs.docs[0].ref;
            await deleteDoc(riskAgreementDocRef);

            console.log("Deleted riskagreement-overview:", riskAgreementId);

            return riskAgreementId;
        } catch (error) {
            console.error("Error deleting risk-agreement-overview:", error);
            return rejectWithValue("Failed to delete risk-agreement-overview due to permissions or other error");
        }
    }
);*/
