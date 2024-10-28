import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {Risk} from "../../models/Risk";
import {FetchStatus} from "../../types/FetchStatus";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

export interface RiskOverviewElementProps {
    risks: Risk[];
    status: FetchStatus;
}

export const RiskOverviewElement = (props: RiskOverviewElementProps) => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <React.Fragment>
            {
                props.risks && props.risks.map((risk: Risk) => (
                    <Accordion
                        key={risk.id}
                        expanded={expanded === risk.id}
                        onChange={handleChange(risk.id)}
                        sx={{ marginBottom: 2, width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id={`panel-header-${risk.id}`}>
                            <Grid container size={12} spacing={2} alignItems="center">
                                <Grid size={5}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                                        {risk.type}
                                    </Typography>
                                </Grid>
                                <Grid size={3} sx={{marginLeft: "20px"}}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                                        {risk.value.toLocaleString()}€
                                    </Typography>
                                </Grid>
                                <Grid size={2}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                                        {new Date(risk.declinationDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid display="flex" justifyContent="center" alignItems="center" size={1}>
                                    {/* src wird durch eine Service funktion ersetzt, die das Bild des nutzers aus der
                                    Nutzerdatenbank lädt */}
                                    <Tooltip title={risk.publisher}>
                                        <Avatar src={`https://i.pravatar.cc/150?img=${risk.id}`}/>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Weitere Informationen...
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </React.Fragment>
    );
};
