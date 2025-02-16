import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import DraftsIcon from "@mui/icons-material/Drafts";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import UndoIcon from "@mui/icons-material/Undo";
import {RiskStatus} from "../../types/RiskStatus";

import React from "react";

export const mapStatus = (status: RiskStatusEnum | undefined) => {
    if (!status) return ("Unbekannter Status");

    switch(status) {
        case RiskStatusEnum.DRAFT:
            return "Entwurf";
        case RiskStatusEnum.PUBLISHED:
            return "Veröffentlicht";
        case RiskStatusEnum.AGREEMENT:
            return "Geeignigt";
        case RiskStatusEnum.DEAL:
            return "In Verhandlung";
        case RiskStatusEnum.WITHDRAWN:
            return "Zurückgezogen";
    }
}

export const mapStatusIcon = (status: RiskStatusEnum | undefined) => {
    if (!status) return <QuestionMarkIcon />;

    switch(status) {
        case RiskStatusEnum.DRAFT:
            return <DraftsIcon />;
        case RiskStatusEnum.PUBLISHED:
            return <GroupsIcon />;
        case RiskStatusEnum.AGREEMENT:
            return <HandshakeIcon />;
        case RiskStatusEnum.DEAL:
            return <SportsKabaddiIcon />;
        case RiskStatusEnum.WITHDRAWN:
            return <UndoIcon />;
    }
}

export const mapStatusChipColor = (status: RiskStatus | undefined) => {
    switch(status) {
        case RiskStatusEnum.DRAFT:
            return "info";
        case RiskStatusEnum.PUBLISHED:
            return "success";
        case RiskStatusEnum.AGREEMENT:
            return "success";
        case RiskStatusEnum.DEAL:
            return "error";
        case RiskStatusEnum.WITHDRAWN:
            return "warning";
        default:
            return "primary";
    }
}

export const mapStatusToolTip = (status: RiskStatus | undefined) => {
    switch(status) {
        case RiskStatusEnum.DRAFT:
            return "Entwurf: Vor dir erstellt, von anderen noch nicht einsehbar.";
        case RiskStatusEnum.PUBLISHED:
            return "Veröffentlicht: Von dir zur an der Börse zur Verhandlung freigegeben.";
        case RiskStatusEnum.AGREEMENT:
            return "Geeinigt: Von dir und deinem Verhandlungspartner zu übereinstimmenden Konditionen gelangt."
        case RiskStatusEnum.DEAL:
            return "In Verhandlung: Du verhandelst um die Konditionen mit deinem Vertragspartner.";
        case RiskStatusEnum.WITHDRAWN:
            return "Zurückgezogen: Von dir veröffentlichtes Risiko wieder zurückgezogen";
        default:
            return "Unbekannter Status";
    }
}
