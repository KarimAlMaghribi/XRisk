import Grid from "@mui/material/Grid2";
import {Typography} from "@mui/material";
import {elementBottomMargin} from "../../../risk/risk-overview-element";
import React from "react";

export const DealsTableHeader = () => {
    return (
        <Grid container sx={{width: "100%", minWidth: 0}}>
            <Grid size={1}>
                <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Nr.
                </Typography>
            </Grid>
            <Grid size={1}>
                <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Risikoträger
                </Typography>
            </Grid>
            <Grid size={2}>
                <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Titel
                </Typography>
            </Grid>
            <Grid size={4}>
                <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Letzte Nachricht
                </Typography>
            </Grid>
            <Grid size={1}>
                <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Beginn
                </Typography>
            </Grid>
            <Grid size={1}>
                <Typography variant="body2" sx={{marginBottom: `${elementBottomMargin - 15}px`, paddingTop: "20px"}}>
                    Letzte Aktivität
                </Typography>
            </Grid>
        </Grid>
    )
}
