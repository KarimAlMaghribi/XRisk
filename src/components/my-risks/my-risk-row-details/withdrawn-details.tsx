import {Risk} from "../../../models/Risk";
import Grid from "@mui/material/Grid2";
import {Typography} from "@mui/material";
import {elementBottomMargin} from "../../risk/risk-overview-element";
import React from "react";

export const WithdrawnDetails = ({ risk }: { risk: Risk }) => {
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
                        <Typography variant="body2" sx={{color: "grey", marginBottom: `${elementBottomMargin}px`}}>
                            Zurückgezogen am am
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
                        <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                            {risk.withdrawnAt ? new Date(risk.withdrawnAt).toLocaleDateString() : "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
