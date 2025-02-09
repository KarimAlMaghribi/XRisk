import {RiskStatus} from "../../types/RiskStatus";
import React from "react";
import {Box, Typography} from "@mui/material";
import {Risk} from "../../models/Risk";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {MyRiskRow} from "./my-risk-row";
import {RiskPanelArea} from "../../enums/RiskPanelArea.enum";

export interface PanelProps {
    risks: Risk[];
    type: RiskStatus;
}

export const Panel = (props: PanelProps) => {
    const getHeaders = (column: 1 | 2 | 3 | 4 | 5) => {
        if (props.type === RiskStatusEnum.PUBLISHED) {
            switch (column) {
                case 1:
                    return RiskPanelArea.DRAFT;
                case 2:
                    return RiskPanelArea.PUBLISHED;
                case 3:
                    return RiskPanelArea.WITHDRAWN;
                case 4:
                    return RiskPanelArea.DEAL;
                case 5:
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

    const getRiskRow = (column: 1 | 2 | 3 | 4 | 5, risk: Risk) => {
        if (props.type === RiskStatusEnum.PUBLISHED) {
            if (risk.status === RiskStatusEnum.DRAFT && column === 1) {
                return <MyRiskRow risk={risk}/>;
            }

            if (risk.status === RiskStatusEnum.PUBLISHED && column === 2) {
                return <MyRiskRow risk={risk}/>;
            }

            if (risk.status === RiskStatusEnum.WITHDRAWN && column === 3) {
                return <MyRiskRow risk={risk}/>;
            }

            if (risk.status === RiskStatusEnum.DEAL && column === 4) {
                return <MyRiskRow risk={risk}/>;
            }

            if (risk.status === RiskStatusEnum.AGREEMENT && column === 5) {
                return <MyRiskRow risk={risk}/>;
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
            <Typography variant="button" component="div" fontWeight="bolder" marginTop="20px">
                {getHeaders(5)}
            </Typography>
            {props.risks.map((risk) => getRiskRow(5, risk))}

        </Box>
    )
}
