import {Risk} from "../../models/Risk";
import React from "react";
import {Box, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectChatsByRiskId} from "../../store/slices/my-bids/selectors";
import {Chat} from "../../store/slices/my-bids/types";
import Grid from "@mui/material/Grid2";
import {elementBottomMargin} from "../risk/risk-overview-element";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {RiskStatus} from "../../types/RiskStatus";

export interface MyRiskRowDetailsProps {
    risk: Risk;
}

export const PublishedDetails = ({ risk }: { risk: Risk }) => {
    return (
        <Grid container>
            <Grid size={6}>
                <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                    Beschreibung
                </Typography>
                <Typography variant="body2" sx={{color: "grey"}}>
                    {risk.description}
                </Typography>
            </Grid>
            <Grid size={6}>
                <Typography variant="body1">
                    Historie
                </Typography>
                <br />
                <Grid container>
                    <Grid size={4}>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}} >
                            Erstellt am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Aktualisiert am
                        </Typography>
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Veröffentlichet am
                        </Typography>
                    </Grid>
                    <Grid size={8}>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.createdAt ? new Date(risk.createdAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.updatedAt ? new Date(risk.updatedAt).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.publishedAt ? new Date(risk.publishedAt).toLocaleDateString() : "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export const MyRiskRowDetails = (props: MyRiskRowDetailsProps) => {
    const riskRelatedChats: Chat[] = useSelector(selectChatsByRiskId(props.risk.id));

    const getRiskDetails = () => {
        switch (props.risk.status) {
            case RiskStatusEnum.PUBLISHED:
                return <PublishedDetails risk={props.risk} />;
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
