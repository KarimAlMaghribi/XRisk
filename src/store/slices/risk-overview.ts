import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Risk} from "../../models/Risk";
import {RiskAPI} from "../../apis/risk-api";
import {FetchStatus} from "../../types/FetchStatus";
import {RiskOverviewSort} from "../../models/RiskOverviewSort";
import {RiskOverviewHeaderEnum} from "../../enums/RiskOverviewHeader.enum";
import {SortDirectionEnum} from "../../enums/SortDirection.enum";

const mockRisks: Risk[] = [
    {
        id: "1",
        name: "Sicherheit auf dem Weg zum internationalen Kongress",
        description: "Deckung von Risiken während der Reise zu und von einem internationalen Kongress, einschließlich Transportmittel und Aufenthalt.",
        type: "Reise",
        value: 500000,
        publisher: "Global Congress Security",
        offerer: "TravelGuard Insurance",
        declinationDate: "2024-12-31",
        published: true,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        publishedAt: "2024-01-20",
        riskStatus: "active",
        riskCategory: "business",
        riskProbability: 0.05
    },
    {
        id: "2",
        name: "Cyberangriff auf Finanzsysteme",
        description: "Versicherungsschutz gegen Schäden durch Cyberangriffe auf unternehmenseigene Finanzsysteme und Datenbanken.",
        type: "Cyber",
        value: 2000000,
        publisher: "TechSecure",
        offerer: "CyberPro Insure",
        declinationDate: "2025-01-01",
        published: true,
        createdAt: "2024-02-01",
        updatedAt: "2024-02-05",
        publishedAt: "2024-02-05",
        riskStatus: "active",
        riskCategory: "corporate",
        riskProbability: 0.20
    },
    {
        id: "3",
        name: "Absicherung von Ernteausfällen",
        description: "Versicherung gegen Ernteausfall durch unerwartete klimatische Bedingungen wie Dürre oder Überschwemmung.",
        type: "Landwirtschaft",
        value: 1000000,
        publisher: "AgriCover",
        offerer: "FarmSecure",
        declinationDate: "2024-12-31",
        published: true,
        createdAt: "2024-03-10",
        updatedAt: "2024-03-15",
        publishedAt: "2024-03-15",
        riskStatus: "active",
        riskCategory: "agriculture",
        riskProbability: 0.25
    },
    {
        id: "4",
        name: "Versicherung von Luxusyachten gegen Piraterie",
        description: "Deckung gegen Piraterieangriffe und die daraus resultierenden Schäden während internationaler Fahrten.",
        type: "Maritim",
        value: 3000000,
        publisher: "MarineGuard",
        offerer: "Oceanic Insurers",
        declinationDate: "2025-02-28",
        published: true,
        createdAt: "2024-04-20",
        updatedAt: "2024-04-25",
        publishedAt: "2024-04-25",
        riskStatus: "active",
        riskCategory: "marine",
        riskProbability: 0.10
    },
    {
        id: "5",
        name: "Absicherung gegen Ausfälle von Großveranstaltungen",
        description: "Versicherung gegen finanzielle Verluste aus der Absage von Großveranstaltungen aufgrund von Wetterbedingungen, politischen Unruhen oder Pandemien.",
        type: "Event",
        value: 4000000,
        publisher: "EventShield",
        offerer: "MajorEvent Insurance",
        declinationDate: "2024-10-01",
        published: true,
        createdAt: "2024-05-05",
        updatedAt: "2024-05-10",
        publishedAt: "2024-05-10",
        riskStatus: "active",
        riskCategory: "entertainment",
        riskProbability: 0.15
    },
    {
        id: "6",
        name: "Kreditversicherung für Start-ups",
        description: "Schutz vor dem Ausfall von Kreditrückzahlungen junger Unternehmen in der Frühphase ihrer Entwicklung.",
        type: "Finanz",
        value: 1500000,
        publisher: "StartupSecure",
        offerer: "InnovateInsure",
        declinationDate: "2024-11-30",
        published: true,
        createdAt: "2024-06-01",
        updatedAt: "2024-06-05",
        publishedAt: "2024-06-05",
        riskStatus: "active",
        riskCategory: "financial",
        riskProbability: 0.30
    },
    {
        id: "7",
        name: "Haftpflichtversicherung für Roboterchirurgen",
        description: "Versicherungsschutz gegen Haftungsansprüche im Falle eines Fehlers bei chirurgischen Eingriffen durch Roboter.",
        type: "Medizinisch",
        value: 5000000,
        publisher: "MediTech Safety",
        offerer: "HealthShield",
        declinationDate: "2024-12-31",
        published: true,
        createdAt: "2024-07-15",
        updatedAt: "2024-07-20",
        publishedAt: "2024-07-20",
        riskStatus: "active",
        riskCategory: "healthcare",
        riskProbability: 0.05
    },
    {
        id: "8",
        name: "Versicherung von Satelliten gegen Weltraumschrott",
        description: "Schutz von Satelliten im Orbit gegen Kollisionen mit Weltraumschrott und anderen orbitalen Gefahren.",
        type: "Weltraum",
        value: 7500000,
        publisher: "SpaceGuard",
        offerer: "AstroInsure",
        declinationDate: "2025-03-31",
        published: true,
        createdAt: "2024-08-30",
        updatedAt: "2024-09-04",
        publishedAt: "2024-09-04",
        riskStatus: "active",
        riskCategory: "space",
        riskProbability: 0.07
    },
    {
        id: "9",
        name: "Rückrufversicherung für Automobilhersteller",
        description: "Deckung der Kosten im Falle eines Rückrufs von Fahrzeugen aufgrund von Fertigungsfehlern oder Sicherheitsmängeln.",
        type: "Automobil",
        value: 6000000,
        publisher: "AutoCover",
        offerer: "VehicleSafe",
        declinationDate: "2024-09-30",
        published: true,
        createdAt: "2024-10-10",
        updatedAt: "2024-10-15",
        publishedAt: "2024-10-15",
        riskStatus: "active",
        riskCategory: "automotive",
        riskProbability: 0.20
    },
    {
        id: "10",
        name: "Versicherung gegen Rechtsstreitigkeiten bei internationalen Geschäften",
        description: "Schutz vor den Kosten und dem Risiko von Rechtsstreitigkeiten bei internationalen Handels- und Geschäftsaktivitäten.",
        type: "Rechtlich",
        value: 2500000,
        publisher: "GlobalTrade Insurance",
        offerer: "CommerceProtect",
        declinationDate: "2024-12-31",
        published: true,
        createdAt: "2024-11-05",
        updatedAt: "2024-11-10",
        publishedAt: "2024-11-10",
        riskStatus: "active",
        riskCategory: "legal",
        riskProbability: 0.10
    }
];

export interface RiskOverviewState {
    risks: Risk[];
    filters: any;
    sorts: RiskOverviewSort[];
    loading: FetchStatus;
    error?: string;
}

const initialState: RiskOverviewState = {
    risks: mockRisks,
    filters: null,
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
    loading: 'idle'
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

            state.risks.sort((a, b) => {
                if (!sort) return 0;
                if (sort.direction === SortDirectionEnum.ASC) {
                    return a[sort.name] > b[sort.name] ? 1 : -1;
                } else {
                    return a[sort.name] < b[sort.name] ? 1 : -1;
                }
            });
        },
        filterRisks: (state, action) => {
            state.filters = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRisks.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchRisks.fulfilled, (state, action) => {
                state.risks = action.payload;
                state.loading = "succeeded";
            })
            .addCase(fetchRisks.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = "failed";
            });
    }
});

export const selectRisks = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.risks;
export const selectStatus = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.loading;
export const selectSorts = (state: { riskOverview: RiskOverviewState }) => state.riskOverview.sorts;

export const { sortRisks, filterRisks } = riskOverviewSlice.actions;

export default riskOverviewSlice.reducer;
