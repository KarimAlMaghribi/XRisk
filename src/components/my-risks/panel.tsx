import {RiskStatus} from "../../types/RiskStatus";
import React from "react";
import {Box, Typography} from "@mui/material";
import {Risk} from "../../models/Risk";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {MyRiskRow} from "./my-risk-row";
import {RiskPanelArea} from "../../enums/RiskPanelArea.enum";
import dayjs from "dayjs";

export interface PanelProps {
    risks: Risk[];
    type: RiskStatus;
}

export const Panel = (props: PanelProps) => {
    const getHeaders = (column: 1 | 2 | 3 | 4) => {
        if (props.type === RiskStatusEnum.DRAFT) {
            switch (column) {
                case 1:
                    return RiskPanelArea.RECENTLY_DEFINED;
                case 2:
                    return RiskPanelArea.PLANNED_PUBLICATION;
                default:
                    return null;
            }
        }

        if (props.type === RiskStatusEnum.PUBLISHED) {
            switch (column) {
                case 1:
                    return RiskPanelArea.PUBLISHED;
                case 2:
                    return RiskPanelArea.WITHDRAWN;
                case 3:
                    return RiskPanelArea.DEAL;
                case 4:
                    return RiskPanelArea.AGREEMENT;
                default:
                    return null;
            }
        }

        if (props.type === RiskStatusEnum.AGREEMENT) {
            switch (column) {
                case 1:
                    return RiskPanelArea.DEAL;
                case 2:
                    return RiskPanelArea.RISK_TAKEN;
                default:
                    return null;
            }
        }
    }

    const getRiskRow = (column: 1 | 2 | 3 | 4, risk: Risk) => {
        if (props.type === RiskStatusEnum.DRAFT && risk.status === RiskStatusEnum.DRAFT) {
            const createdAt = dayjs(risk.createdAt);
            const hoursDiff = dayjs().diff(createdAt, "hour");

            if (column === 1 && hoursDiff < 24) {
                return <MyRiskRow risk={risk} />;
            }
            if (column === 2 && hoursDiff >= 24) {
                return <MyRiskRow risk={risk} />;
            }
        }

        if (props.type === RiskStatusEnum.PUBLISHED && risk.status === RiskStatusEnum.PUBLISHED) {
            if (column === 1) {
                return <MyRiskRow risk={risk} />;
            }
        }

        return null;
    };

    return (
        <Box>
            <Typography variant="button" component="div" fontWeight="bolder" marginTop="20px">
                {getHeaders(1)}
            </Typography>
            {props.risks.map((risk) => getRiskRow(1, risk))}
            <Typography variant="button" component="div" fontWeight="bolder" marginTop="20px">
                {getHeaders(2)}
            </Typography>
            {props.risks.map((risk) => getRiskRow(2, risk))}
            <Typography variant="button" component="div" fontWeight="bolder" marginTop="20px">
                {getHeaders(3)}
            </Typography>
            {props.risks.map((risk) => getRiskRow(3, risk))}
            <Typography variant="button" component="div" fontWeight="bolder" marginTop="20px">
                {getHeaders(4)}
            </Typography>
            {props.risks.map((risk) => getRiskRow(4, risk))}

        </Box>
    )
}
