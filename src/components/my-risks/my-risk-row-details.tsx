import {Risk} from "../../models/Risk";
import React from "react";
import {Box, Divider} from "@mui/material";

export interface MyRiskRowDetailsProps {
    risk: Risk;

}

export const MyRiskRowDetails = (props: MyRiskRowDetailsProps) => {
    return (
        <Box margin="0 5% 0 5%">
            <h1>Details</h1>
        </Box>
    )
}
