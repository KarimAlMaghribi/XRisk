import {Risk} from "../../../../models/Risk";
import {Chat} from "../../../../store/slices/my-bids/types";
import Grid from "@mui/material/Grid2";
import {Typography} from "@mui/material";
import {elementBottomMargin} from "../../../risk/risk-overview-element";
import React from "react";
import {AgreementElement} from "./agreement-element";
import {Trans} from "react-i18next";

export interface AgreementDetailsProps {
    risk: Risk;
    chats: Chat[];
    taken?: boolean;
}

export const AgreementDetails = (props: AgreementDetailsProps) => {
    return (
        <>
            <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="body1" sx={{ mb: `${elementBottomMargin}px` }}>
                        <Trans i18nKey="my_risks.agreements" />
                    </Typography>
                </Grid>

                {props.chats.map((chat) => (
                    <Grid key={chat.id} size={{ xs: 12 }} sx={{ mb: { xs: 1, md: 2 } }}>
                        <AgreementElement risk={props.risk} chat={chat} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
