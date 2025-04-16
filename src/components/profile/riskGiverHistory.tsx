import {useRiskHistory} from "./use-risk-history";
import "./style.css";
import React from "react";
import {Box, CircularProgress, Divider, Typography} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import LightModeIcon from '@mui/icons-material/LightMode';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

export interface HistoryProps {
    uid: string | undefined | null;
}

export const RiskGiverHistory = (props: HistoryProps) => {
    const { risks, loading } = useRiskHistory(props.uid);

    return (
        <>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Risikoabgabe-Historie
            </Typography>
            <Divider />
            <br />
            {
                risks && risks.length > 0
                    ? <Box display="flex">
                            {   !loading
                                ? risks.map((risk, index) => (
                                    <Tooltip followCursor title={`Risiko "${risk.name}" abgegeben am ${new Date(risk.publishedAt || "").toLocaleString()} - ${risk.occurred ? "EINGETRETEN" : "NICHT EINGETRETEN"}`} placement="top">
                                        <div key={index} className="riskGiverHistoryElement" style={{backgroundColor: risk.occurred ? "lightcoral" : "forestgreen"}} >
                                            <Typography variant="body1" gutterBottom fontWeight="bold" color="white" textAlign="center">
                                                {risk.occurred ? <ThunderstormIcon style={{marginTop: "10px"}}/> : <LightModeIcon style={{marginTop: "10px"}} /> }
                                            </Typography>
                                        </div>
                                    </Tooltip>))
                                : <CircularProgress />
                            }
                        </Box>
                    :   <Typography marginLeft="10px" style={{cursor: "pointer"}} marginBottom="10px">
                            {`Keine Daten vorhanden`}
                        </Typography>
            }

        </>
    )
}
