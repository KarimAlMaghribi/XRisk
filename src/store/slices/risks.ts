import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";
import {FetchStatus} from "../../types/FetchStatus";
import {RiskOverviewSort} from "../../models/RiskOverviewSort";
import {RiskOverviewHeaderEnum} from "../../enums/RiskOverviewHeader.enum";
import {SortDirectionEnum} from "../../enums/SortDirection.enum";
import {RiskOverviewFilterType} from "../../models/RiskOverviewFilterType";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {collection, query, where, onSnapshot, addDoc, getDocs, deleteDoc} from "firebase/firestore";
import {auth, db} from "../../firebase_config";
import {FirebaseCollectionEnum} from "../../enums/FirebaseCollection.enum";
import {deleteMyRisk} from "./my-risks";

enum ActionTypes {
    FETCH_RISKS = "risks/fetchRisks",
    ADD_RISK = "risks/addRisk",
    DELETE_RISK = "risk/deleteRisk"
}

export const types: string[] = [
    "Reise",
    "Cyber",
    "Landwirtschaft",
    "Maritim",
    "Event",
    "Finanz",
    "Medizinisch",
    "Weltraum",
    "Automobil",
    "Rechtlich"
];

export const riskTypes = types.map(type => ({
    name: type,
    label: type,
    checked: true
}));

export interface RiskOverviewState {
    risks: Risk[];
    filteredRisks: Risk[];
    riskTypes: string[];
    filters: RiskOverviewFilterType;
    sorts: RiskOverviewSort[];
    status: FetchStatus;
    error?: string;
}

const initialState: RiskOverviewState = {
    risks: [],
    filteredRisks: [],
    riskTypes: [],
    filters: {
        types: riskTypes,
        value: [0, 200000],
        remainingTerm: [0, 24] // months
    },
    sorts: [
        {
            name: RiskOverviewHeaderEnum.TYPE,
            direction: SortDirectionEnum.ASC
        },
        {
            name: RiskOverviewHeaderEnum.VALUE,
            direction: SortDirectionEnum.ASC
        },
        {
            name: RiskOverviewHeaderEnum.DECLINATION_DATE,
            direction: SortDirectionEnum.ASC
        },
        {
            name: RiskOverviewHeaderEnum.PUBLISHER,
            direction: SortDirectionEnum.ASC
        }
    ],
    status: FetchStatusEnum.IDLE
};

export const fetchRisks = createAsyncThunk(
    ActionTypes.FETCH_RISKS,
    async (_, thunkAPI) => {
        try {
            const risksCollection = collection(db, FirebaseCollectionEnum.RISKS);

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

export const addRisk = createAsyncThunk(
    ActionTypes.ADD_RISK,
    async (riskToPublish: Omit<Risk, "id">, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                return rejectWithValue("User not authenticated")
            }

            const risksCollection = collection(db, FirebaseCollectionEnum.RISKS);
            const docRef = await addDoc(risksCollection, {
                ...riskToPublish,
                publishedAt: new Date().toISOString(),
                uid: user.uid
            });

            return {id: docRef.id, ...riskToPublish} as Risk;

        } catch (error) {
            console.error("Error adding risk: ", error);
            return rejectWithValue(error);
        }
    }
)

export const deleteRisk = createAsyncThunk(
    ActionTypes.DELETE_RISK,
    async (riskId: string, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const risksCollection = collection(db, FirebaseCollectionEnum.RISKS);
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

            console.log("here");

            await deleteDoc(riskDocRef);

            console.log("Deleted risk:", riskId);

            return riskId;
        } catch (error) {
            console.error("Error deleting risk:", error);
            return rejectWithValue("Failed to delete risk due to permissions or other error");
        }
    }
);

export const riskOverviewSlice = createSlice({
    name: FirebaseCollectionEnum.RISKS,
    initialState: initialState,
    reducers: {
        sortRisks: (state, action: PayloadAction<RiskOverviewHeaderEnum>) => {
            const sort = state.sorts.find(s => s.name === action.payload);
            if (sort) {
                sort.direction = sort.direction === SortDirectionEnum.ASC ? SortDirectionEnum.DESC : SortDirectionEnum.ASC;
            }

            state.filteredRisks.sort((a, b) => {
                if (!sort) return 0;

                if (sort.name === RiskOverviewHeaderEnum.PUBLISHER) {
                    if (!a.publisher || !b.publisher) return 0;
                    return a.publisher.name > b.publisher.name ? 1 : -1;
                } else {
                    if (sort.direction === SortDirectionEnum.ASC) {
                        // @ts-ignore
                        return a[sort.name] > b[sort.name] ? 1 : -1;
                    } else {
                        // @ts-ignore
                        return a[sort.name] < b[sort.name] ? 1 : -1;
                    }
                }
            });
        },
        setFilterType: (state, action: PayloadAction<string>) => {
            const filter = state.filters.types.find(t => t.name === action.payload);
            if (filter) {
                filter.checked = !filter.checked;
            }

            state.filteredRisks = state.risks.filter(risk => {
                return state.filters.types.find(t => t.name === risk.type)?.checked === true;
            })
        },
        changeFilterValue: (state, action: PayloadAction<number[]>) => {
            state.filters.value = action.payload;

            state.filteredRisks = state.risks.filter(risk => {
                return risk.value >= action.payload[0] && risk.value <= action.payload[1];
            });
        },
        changeRemainingTerm: (state, action: PayloadAction<number[]>) => {
            state.filters.remainingTerm = action.payload;

            state.filteredRisks = state.risks.filter(risk => {
                const declinationDate = new Date(risk.declinationDate);
                const currentDate = new Date();
                const remainingMonths = (declinationDate.getFullYear() - currentDate.getFullYear()) * 12 + declinationDate.getMonth() - currentDate.getMonth();
                return remainingMonths >= action.payload[0] && remainingMonths <= action.payload[1];
            });
        },
        clearFilters: (state) => {
            state.filters.types.forEach(type => type.checked = true);
            state.filters.value = [0, 1];
            state.filters.remainingTerm = [3, 6];
            state.filteredRisks = state.risks;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRisks.pending, (state) => {
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchRisks.fulfilled, (state, action) => {
                state.risks = action.payload;
                state.filteredRisks = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchRisks.rejected, (state, action) => {
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
                const newRisks = state.risks.filter(risk => risk.id !== action.payload);
                state.risks = newRisks;
                state.filteredRisks = newRisks;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(deleteRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
    }
});

export const selectFilteredRisks = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filteredRisks;
export const selectStatus = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.status;
export const selectSorts = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.sorts;
export const selectFilterTypes = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filters.types;
export const selectFilterValue = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filters.value;
export const selectRemainingTerm = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filters.remainingTerm;
export const selectRiskTypes = (state: {riskOverview: RiskOverviewState}) => state.riskOverview.riskTypes;

export const { sortRisks, setFilterType, changeFilterValue, changeRemainingTerm, clearFilters } = riskOverviewSlice.actions;

export default riskOverviewSlice.reducer;
