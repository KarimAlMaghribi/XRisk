import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RiskOverviewHeaderEnum } from "../../../enums/RiskOverviewHeader.enum";
import { SortDirectionEnum } from "../../../enums/SortDirection.enum";
import { FetchStatusEnum } from "../../../enums/FetchStatus.enum";
import { FirestoreCollectionEnum } from "../../../enums/FirestoreCollectionEnum";
import { RiskOverviewState } from "./types";
import {
    addRisk,
    addRiskType,
    deleteRisk, deleteRisksByUid,
    fetchRisks,
    fetchRiskTypes,
    updateProviderDetails, updateRisk,
    updateRiskStatus
} from "./thunks";
import {RiskOverviewFilterType} from "../../../models/RiskOverviewFilterType";
import {Risk} from "../../../models/Risk";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";

const defaultSortRisks = (risks: Risk[]): Risk[] => {
    return risks.slice().sort((a, b) => {
        const isAAgreement = a.status === RiskStatusEnum.AGREEMENT;
        const isBAgreement = b.status === RiskStatusEnum.AGREEMENT;
        if (isAAgreement && !isBAgreement) return 1;
        if (!isAAgreement && isBAgreement) return -1;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
    });
};

const initialState: RiskOverviewState = {
    risks: [],
    filteredRisks: [],
    types: [],
    filters: {
        types: [],
        value: [0, 200000],
        remainingTerm: [0, 24], // months
        showTaken: false
    },
    sorts: [
        {
            name: RiskOverviewHeaderEnum.NAME,
            direction: SortDirectionEnum.ASC
        },
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

const applyAllFilters = (risks: Risk[], filters: RiskOverviewFilterType): Risk[] => {
    const valueRange =
        Array.isArray(filters.value) && filters.value.length >= 2
            ? filters.value
            : [0, 200000];
    const termRange =
        Array.isArray(filters.remainingTerm) && filters.remainingTerm.length >= 2
            ? filters.remainingTerm
            : [0, 24];

    const filteredRisks = risks.filter((risk) => {
        const matchesType =
            filters.types.length === 0 ||
            filters.types.some((type) => risk.type.includes(type));

        const matchesValue =
            risk.value >= valueRange[0] && risk.value <= valueRange[1];

        const declinationDate = new Date(risk.declinationDate);
        const currentDate = new Date();
        const remainingMonths =
            (declinationDate.getFullYear() - currentDate.getFullYear()) * 12 +
            (declinationDate.getMonth() - currentDate.getMonth());
        const matchesTerm =
            remainingMonths >= termRange[0] && remainingMonths <= termRange[1];

        return matchesType && matchesValue && matchesTerm;
    });

    // Risiken mit Status AGREEMENT immer nach unten sortieren
    return filteredRisks.sort((a, b) => {
        const isAAgreement = a.status === RiskStatusEnum.AGREEMENT;
        const isBAgreement = b.status === RiskStatusEnum.AGREEMENT;
        if (isAAgreement && !isBAgreement) return 1;
        if (!isAAgreement && isBAgreement) return -1;
        return 0;
    });
};

export const riskOverviewSlice = createSlice({
    name: FirestoreCollectionEnum.RISKS,
    initialState: initialState,
    reducers: {
        sortRisks: (state, action: PayloadAction<RiskOverviewHeaderEnum>) => {
            const sort = state.sorts.find((s) => s.name === action.payload);
            if (!sort) return;

            sort.direction =
                sort.direction === SortDirectionEnum.ASC
                    ? SortDirectionEnum.DESC
                    : SortDirectionEnum.ASC;

            state.filteredRisks.sort((a, b) => {
                // Zuerst: Risiken mit AGREEMENT immer nach unten
                const isAAgreement = a.status === RiskStatusEnum.AGREEMENT;
                const isBAgreement = b.status === RiskStatusEnum.AGREEMENT;
                if (isAAgreement && !isBAgreement) return 1;
                if (!isAAgreement && isBAgreement) return -1;

                // Danach reguläre Sortierung
                if (sort.name === RiskOverviewHeaderEnum.PUBLISHER) {
                    if (!a.publisher || !b.publisher) return 0;
                    return sort.direction === SortDirectionEnum.ASC
                        ? a.publisher.name.localeCompare(b.publisher.name)
                        : b.publisher.name.localeCompare(a.publisher.name);
                }

                const aValue = a[sort.name];
                const bValue = b[sort.name];

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sort.direction === SortDirectionEnum.ASC
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                if (aValue > bValue) return sort.direction === SortDirectionEnum.ASC ? 1 : -1;
                if (aValue < bValue) return sort.direction === SortDirectionEnum.ASC ? -1 : 1;
                return 0;
            });
        },
        setFilterType: (state, action: PayloadAction<string[]>) => {
            state.filters.types = action.payload;
            state.filteredRisks = applyAllFilters(state.risks, state.filters as RiskOverviewFilterType);
        },
        changeFilterValue: (state, action: PayloadAction<number[]>) => {
            state.filters.value = action.payload;
            state.filteredRisks = applyAllFilters(state.risks, state.filters as RiskOverviewFilterType);
        },
        changeRemainingTerm: (state, action: PayloadAction<number[]>) => {
            state.filters.remainingTerm = action.payload;
            state.filteredRisks = applyAllFilters(state.risks, state.filters as RiskOverviewFilterType);
        },
        clearFilters: (state) => {
            state.filters.types = [];
            state.filters.value = [0, 200000];
            state.filters.remainingTerm = [0, 24];
            state.filteredRisks = state.risks;
        },
        setRisks: (state, action: PayloadAction<Risk[]>) => {
            state.risks = action.payload;
            state.filteredRisks = defaultSortRisks(
                applyAllFilters(action.payload, state.filters as RiskOverviewFilterType)
            );
        },
        setShowTaken: (state, action: PayloadAction<boolean>) => {
            state.filters.showTaken = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRisks.pending, (state) => {
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(fetchRisks.fulfilled, (state, action) => {
                state.risks = action.payload;
                state.filteredRisks = defaultSortRisks(
                    applyAllFilters(action.payload, state.filters as RiskOverviewFilterType)
                );
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
                if (state.risks.some((risk) => risk.id === action.payload.id)) {
                    return;
                }
                state.risks.push(action.payload);
                state.filteredRisks = defaultSortRisks(applyAllFilters(state.risks, state.filters));
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
                const newRisks = state.risks.filter((risk) => risk.id !== action.payload);
                state.risks = newRisks;
                state.filteredRisks = applyAllFilters(newRisks, state.filters);
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
            })
            .addCase(updateProviderDetails.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateProviderDetails.fulfilled, (state, action) => {
                state.risks.forEach((risk) => {
                    if (risk?.publisher?.uid === action.payload.uid) {
                        risk.publisher = action.payload;
                    }
                });
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateProviderDetails.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(updateRiskStatus.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateRiskStatus.fulfilled, (state, action) => {
                state.risks.forEach((risk) => {
                    if (risk.id === action.payload.id) {
                        risk.status = action.payload.status;
                    }
                });
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateRiskStatus.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(deleteRisksByUid.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(deleteRisksByUid.fulfilled, (state, action) => {
                state.risks = state.risks.filter((risk) => risk?.publisher?.uid !== action.payload);
                state.filteredRisks = applyAllFilters(state.risks, state.filters);
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(deleteRisksByUid.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            })
            .addCase(updateRisk.pending, (state) => {
                state.error = undefined;
                state.status = FetchStatusEnum.PENDING;
            })
            .addCase(updateRisk.fulfilled, (state, action) => {
                state.risks = state.risks.map((risk) => {
                    if (risk.id === action.payload.id) {
                        return action.payload;
                    }
                    return risk;
                });
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(updateRisk.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            });
        }
    }
);

export const {
    sortRisks,
    setFilterType,
    changeFilterValue,
    changeRemainingTerm,
    clearFilters,
    setRisks,
    setShowTaken
} = riskOverviewSlice.actions;

export default riskOverviewSlice.reducer;
