import React from "react";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import {Divider, Typography} from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Tooltip from "@mui/material/Tooltip";

export const RiskOverviewHeader = () => {
    const backgroundColor = "#f1f6f1";

    const sortCol = (col: string) => {
        console.log(col);
    }

    return (
        <Grid container>
            <Grid size={2} style={{padding: "20px 0 20px 0", textAlign: "center", backgroundColor: backgroundColor}}>
                <Button variant="outlined">Risiko erstellen</Button>
            </Grid>

            <Grid size={10} style={{backgroundColor: backgroundColor, paddingTop: "20px", paddingBottom: "20px"}}>
                <Grid container>
                    <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
                        <SwapVertIcon style={{cursor: "pointer"}} onClick={() => sortCol("name")}/>
                        <Tooltip title="Der Name des Risikos (vergeben vom Anbieter)">
                            <Typography style={{cursor: "pointer"}} variant="h6">Name</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}>
                        <SwapVertIcon style={{cursor: "pointer"}} onClick={() => sortCol("type")}/>
                        <Tooltip title="Zugeordneter Typ des Risikos">
                            <Typography style={{cursor: "pointer"}} variant="h6">Typ</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
                        <SwapVertIcon style={{cursor: "pointer"}} onClick={() => sortCol("value")}/>
                        <Tooltip title="Die Höhe, mit der das Risiko...">
                            <Typography style={{cursor: "pointer"}} variant="h6">Nennwert</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}>
                        <SwapVertIcon style={{cursor: "pointer"}} onClick={() => sortCol("declinationDate")}/>
                        <Tooltip title="Zeitpunkt, an dem das Risiko...">
                            <Typography style={{cursor: "pointer"}} variant="h6">Fällig am</Typography>
                        </Tooltip>
                    </Grid>
                    <Grid size={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <SwapVertIcon style={{cursor: "pointer"}} onClick={() => sortCol("publisher")}/>
                        <Tooltip title="Person, die das Risiko erstellt und veröffentlicht hat">
                            <Typography style={{cursor: "pointer"}} variant="h6">Anbieter</Typography>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}
