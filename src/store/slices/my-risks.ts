import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";
import {addDoc, collection, deleteDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {FetchStatus} from "../../types/FetchStatus";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {auth, db} from "../../firebase_config";

enum ActionTypes {
    FETCH_MY_RISKS = "myRisks/fetchMyRisks",
    ADD_RISK = "myRisks/addRisk",
    DELETE_RISK = "myRisks/deleteRisk",
    UPDATE_RISK = "myRisks/updateRisk"
}

export interface MyRisksState {
    risks: Risk[];
    error?: string;
    status: FetchStatus;
}

const initialState: MyRisksState = {
    risks: [],
    error: undefined,
    status: FetchStatusEnum.IDLE
};

export const fetchMyRisks = createAsyncThunk(
    ActionTypes.FETCH_MY_RISKS,
    async (_, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, "myRisks");
            const risksQuery = query(risksCollection, where("uid", "==", user.uid));
            const riskDocs = await getDocs(risksQuery);

            const risks = riskDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Risk[];

            return risks;
        } catch (error) {
            console.error("Error fetching risks: ", error);
            return rejectWithValue("Failed to fetch risks");
        }
    }
);

export const addRisk = createAsyncThunk(
    ActionTypes.ADD_RISK,
    async (newRisk: Omit<Risk, "id">, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, "myRisks");
            const docRef = await addDoc(risksCollection, {
                ...newRisk,
                uid: user.uid,
                createdAt: new Date().toISOString()
            });

            return {id: docRef.id, ...newRisk} as Risk;
        } catch (error) {
            console.error("Error adding risk: ", error);
            return rejectWithValue(error);
        }
    }
);

export const updateRisk = createAsyncThunk(
    ActionTypes.UPDATE_RISK,
    async (risk: Risk, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, "myRisks");
            const riskQuery = query(
                risksCollection,
                where("uid", "==", user.uid),
                where("id", "==", risk.id)
            );

            const riskDocs = await getDocs(riskQuery);

            if (riskDocs.empty) {
                return rejectWithValue("Risk not found");
            }

            const riskDocRef = riskDocs.docs[0].ref;
            await updateDoc(riskDocRef, {...risk, uid: user.uid, updatedAt: new Date().toISOString()});

            return risk;
        } catch (error) {
            console.error("Error updating risk:", error);
            return rejectWithValue(
                "Failed to update risk due to permissions or other error"
            );
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

            const risksCollection = collection(db, "myRisks");
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

            console.log("Deleted risk:", riskId);

            return riskId;
        } catch (error) {
            console.error("Error deleting risk:", error);
            return rejectWithValue("Failed to delete risk due to permissions or other error");
        }
    }
);

export const myRisksSlice = createSlice({
    name: "myRisks",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyRisks.pending, (state) => {
                state.risks = [];
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchMyRisks.fulfilled, (state, action) => {
                state.risks = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchMyRisks.rejected, (state, action) => {
                state.risks = [];
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(addRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(addRisk.fulfilled, (state, action) => {
                if (state.risks.some(risk => risk.id === action.payload.id)) {
                    return;
                }

                state.risks.push(action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(addRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(deleteRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(deleteRisk.fulfilled, (state, action) => {
                state.risks = state.risks.filter(risk => risk.id !== action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(deleteRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            });
    }
});

export const selectMyRisks = (state: { myRisks: MyRisksState }) => state.myRisks.risks;

export const {} = myRisksSlice.actions;

export default myRisksSlice.reducer;
