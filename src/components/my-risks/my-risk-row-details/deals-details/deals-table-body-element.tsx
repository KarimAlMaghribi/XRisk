import {Chat} from "../../../../store/slices/my-bids/types";
import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Grid from "@mui/material/Grid2";
import {elementBottomMargin} from "../../../risk/risk-overview-element";
import Button from "@mui/material/Button";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import {ROUTES} from "../../../../routing/routes";
import {setActiveChatByRiskId} from "../../../../store/slices/my-bids/reducers";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../../store/store";
import {useDispatch} from "react-redux";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {CancelDealDialog} from "./cancel-deal-dialog";

export interface DealsTableBodyProps {
    chat: Chat;
    index: number;
}

export const DealsTableBodyElement = (props: DealsTableBodyProps) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [expanded, setExpanded] = React.useState(false);
    const [openCancelDealDialog, setOpenCancelDealDialog] = React.useState(false);

    const handleAbort = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        setOpenCancelDealDialog(true);
    }

    const handleDeal = (riskId: string): void => {
        navigate(`/${ROUTES.CHAT}`);
        dispatch(setActiveChatByRiskId(riskId));
    }

    return (
        <>
            <Accordion elevation={0} expanded={expanded} onChange={(event, isExpanded) => setExpanded(isExpanded)}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon/>}
                    sx={{
                        minHeight: 0,
                        padding: 0,
                        "& .MuiAccordionSummary-content": {
                            margin: 0,
                            flexGrow: 1,
                            minWidth: 0,
                            display: "flex",
                            alignItems: "center"
                        }
                    }}>
                    <Grid container sx={{width: "100%", minWidth: 0}}>
                        <Grid size={1}>
                            <Typography variant="body2"
                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                                {props.index + 1}
                            </Typography>
                        </Grid>
                        <Grid size={1}>
                            <Typography variant="body2"
                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                                {props.chat.riskTaker?.name}
                            </Typography>
                        </Grid>
                        <Grid size={2}>
                            <Typography variant="body2"
                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                                {props.chat.topic}
                            </Typography>
                        </Grid>
                        <Grid size={4}>
                            <Typography variant="body2"
                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                                {props.chat.lastMessage}
                            </Typography>
                        </Grid>
                        <Grid size={1}>
                            <Typography variant="body2"
                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                                {new Date(props.chat.created).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid size={1}>
                            <Typography variant="body2"
                                        sx={{color: "grey", marginBottom: `${elementBottomMargin}px`, paddingTop: "20px"}}>
                                {new Date(props.chat.lastActivity).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid size={1} sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            paddingTop: "10px"
                        }}>
                            <Button startIcon={<SignLanguageIcon/>} variant="outlined"
                                    onClick={() => handleDeal(props.chat.riskId)}>
                                Verhandeln
                            </Button>
                        </Grid>
                        <Grid size={1} sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            paddingTop: "10px"
                        }}>
                            <Tooltip title="Verhandlung abbrechen" followCursor>
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleAbort(e)}
                                    sx={{marginLeft: "10px"}}>
                                    <NotInterestedIcon color="primary"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" sx={{color: "grey", fontWeight: "bold"}}>
                        Einigungsdetails
                    </Typography>

                    {/* Tabelle */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, maxWidth: "100%" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f0f0f0" }}> {/* Kopfzeile farblich abheben */}
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Wert</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Versicherungssumme</TableCell>
                                    <TableCell>{props.chat.riskTaker?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Kosten</TableCell>
                                    <TableCell>{props.chat.topic}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Zeitspanne</TableCell>
                                    <TableCell>{new Date(props.chat.created).toLocaleDateString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Beweismittel</TableCell>
                                    <TableCell>{new Date(props.chat.lastActivity).toLocaleDateString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Weitere Details</TableCell>
                                    <TableCell>{props.chat.status ?? "Unbekannt"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            <CancelDealDialog
                open={openCancelDealDialog}
                setOpen={setOpenCancelDealDialog}
                chat={props.chat}/>
        </>
    )
}
