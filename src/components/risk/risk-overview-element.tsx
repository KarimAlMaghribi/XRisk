import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {Risk} from "../../models/Risk";
import {FetchStatus} from "../../types/FetchStatus";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ModeIcon from '@mui/icons-material/Mode';

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
                                    <Typography variant="body1" sx={{ cursor: 'pointer'}}>
                                        <b>{risk.type}</b>
                                    </Typography>
                                </Grid>
                                <Grid size={3} sx={{marginLeft: "20px"}}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                                        <b>{risk.value.toLocaleString()}€</b>
                                    </Typography>
                                </Grid>
                                <Grid size={2}>
                                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                                        <b>{new Date(risk.declinationDate).toLocaleDateString()}</b>
                                    </Typography>
                                </Grid>
                                <Grid display="flex" justifyContent="center" alignItems="center" size={1}>
                                    {/* src wird durch eine Service funktion ersetzt, die das Bild des nutzers aus der
                                    Nutzerdatenbank lädt */}
                                    <Tooltip title={risk.publisher && risk.publisher.name}>
                                        <Avatar src={`https://i.pravatar.cc/150?img=${risk.id}`}/>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid size={8}>
                                    <Typography>
                                        <b>Kurzbeschreibung: </b>{risk.description}
                                    </Typography>
                                    {
                                        risk.createdAt &&
                                        <Grid container>
                                            <Grid size={6}>
                                                <Typography>
                                                    <b>Verfügbar seit: </b> {new Date(risk.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid>
                                                <Typography>
                                                    <b>Verfügbar bis: </b> {new Date(risk.declinationDate).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                    <Typography>
                                        <b>Anbieter: </b> {risk.publisher && risk.publisher.name}
                                    </Typography>
                                    <Typography>
                                        <b>Wohnort: </b> {risk.publisher && risk.publisher.address}
                                    </Typography>
                                </Grid>
                                <Grid size={4} style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: "20px" }}>
                                    <Button variant="contained" endIcon={<ModeIcon />} style={{maxHeight: "40px", height: "40px"}}>
                                        Jetzt verhandeln
                                    </Button>
                                </Grid>
                            </Grid>

                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </React.Fragment>
    );
};
