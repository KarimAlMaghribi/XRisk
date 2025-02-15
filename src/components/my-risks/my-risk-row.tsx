import {Risk} from "../../models/Risk";
import React, {useEffect} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, Chip, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {MyRiskEditDialog} from "./edit-dialog/my-risk-edit-dialog";
import Button from "@mui/material/Button";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {updateMyRisk} from "../../store/slices/my-risks/thunks";
import {addRisk, deleteRisk} from "../../store/slices/risks/thunks";
import {AppDispatch} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import {formatDate} from "../../utils/dateFormatter";
import IconButton from "@mui/material/IconButton";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DraftsIcon from '@mui/icons-material/Drafts';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import UndoIcon from "@mui/icons-material/Undo";
import SendIcon from "@mui/icons-material/Send";
import {UserProfile} from "../../store/slices/user-profile/types";
import {selectUserProfile} from "../../store/slices/user-profile/selectors";
import {MyRiskDeletionDialog} from "./deletion-dialog/deletion-dialog";
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import {ROUTES} from "../../routing/routes";
import {useNavigate} from "react-router-dom";
import {setActiveChatByRiskId} from "../../store/slices/my-bids/reducers";
import {RiskStatus} from "../../types/RiskStatus";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MyRiskRowDetails } from "./my-risk-row-details";
import {deleteChatsByRiskId} from "../../store/slices/my-bids/thunks";

export interface MyRiskRowProps {
    risk: Risk;
    onEdit?: (risk: Risk) => void;
    onDelete?: (risk: Risk) => void;
    taken?: boolean;
}

