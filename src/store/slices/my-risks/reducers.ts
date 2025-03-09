import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {MyRisksState} from "./types";
import {addMyRisk, deleteMyRisk, fetchMyOfferedRisks, updateMyRisk, updateMyRiskStatus} from "./thunks";
import {fetchMyTakenRisks} from "../risks/thunks";

const initialState: MyRisksState = {
    offeredRisks: [],
    filteredOfferedRisks: [],
    takenRisks: [],
    filteredTakenRisks: [],
    error: undefined,
    status: FetchStatusEnum.IDLE
};

export const myRisksSlice = createSlice({
    name: FirestoreCollectionEnum.MY_RISKS,
    initialState: initialState,
    reducers: {
        setFilter(state, action: PayloadAction<string>) {
            const searchTerm = action.payload.toLowerCase();

            if (!searchTerm) {
                state.filteredOfferedRisks = state.offeredRisks;
                state.filteredTakenRisks = state.takenRisks;
                return;
            }

            state.filteredOfferedRisks = state.offeredRisks.filter(risk => {
                const searchParams = [
                    risk.name,
                    risk.publisher?.name,
                    risk.type ? risk.type.join(", ") : "",
                    risk.description,
                    risk.value ? risk.value.toString() : "",
                    risk.status,
                    risk.declinationDate
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return searchParams.includes(searchTerm);
            });
            state.filteredTakenRisks = state.takenRisks.filter(risk => {
                const searchParams = [
                    risk.name,
                    risk.publisher?.name,
                    risk.type ? risk.type.join(", ") : "",
                    risk.description,
                    risk.value ? risk.value.toString() : "",
                    risk.status,
                    risk.declinationDate
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return searchParams.includes(searchTerm);
            });
        },
        deleteTakenRisk(state, action: PayloadAction<string>) {
            state.takenRisks = state.takenRisks.filter(risk => risk.id !== action.payload);
            state.filteredTakenRisks = state.filteredTakenRisks.filter(risk => risk.id !== action.payload);
        },
        clearMyRiskFilter(state) {
            state.filteredOfferedRisks = [];
            state.filteredTakenRisks = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOfferedRisks.pending, (state) => {
                state.offeredRisks = [];
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchMyOfferedRisks.fulfilled, (state, action) => {
                state.offeredRisks = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchMyOfferedRisks.rejected, (state, action) => {
                state.offeredRisks = [];
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(addMyRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(addMyRisk.fulfilled, (state, action) => {
                if (state.offeredRisks.some(risk => risk.id === action.payload.id)) {
                    return;
                }

                state.offeredRisks.push(action.payload);
                state.filteredOfferedRisks.push(action.payload);

                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(addMyRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(deleteMyRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(deleteMyRisk.fulfilled, (state, action) => {
                state.offeredRisks = state.offeredRisks.filter(risk => risk.id !== action.payload);
                state.takenRisks = state.takenRisks.filter(risk => risk.id !== action.payload);

                state.filteredOfferedRisks = [];
                state.filteredTakenRisks = [];

                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(deleteMyRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(updateMyRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateMyRisk.fulfilled, (state, action) => {
                state.offeredRisks = state.offeredRisks.map(risk =>
                    risk.id === action.payload.id ? {...risk, ...action.payload} : risk
                );

                state.takenRisks = state.takenRisks.map(risk =>
                    risk.id === action.payload.id ? {...risk, ...action.payload} : risk
                );

                state.filteredOfferedRisks = []
                state.filteredTakenRisks = []

                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateMyRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(fetchMyTakenRisks.pending, (state) => {
                state.takenRisks = [];
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchMyTakenRisks.fulfilled, (state, action) => {
                state.takenRisks = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchMyTakenRisks.rejected, (state, action) => {
                state.takenRisks = [];
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(updateMyRiskStatus.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateMyRiskStatus.fulfilled, (state, action) => {
                state.offeredRisks = state.offeredRisks.map(risk =>
                    risk.id === action.payload.riskId ? {...risk, ...action.payload} : risk
                );

                state.takenRisks = state.takenRisks.map(risk =>
                    risk.id === action.payload.riskId ? {...risk, ...action.payload} : risk
                );

                state.filteredOfferedRisks = [];
                state.filteredTakenRisks = [];

                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateMyRiskStatus.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
    }
});

export const {setFilter, clearMyRiskFilter, deleteTakenRisk} = myRisksSlice.actions;

export default myRisksSlice.reducer;
