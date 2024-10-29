export interface RiskOverviewFilterTypes {
    name: string;
    label: string;
    checked: boolean;
}

export interface RiskOverviewFilterType {
    types: RiskOverviewFilterTypes[];
    value: number | number[];
    remainingTerm: number | number[];
}
