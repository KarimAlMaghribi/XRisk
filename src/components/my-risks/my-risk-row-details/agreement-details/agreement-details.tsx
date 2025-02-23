import {Risk} from "../../../../models/Risk";
import {Chat} from "../../../../store/slices/my-bids/types";
import Grid from "@mui/material/Grid2";
import {Typography} from "@mui/material";
import {elementBottomMargin} from "../../../risk/risk-overview-element";
import React from "react";
import {AgreementElement} from "./agreement-element";

export interface AgreementDetailsProps {
    risk: Risk;
    chats: Chat[];
}

export const AgreementDetails = (props: AgreementDetailsProps) => {
    return (
        <>
            <Grid container>
                <Grid size={12}>
                    <Typography variant="body1" sx={{marginBottom: `${elementBottomMargin}px`}}>
                        Einigungen
                    </Typography>
                </Grid>

                {
                    props.chats.map((chat: Chat, index: number) => {
                        return (
                            <Grid size={12} marginBottom="20px">
                                <AgreementElement risk={props.risk} chat={chat} key={index}/>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}
