import {Risk} from "../../models/Risk";
import React, {useEffect} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, Chip, Typography,} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {updateMyRisk} from "../../store/slices/my-risks/thunks";
import {addRisk, deleteRisk} from "../../store/slices/risks/thunks";
import {AppDispatch} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import IconButton from "@mui/material/IconButton";
import UndoIcon from "@mui/icons-material/Undo";
import SendIcon from "@mui/icons-material/Send";
import {UserProfile} from "../../store/slices/user-profile/types";
import {selectUserProfile} from "../../store/slices/user-profile/selectors";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import {ROUTES} from "../../routing/routes";
import {useNavigate} from "react-router-dom";
import {setActiveChatByRiskId} from "../../store/slices/my-bids/reducers";
import Tooltip from "@mui/material/Tooltip";
import ToolTip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {deleteChatsByRiskId} from "../../store/slices/my-bids/thunks";
import {mapStatus, mapStatusChipColor, mapStatusIcon, mapStatusToolTip,} from "./utils";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import {MyRiskRowDetails} from "./my-risk-row-details/my-risk-row-details";
import {MyRiskEditDialog} from "./edit-dialog/my-risk-edit-dialog";
import {MyRiskDeletionDialog} from "./deletion-dialog/deletion-dialog";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import {CancelDealDialog} from "./my-risk-row-details/deals-details/cancel-deal-dialog";
import {Chat} from "../../store/slices/my-bids/types";
import {selectChatByRiskId} from "../../store/slices/my-bids/selectors";
import {t} from "i18next";
import {Trans} from "react-i18next";
import {HandleDamageDialog} from "./my-risk-row-details/agreement-details/handle-damage-dialog";

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
    const [openCancelDealDialog, setOpenCancelDealDialog] = React.useState(false);
    const [openHandleDamageDialog, setOpenHandleDamageDialog] = React.useState(false);
    const riskRelatedChat: Chat | undefined = useSelector(
        selectChatByRiskId(props.risk.id)
    );

    useEffect(() => {
        if (noAddressError) {
            showSnackbar(
                "Adresse fehlt!",
                "Bitte vervollständige deine Adresse in deinem Profil, um ein Risiko zu veröffentlichen.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "warning"
            );
            setNoAddressError(false);
            return;
        }

        if (noPhoneError) {
            showSnackbar(
                "Telefonnummer fehlt!",
                "Bitte vervollständigen deine Telefonnummer in deinem Profil, um ein Risiko zu veröffentlichen.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "warning"
            );
            setNoPhoneError(false);
            return;
        }

        if (noImageError) {
            showSnackbar(
                "Profilbild fehlt!",
                "Bitte lade ein Profilbild in deinem Profil hoch, um ein Risiko zu veröffentlichen.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "warning"
            );
            setNoImageError(false);
            return;
        }
    }, [noAddressError, noPhoneError, noImageError]);

    const handlePublish = (e: any): void => {
        e.stopPropagation();
        e.preventDefault();

        if (!user || !user.id) {
            console.error("User not authenticated or UID missing:", user);
            showSnackbar(
                "Nutzer Id unbekannt!",
                "Risiko kann nicht veröffentlicht werden. Melde dich ab- und wieder an.",
                {
                    vertical: "top",
                    horizontal: "center",
                },
                "error"
            );
            return;
        }

        if (
            !user.profile.street ||
            !user.profile.number ||
            !user.profile.zip ||
            !user.profile.city
        ) {
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
                    description:
                        user.profile.aboutMe ||
                        "- Nutzer hat noch keine Beschreibung hinzugefügt -",
                    email: user.profile.email,
                    phoneNumber: user.profile.phone,
                },
                status: RiskStatusEnum.PUBLISHED,
                publishedAt: new Date().toISOString(),
            };

            dispatch(updateMyRisk(riskToPublish));
            dispatch(addRisk(riskToPublish));
        }
    };

    const handleWithdraw = (e: any): void => {
        e.stopPropagation();
        e.preventDefault();

        if (
            props.risk.status === RiskStatusEnum.PUBLISHED ||
            props.risk.status === RiskStatusEnum.DEAL
        ) {
            const riskToWithdraw: Risk = {
                ...props.risk,
                status: RiskStatusEnum.WITHDRAWN,
                withdrawnAt: new Date().toISOString(),
            };

            dispatch(deleteChatsByRiskId(riskToWithdraw.id));
            dispatch(updateMyRisk(riskToWithdraw));
            dispatch(deleteRisk(riskToWithdraw.id));
        }
    };

    const handleDeal = (risk: Risk): void => {
        navigate(`/${ROUTES.CHAT}`);
        dispatch(setActiveChatByRiskId(risk.id));
    };

    const handleReportDamage = (e: any, risk: Risk): void => {
        e.stopPropagation();
        setOpenHandleDamageDialog(true);
    };

    const handleDelete = (e: any): void => {
        e.stopPropagation();
        e.preventDefault();
        setOpenDeletionDialog(true);
    };

    const cancelDeal = (e: any) => {
        e.stopPropagation();
        setOpenCancelDealDialog(true);
    };

    const deletionIsDisabled =
        props.risk.status === RiskStatusEnum.PUBLISHED ||
        props.risk.status === RiskStatusEnum.AGREEMENT ||
        props.risk.status === RiskStatusEnum.DEAL;

    return (
        <>
            <Accordion
                TransitionProps={{style: {transformOrigin: "top"}}}
                expanded={expanded}
                onChange={(event, isExpanded) => setExpanded(isExpanded)}
                elevation={0}
                sx={{
                    width: "95%",
                    boxSizing: "border-box",
                    border: "1px solid",
                    borderColor: "grey.200",
                    paddingRight: "20px",
                    "&:before": {display: "none"}, // Verhindert den doppelten Border-Effekt
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    sx={{
                        minHeight: 0,
                        marginRight: "5%",
                        width: "100%",
                        padding: 0,
                        "& .MuiAccordionSummary-content": {margin: 0},
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            marginRight: "5%",
                            width: "100%",
                            cursor: "pointer",
                            boxSizing: "border-box",
                            padding: "30px 40px",
                        }}
                    >
                        <Grid container>
                            <Grid size={{xs: 3, lg: 2, xl: 1}}>
                                <Tooltip
                                    title={mapStatusToolTip(t, props.risk.status)}
                                    followCursor
                                    sx={{cursor: "pointer"}}
                                >
                                    <Chip
                                        icon={mapStatusIcon(props.risk.status)}
                                        label={mapStatus(t, props.risk.status)}
                                        variant="filled"
                                        color={mapStatusChipColor(props.risk.status)}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid size={{xs: 3, lg: 2, xl: 2}} textAlign="center">
                                <Typography variant="body1" fontWeight="bolder">
                                    {props.risk.name}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 0, lg: 0, xl: 2}}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        marginRight: "5px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {props.risk.description}
                                </Typography>
                            </Grid>
                            <Grid
                                size={{xs: 0, lg: 4, xl: 3}}
                                textAlign="center"
                                sx={{display: {xs: "none", lg: "block", xl: "block"}}}
                            >
                                {props.risk.type.map((element, idx) => (
                                    <Chip
                                        key={idx}
                                        label={element}
                                        clickable
                                        sx={{
                                            backgroundColor: "#f3f3f3",
                                            color: "#343434",
                                            marginRight: "4px",
                                            border: "1px solid",
                                            borderColor: "#d7d7d7",
                                        }}
                                    />
                                ))}
                            </Grid>
                            <Grid
                                size={{xs: 0, lg: 0, xl: 1}}
                                textAlign="left"
                                sx={{display: {xs: "none", lg: "none", xl: "block"}}}
                            >
                                <Typography variant="body1">
                                    {props.risk.value.toLocaleString()},00 €
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 6, lg: 4, xl: 3}}>
                                {props.taken && (
                                    <Box display="flex" justifyContent="flex-end" gap="5px">
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleDeal(props.risk)}
                                            size="small"
                                            endIcon={
                                                props.risk.status === RiskStatusEnum.AGREEMENT ? (
                                                    <InterpreterModeIcon/>
                                                ) : (
                                                    <SignLanguageIcon/>
                                                )
                                            }
                                        >
                                            {props.risk.status === RiskStatusEnum.AGREEMENT ? (
                                                <Trans i18nKey="my_risks.contact"/>
                                            ) : (
                                                <Trans i18nKey="my_risks.negotiate"/>
                                            )}
                                        </Button>
                                        <ToolTip
                                            title={t("my_risks.cancel_negotiation")}
                                            followCursor
                                        >
                                            <IconButton
                                                onClick={(e) => cancelDeal(e)}
                                                disabled={props.risk.status === RiskStatusEnum.AGREEMENT}
                                            >
                                                <NotInterestedIcon/>
                                            </IconButton>
                                        </ToolTip>
                                    </Box>
                                )}
                                {!props.taken && (
                                    <Box display="flex" justifyContent="flex-end">
                                        {props.risk.status === RiskStatusEnum.WITHDRAWN ||
                                        props.risk.status === RiskStatusEnum.DRAFT ? (
                                            <Button
                                                color="success"
                                                variant="contained"
                                                onClick={(e) => handlePublish(e)}
                                                size="small"
                                                startIcon={<SendIcon/>}
                                            >
                                                <Trans i18nKey="my_risks.publish"/>
                                            </Button>
                                        ) : (
                                            props.risk.status !== RiskStatusEnum.DEAL &&
                                            props.risk.status !== RiskStatusEnum.AGREEMENT && (
                                                <Button
                                                    color="warning"
                                                    variant="contained"
                                                    onClick={(e) => handleWithdraw(e)}
                                                    size="small"
                                                    startIcon={<UndoIcon/>}
                                                >
                                                    <Trans i18nKey="my_risks.withdraw"/>
                                                </Button>
                                            )
                                        )}
                                        {props.risk.status === RiskStatusEnum.AGREEMENT && (
                                            <Button
                                                onClick={() => handleDeal(props.risk)}
                                                variant="outlined"
                                                size="small"
                                                startIcon={<InterpreterModeIcon/>}
                                                sx={{marginLeft: "10px"}}
                                            >
                                                <Trans i18nKey="my_risks.contact"/>
                                            </Button>
                                        )}

                                        {props.risk.status !== RiskStatusEnum.AGREEMENT ? (
                                            <Button
                                                variant="outlined"
                                                disabled={
                                                    props.risk.status !== RiskStatusEnum.DRAFT &&
                                                    props.risk.status !== RiskStatusEnum.WITHDRAWN
                                                }
                                                onClick={() => setOpenRiskEditDialog(true)}
                                                size="small"
                                                startIcon={<EditIcon/>}
                                                sx={{marginLeft: "10px"}}
                                            >
                                                <Trans i18nKey="my_risks.edit"/>
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled={props.risk.occurred}
                                                style={{marginLeft: "5px"}}
                                                variant="outlined"
                                                onClick={(e) => handleReportDamage(e, props.risk)}
                                                startIcon={<FeedbackIcon/>}
                                                color="error">
                                                <Trans i18nKey={props.risk.occurred ?  "my_risks.claim_reported" : "my_risks.claim_report"}/>
                                            </Button>
                                        )}

                                        <IconButton
                                            size="small"
                                            disabled={deletionIsDisabled}
                                            onClick={(e) => handleDelete(e)}
                                            sx={{marginLeft: "10px"}}
                                        >
                                            <DeleteIcon
                                                color={deletionIsDisabled ? "disabled" : "warning"}
                                            />
                                        </IconButton>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Card>
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0, borderTop: "none"}}>
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
                    risk={props.risk}
                />
                {riskRelatedChat && (
                    <CancelDealDialog
                        open={openCancelDealDialog}
                        setOpen={setOpenCancelDealDialog}
                        chat={riskRelatedChat}
                    />
                )}
            </Accordion>
            <HandleDamageDialog
                open={openHandleDamageDialog}
                setOpen={setOpenHandleDamageDialog}
                risk={props.risk}
            />
        </>
    );
};
