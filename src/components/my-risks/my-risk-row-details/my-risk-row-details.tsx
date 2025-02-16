import {Risk} from "../../../models/Risk";
import React from "react";
import {Box, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectChatsByRiskId} from "../../../store/slices/my-bids/selectors";
import {Chat} from "../../../store/slices/my-bids/types";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";
import {PublishedDetails} from "./published-details";
import {WithdrawnDetails} from "./withdrawn-details";
import {DealDetails} from "./deals-details";

export interface MyRiskRowDetailsProps {
    risk: Risk;
}


export const MyRiskRowDetails = (props: MyRiskRowDetailsProps) => {
    const riskRelatedChats: Chat[] = useSelector(selectChatsByRiskId(props.risk.id));

    const getRiskDetails = () => {
        switch (props.risk.status) {
            case RiskStatusEnum.PUBLISHED:
                return <PublishedDetails risk={props.risk}/>;
            case RiskStatusEnum.WITHDRAWN:
                return <WithdrawnDetails risk={props.risk}/>;
            case RiskStatusEnum.DEAL:
                return <DealDetails risk={props.risk} chats={riskRelatedChats}/>;
            default:
                return <></>;
        }
    }

    return (
        <Box margin="0 5% 0 5%">
            <Typography variant="h6">
                Details
            </Typography>
            <Box marginTop="10px" padding="10px">{getRiskDetails()}</Box>
        </Box>
    )
}
