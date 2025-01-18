import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RiskOverviewHeaderEnum} from "../../../enums/RiskOverviewHeader.enum";
import {SortDirectionEnum} from "../../../enums/SortDirection.enum";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {RiskOverviewState} from "./types";
import {addRisk, addRiskType, deleteRisk, fetchRisks, fetchRiskTypes} from "./thunks";


const initialState: RiskOverviewState = {
    risks: [],
    filteredRisks: [],
    types: [],
    filters: {
        types: [],
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

export const riskOverviewSlice = createSlice({
    name: FirestoreCollectionEnum.RISKS,
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
        setFilterType: (state, action: PayloadAction<string[]>) => {
            state.filters.types = action.payload;

            state.filteredRisks = state.risks.filter(risk => {
                return action.payload.every(type => risk.type.includes(type));
            });
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
            state.filters.types = [];
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
            .addCase(fetchRiskTypes.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchRiskTypes.fulfilled, (state, action) => {
                state.types = action.payload;
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchRiskTypes.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(addRiskType.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(addRiskType.fulfilled, (state, action) => {
                state.types.push(action.payload);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(addRiskType.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            });
    }
});

export const {
    sortRisks,
    setFilterType,
    changeFilterValue,
    changeRemainingTerm,
    clearFilters
} = riskOverviewSlice.actions;

export default riskOverviewSlice.reducer;