export const MyRiskRow = (props: MyRiskRowProps) => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbarContext();
    const user: UserProfile = useSelector(selectUserProfile);
    const [openRiskEditDialog, setOpenRiskEditDialog] = React.useState(false);
    const [noAddressError, setNoAddressError] = React.useState(false);
    const [noPhoneError, setNoPhoneError] = React.useState(false);
    const [noImageError, setNoImageError] = React.useState(false);
    const [openDeletionDialog, setOpenDeletionDialog] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        if (noAddressError) {
            showSnackbar("Adresse fehlt!", "Bitte vervollständige deine Adresse in deinem Profil, um ein Risiko zu veröffentlichen.", {vertical: "top", horizontal: "center"}, "warning");
            setNoAddressError(false);
            return;
        }

        if (noPhoneError) {
            showSnackbar("Telefonnummer fehlt!", "Bitte vervollständigen deine Telefonnummer in deinem Profil, um ein Risiko zu veröffentlichen.", {vertical: "top", horizontal: "center"}, "warning");
            setNoPhoneError(false);
            return;
        }

        if (noImageError) {
            showSnackbar("Profilbild fehlt!", "Bitte lade ein Profilbild in deinem Profil hoch, um ein Risiko zu veröffentlichen.", {vertical: "top", horizontal: "center"}, "warning");
            setNoImageError(false);
            return;
        }

    }, [noAddressError, noPhoneError, noImageError]);

    const handlePublish = (e: any): void => {
        e.stopPropagation();
        e.preventDefault();

        if (!user || !user.id) {
            console.error("User not authenticated or UID missing:", user);
            showSnackbar("Nutzer Id unbekannt!", "Risiko kann nicht veröffentlicht werden. Melde dich ab- und wieder an.", {vertical: "top", horizontal: "center"}, "error");
            return;
        }

        if (!user.profile.street || !user.profile.number || !user.profile.zip || !user.profile.city) {
            setNoAddressError(true);
            return;
        }

        if (!user.profile.phone) {
            setNoPhoneError(true);
            return;
        }

        if (!user.profile.imagePath) {
            setNoImageError(true);
            return;
        }

        if (props.risk.status !== RiskStatusEnum.PUBLISHED) {
            const riskToPublish: Risk = {
                ...props.risk,
                publisher: {
                    name: user.profile.name,
                    imagePath: user.profile.imagePath || "",
                    uid: user.id,
                    address: `${user.profile.street} ${user.profile.number}, ${user.profile.zip} ${user.profile.city}`,
                    description: user.profile.aboutMe || "- Nutzer hat noch keine Beschreibung hinzugefügt -",
                    email: user.profile.email,
                    phoneNumber: user.profile.phone
                },
                status: RiskStatusEnum.PUBLISHED,
                publishedAt: new Date().toISOString()
            }

            dispatch(updateMyRisk(riskToPublish))
            dispatch(addRisk(riskToPublish))
        }
    }

    const handleWithdraw = (e: any): void => {
        e.stopPropagation();
        e.preventDefault();

        if (props.risk.status === RiskStatusEnum.PUBLISHED || props.risk.status === RiskStatusEnum.DEAL) {
            const riskToWithdraw: Risk = {
                ...props.risk,
                status: RiskStatusEnum.WITHDRAWN,
                withdrawnAt: new Date().toISOString()
            }

            dispatch(deleteChatsByRiskId(riskToWithdraw.id));
            dispatch(updateMyRisk(riskToWithdraw));
            dispatch(deleteRisk(riskToWithdraw.id));
        }
    }

    const handleDeal = (risk: Risk): void => {
        navigate(`/${ROUTES.CHAT}`);
        dispatch(setActiveChatByRiskId(risk.id));
    }

    const mapStatus = (status: RiskStatusEnum | undefined) => {
        if (!status) return ("Unbekannter Status");

        switch(status) {
            case RiskStatusEnum.DRAFT:
                return "Entwurf";
            case RiskStatusEnum.PUBLISHED:
                return "Veröffentlicht";
            case RiskStatusEnum.AGREEMENT:
                return "Geeignigt";
            case RiskStatusEnum.DEAL:
                return "In Verhandlung";
            case RiskStatusEnum.WITHDRAWN:
                return "Zurückgezogen";
        }
    }

    const mapStatusIcon = (status: RiskStatusEnum | undefined) => {
        if (!status) return <QuestionMarkIcon />;

        switch(status) {
            case RiskStatusEnum.DRAFT:
                return <DraftsIcon />;
            case RiskStatusEnum.PUBLISHED:
                return <GroupsIcon />;
            case RiskStatusEnum.AGREEMENT:
                return <HandshakeIcon />;
            case RiskStatusEnum.DEAL:
                return <SportsKabaddiIcon />;
            case RiskStatusEnum.WITHDRAWN:
                return <UndoIcon />;
        }
    }

    const mapStatusChipColor = (status: RiskStatus | undefined) => {
        switch(status) {
            case RiskStatusEnum.DRAFT:
                return "info";
            case RiskStatusEnum.PUBLISHED:
                return "success";
            case RiskStatusEnum.AGREEMENT:
                return "success";
            case RiskStatusEnum.DEAL:
                return "error";
            case RiskStatusEnum.WITHDRAWN:
                return "warning";
            default:
                return "primary";
        }
    }

    const mapStatusToolTip = (status: RiskStatus | undefined) => {
        switch(status) {
            case RiskStatusEnum.DRAFT:
                return "Entwurf: Vor dir erstellt, von anderen noch nicht einsehbar.";
            case RiskStatusEnum.PUBLISHED:
                return "Veröffentlicht: Von dir zur an der Börse zur Verhandlung freigegeben.";
            case RiskStatusEnum.AGREEMENT:
                return "Geeinigt: Von dir und deinem Verhandlungspartner zu übereinstimmenden Konditionen gelangt."
            case RiskStatusEnum.DEAL:
                return "In Verhandlung: Du verhandelst um die Konditionen mit deinem Vertragspartner.";
            case RiskStatusEnum.WITHDRAWN:
                return "Zurückgezogen: Von dir veröffentlichtes Risiko wieder zurückgezogen";
            default:
                return "Unbekannter Status";
        }
    }

    return (
        <Accordion
            TransitionProps={{ style: { transformOrigin: "top" } }}
            expanded={expanded}
            onChange={(event, isExpanded) => setExpanded(isExpanded)}
            elevation={0}
            sx={{
                width: "95%",
                boxSizing: "border-box",
                border: "1px solid",
                borderColor: "grey.200",
                paddingRight: "20px",
                "&:before": { display: "none" }, // Verhindert den doppelten Border-Effekt
            }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    minHeight: 0,
                    marginRight: "5%",
                    width: "100%",
                    padding: 0,
                    "& .MuiAccordionSummary-content": { margin: 0}
                }}>
                <Card
                    elevation={0}
                    sx={{
                        marginRight: "5%",
                        width: "100%",
                        cursor: "pointer",
                        boxSizing: "border-box",
                        padding: "30px 40px",
                    }}>
                    <Grid container>
                        <Grid size={1}>
                            <Tooltip title={mapStatusToolTip(props.risk.status)} followCursor sx={{ cursor: "pointer"}}>
                                <Chip
                                    icon={mapStatusIcon(props.risk.status)}
                                    label={mapStatus(props.risk.status)}
                                    variant="filled"
                                    color={mapStatusChipColor(props.risk.status)}/>
                            </Tooltip>
                        </Grid>
                        <Grid size={1} textAlign="center">
                            <Typography variant="body1" fontWeight="bolder">
                                {props.risk.name}
                            </Typography>
                        </Grid>
                        <Grid size={4}>
                            <Typography
                                variant="body1"
                                sx={{
                                    marginRight: "5px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                {props.risk.description}
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="center">
                            {
                                props.risk.type.map((element, idx) => (
                                    <Chip key={idx} label={element} clickable sx={{
                                        backgroundColor: '#f3f3f3',
                                        color: '#343434',
                                        marginRight: '4px',
                                        border: '1px solid',
                                        borderColor: "#d7d7d7",
                                    }}/>
                                ))
                            }
                        </Grid>
                        <Grid size={1} textAlign="center">
                            <Typography variant="body1">
                                {`${props.risk.value.toLocaleString()},00 €`}
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="center">
                            <Typography variant="body1">
                                {formatDate(new Date(props.risk.declinationDate))}
                            </Typography>
                        </Grid>
                        <Grid size={3}>
                            {
                                props.taken &&
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="outlined" onClick={() => handleDeal(props.risk)} size="small" endIcon={<SignLanguageIcon />}>
                                        Verhandeln
                                    </Button>
                                </Box>
                            }
                            {
                                !props.taken &&
                                <Box display="flex" justifyContent="flex-end">
                                    {
                                        (props.risk.status === RiskStatusEnum.WITHDRAWN || props.risk.status === RiskStatusEnum.DRAFT) ? (
                                            <Button
                                                color="success"
                                                variant="contained"
                                                onClick={(e) => handlePublish(e)}
                                                size="small"
                                                startIcon={<SendIcon />}>
                                                Veröffentlichen
                                            </Button>
                                        ) : props.risk.status === RiskStatusEnum.DEAL ? (
                                            <Button
                                                color="warning"
                                                variant="contained"
                                                onClick={(e) => handleWithdraw(e)}
                                                size="small"
                                                startIcon={<UndoIcon />}>
                                                Verhandlung beenden
                                            </Button>
                                        ) : (
                                            <Button
                                                color="warning"
                                                variant="contained"
                                                onClick={(e) => handleWithdraw(e)}
                                                size="small"
                                                startIcon={<UndoIcon />}>
                                                Zurückziehen
                                            </Button>
                                        )
                                    }

                                    <Button
                                        variant="outlined"
                                        disabled={props.risk.status !== RiskStatusEnum.DRAFT && props.risk.status !== RiskStatusEnum.WITHDRAWN}
                                        onClick={() => setOpenRiskEditDialog(true)}
                                        size="small"
                                        startIcon={<EditIcon/>}
                                        sx={{marginLeft: "10px"}}>
                                        Bearbeiten
                                    </Button>
                                    <IconButton
                                        size="small"
                                        disabled={props.risk.status === RiskStatusEnum.PUBLISHED || props.risk.status === RiskStatusEnum.AGREEMENT || props.risk.status === RiskStatusEnum.DEAL}
                                        onClick={() => setOpenDeletionDialog(true)}
                                        sx={{marginLeft: "10px"}}>
                                        <DeleteIcon color="warning"/>
                                    </IconButton>
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </Card>

            </AccordionSummary>
            <AccordionDetails sx={{padding: 0, borderTop: "none",}}>
                <MyRiskRowDetails risk={props.risk}/>
            </AccordionDetails>
            <MyRiskEditDialog
                open={openRiskEditDialog}
                setOpen={setOpenRiskEditDialog}
                risk={props.risk}
            />
            <MyRiskDeletionDialog
                open={openDeletionDialog}
                setOpen={setOpenDeletionDialog}
                risk={props.risk} />
        </Accordion>
    )
}
