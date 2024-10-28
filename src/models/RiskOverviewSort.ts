import {RiskOverviewHeaderEnum} from "./RiskOverviewHeader.enum";
import {SortDirectionEnum} from "./SortDirection.enum";

export interface RiskOverviewSort {
    name: RiskOverviewHeaderEnum;
    direction: SortDirectionEnum;
}
