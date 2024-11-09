import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";
import {RiskAPI} from "../../apis/risk-api";
import {FetchStatus} from "../../types/FetchStatus";
import {RiskOverviewSort} from "../../models/RiskOverviewSort";
import {RiskOverviewHeaderEnum} from "../../enums/RiskOverviewHeader.enum";
import {SortDirectionEnum} from "../../enums/SortDirection.enum";
import {RiskOverviewFilterType} from "../../models/RiskOverviewFilterType";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";

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

const mockRisks: Risk[] = [
    {
        id: "1",
        name: "Sicherheit auf dem Weg zum internationalen Kongress",
        description: "Umfassender Versicherungsschutz für Risiken, die mit der Reise zu und von internationalen Kongressen verbunden sind, einschließlich Flug-, Zug- und lokalem Transport sowie Hotelunterkünften.",
        type: "Reise",
        value: 50000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-12-31",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        publishedAt: "2024-01-20",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "business",
        riskProbability: 0.05
    },
    {
        id: "2",
        name: "Cyberangriff auf Finanzsysteme",
        description: "Versicherungsschutz gegen umfassende Cyberangriffe auf unternehmenseigene Finanzsysteme, einschließlich Datenverlust und -beschädigung durch Hackerangriffe.",
        type: "Cyber",
        value: 200000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2025-01-01",
        createdAt: "2024-02-01",
        updatedAt: "2024-02-05",
        publishedAt: "2024-02-05",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "corporate",
        riskProbability: 0.20
    },
    {
        id: "3",
        name: "Absicherung von Ernteausfällen",
        description: "Schutz gegen finanzielle Verluste durch Ernteausfälle infolge unvorhergesehener Wetterereignisse wie Dürreperioden oder Überschwemmungen, die landwirtschaftliche Flächen betreffen.",
        type: "Landwirtschaft",
        value: 100000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-12-31",
        createdAt: "2024-03-10",
        updatedAt: "2024-03-15",
        publishedAt: "2024-03-15",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "agriculture",
        riskProbability: 0.25
    },
    {
        id: "4",
        name: "Versicherung von Luxusyachten gegen Piraterie",
        description: "Versicherungsschutz für Luxusyachten gegen Piraterieangriffe und resultierende Schäden während der Fahrt durch internationale Gewässer.",
        type: "Maritim",
        value: 300000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2025-02-28",
        createdAt: "2024-04-20",
        updatedAt: "2024-04-25",
        publishedAt: "2024-04-25",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "marine",
        riskProbability: 0.10
    },
    {
        id: "5",
        name: "Absicherung gegen Ausfälle von Großveranstaltungen",
        description: "Bietet finanziellen Schutz bei der Absage von Großveranstaltungen aufgrund von Wetterkatastrophen, politischen Unruhen oder Gesundheitskrisen.",
        type: "Event",
        value: 400000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-10-01",
        createdAt: "2024-05-05",
        updatedAt: "2024-05-10",
        publishedAt: "2024-05-10",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "entertainment",
        riskProbability: 0.15
    },
    {
        id: "6",
        name: "Kreditversicherung für Start-ups",
        description: "Versicherungsschutz für das Risiko von Kreditausfällen bei Start-ups in der kritischen Anfangsphase ihrer Geschäftstätigkeit.",
        type: "Finanz",
        value: 150000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-11-30",
        createdAt: "2024-06-01",
        updatedAt: "2024-06-05",
        publishedAt: "2024-06-05",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "financial",
        riskProbability: 0.30
    },
    {
        id: "7",
        name: "Haftpflichtversicherung für Roboterchirurgen",
        description: "Versicherungsschutz für Haftungsansprüche im Falle eines chirurgischen Fehlers bei Eingriffen, die von robotergesteuerten Chirurgiegeräten durchgeführt werden.",
        type: "Medizinisch",
        value: 500000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-12-31",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-20",
        publishedAt: "2024-07-20",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "healthcare",
        riskProbability: 0.05
    },
    {
        id: "8",
        name: "Versicherung von Satelliten gegen Weltraumschrott",
        description: "Schutz für Satelliten, die sich im Erdorbit befinden, gegen die Gefahren von Kollisionen mit Weltraumschrott und anderen Objekten im Orbit.",
        type: "Weltraum",
        value: 75000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2025-03-31",
        createdAt: "2024-08-30",
        updatedAt: "2024-09-04",
        publishedAt: "2024-09-04",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "space",
        riskProbability: 0.07
    },
    {
        id: "9",
        name: "Rückrufversicherung für Automobilhersteller",
        description: "Versicherungsschutz für Automobilhersteller gegen die Kosten von Rückrufaktionen aufgrund von Mängeln in der Produktion oder sicherheitsrelevanten Bedenken.",
        type: "Automobil",
        value: 60000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-09-30",
        createdAt: "2024-10-10",
        updatedAt: "2024-10-15",
        publishedAt: "2024-10-15",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "automotive",
        riskProbability: 0.20
    },
    {
        id: "10",
        name: "Versicherung gegen Rechtsstreitigkeiten bei internationalen Geschäften",
        description: "Absicherung gegen die finanziellen Belastungen und das Risiko von Rechtsstreitigkeiten bei internationalen Handels- und Geschäftsaktivitäten.",
        type: "Rechtlich",
        value: 25000,
        publisher: {name: "Hans Müller", address: "Musterstraße 5, 04107 Leipzig, Deutschland"},
        declinationDate: "2024-12-31",
        createdAt: "2024-11-05",
        updatedAt: "2024-11-10",
        publishedAt: "2024-11-10",
        status: RiskStatusEnum.PUBLISHED,
        riskCategory: "legal",
        riskProbability: 0.10
    }
];

export interface RiskOverviewState {
    risks: Risk[];
    filteredRisks: Risk[];
    filters: RiskOverviewFilterType;
    sorts: RiskOverviewSort[];
    status: FetchStatus;
    error?: string;
}

const initialState: RiskOverviewState = {
    risks: mockRisks,
    filteredRisks: mockRisks,
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
    'risk-overview/fetchRisks',
    async (_, thunkAPI) => {
        const response = await RiskAPI.fetchAll();
        return response.risks;
    }
);

export const riskOverviewSlice = createSlice({
    name: "riskOverview",
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
                state.status = FetchStatusEnum.SUCCEEDED;
            })
            .addCase(fetchRisks.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = FetchStatusEnum.FAILED;
            });
    }
});

export const selectRisks = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.risks;
export const selectFilteredRisks = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filteredRisks;
export const selectStatus = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.status;
export const selectSorts = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.sorts;
export const selectFilterTypes = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filters.types;
export const selectFilterValue = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filters.value;
export const selectRemainingTerm = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.filters.remainingTerm;

export const { sortRisks, setFilterType, changeFilterValue, changeRemainingTerm, clearFilters } = riskOverviewSlice.actions;

export default riskOverviewSlice.reducer;
