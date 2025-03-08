import React from "react";
import {Box, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectActiveChat} from "../../../store/slices/my-bids/selectors";
import {Chat} from "../../../store/slices/my-bids/types";
import {auth} from "../../../firebase_config";

interface RiskAgreementHeaderProps {
    riskTitle: string;
    riskType: string[];
}

export const RiskAgreementHeader = (props: RiskAgreementHeaderProps) => {
    const activeChat: Chat | undefined = useSelector(selectActiveChat);

    return (
        <Box margin="10px">
            <Typography variant="subtitle1">
                <strong>Titel:</strong> {props.riskTitle}
            </Typography>
            <Typography variant="subtitle1">
                <strong>Art des Risikos:</strong> {props.riskType.join(", ")}
            </Typography>
            <Typography variant="subtitle1">
                <strong>Risikogeber:</strong> {activeChat?.riskProvider.name} {activeChat?.riskProvider.uid === auth?.currentUser?.uid && "(Du)"}
            </Typography>
            <Typography variant="subtitle1">
                <strong>Risikonehmer:</strong> {activeChat?.riskTaker.name}  {activeChat?.riskTaker.uid === auth?.currentUser?.uid && "(Du)"}
            </Typography>
        </Box>
    )

}
