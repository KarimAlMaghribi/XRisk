import { Risk } from "../../models/Risk";
import React, { useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Chip, Typography, } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateMyRisk } from "../../store/slices/my-risks/thunks";
import { addRisk, deleteRisk } from "../../store/slices/risks/thunks";
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbarContext } from "../snackbar/custom-snackbar";
import IconButton from "@mui/material/IconButton";
import UndoIcon from "@mui/icons-material/Undo";
import SendIcon from "@mui/icons-material/Send";
import { UserProfile } from "../../store/slices/user-profile/types";
import { selectUserProfile } from "../../store/slices/user-profile/selectors";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import { ROUTES } from "../../routing/routes";
import { useNavigate } from "react-router-dom";
import { setActiveChatByRiskId } from "../../store/slices/my-bids/reducers";
import Tooltip from "@mui/material/Tooltip";
import ToolTip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { deleteChatsByRiskId } from "../../store/slices/my-bids/thunks";
import { mapStatus, mapStatusChipColor, mapStatusIcon, mapStatusToolTip, } from "./utils";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import { MyRiskRowDetails } from "./my-risk-row-details/my-risk-row-details";
import { MyRiskEditDialog } from "./edit-dialog/my-risk-edit-dialog";
import { MyRiskDeletionDialog } from "./deletion-dialog/deletion-dialog";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { CancelDealDialog } from "./my-risk-row-details/deals-details/cancel-deal-dialog";
import { Chat } from "../../store/slices/my-bids/types";
import { selectChatByRiskId } from "../../store/slices/my-bids/selectors";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { HandleDamageDialog } from "./my-risk-row-details/agreement-details/handle-damage-dialog";
import { STYLES } from "./risk-row-styles";

export interface MyRiskRowProps {
    risk: Risk;
    onEdit?: (risk: Risk) => void;
    onDelete?: (risk: Risk) => void;
    taken?: boolean;
}

export const MyRiskRow = (props: MyRiskRowProps) => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarContext();
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
                { vertical: "top", horizontal: "center" },
                "warning"
            );
            setNoAddressError(false);
            return;
        }

        if (noPhoneError) {
            showSnackbar(
                "Telefonnummer fehlt!",
                "Bitte vervollständigen deine Telefonnummer in deinem Profil, um ein Risiko zu veröffentlichen.",
                { vertical: "top", horizontal: "center" },
                "warning"
            );
            setNoPhoneError(false);
            return;
        }

        if (noImageError) {
            showSnackbar(
                "Profilbild fehlt!",
                "Bitte lade ein Profilbild in deinem Profil hoch, um ein Risiko zu veröffentlichen.",
                { vertical: "top", horizontal: "center" },
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
                { vertical: "top", horizontal: "center" },
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

    const truncateText = (text: string) => {
        const maxLength = text.length < 36 ? text.length - 4 : 35;
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
    };

    return (
        <>
            <Accordion
                TransitionProps={{ style: { transformOrigin: "top" } }}
                expanded={expanded}
                onChange={(event, isExpanded) => setExpanded(isExpanded)}
                elevation={0}
                sx={STYLES.ACCORDION_SX}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={STYLES.ACCORDION_SUMMARY_SX}>
                    <Card elevation={0} sx={STYLES.CARD_SX}>
                        <Grid container>
                            <Grid size={{ xs: 3, lg: 2, xl: 1 }}>
                                <Tooltip title={mapStatusToolTip(t, props.risk.status)} followCursor sx={STYLES.STATUS_TOOLTIP_SX}>
                                    <Chip
                                        icon={mapStatusIcon(props.risk.status)}
                                        label={mapStatus(t, props.risk.status)}
                                        variant="filled"
                                        color={mapStatusChipColor(props.risk.status)}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid size={{ xs: 3, lg: 2, xl: 2 }} textAlign="center">
                                <Typography variant="body1" fontWeight="bolder">
                                    {props.risk.name}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 0, lg: 0, xl: 2 }}>
                                <Typography variant="body1" sx={STYLES.RISK_DESCRIPTION_TYPOGRAPHY_SX}>
                                    {truncateText(props.risk.description)} {/* Maximale Länge von 50 Zeichen */}
                                </Typography>

                            </Grid>
                            <Grid size={{ xs: 0, lg: 4, xl: 3 }} textAlign="center" sx={STYLES.GRID_CHIP_SX}>
                                {props.risk.type.map((element, idx) => (
                                    <Chip key={idx} label={element} clickable sx={STYLES.TYPE_CHIP_SX}/>
                                ))}
                            </Grid>
                            <Grid size={{ xs: 0, lg: 0, xl: 1 }} textAlign="left" sx={STYLES.GRID_SIZE_VALUE_SX}>
                                <Typography variant="body1">
                                    {props.risk.value.toLocaleString()},00 €
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, lg: 4, xl: 3 }}>
                                {props.taken && (
                                    <Box display="flex" justifyContent="flex-end" gap="5px">
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleDeal(props.risk)}
                                            size="small"
                                            endIcon={props.risk.status === RiskStatusEnum.AGREEMENT ? (<InterpreterModeIcon />) : (<SignLanguageIcon />)}
                                            sx={STYLES.CONTACT_BUTTON_SX}>
                                            {props.risk.status === RiskStatusEnum.AGREEMENT ? (<Trans i18nKey="my_risks.contact" />) : (<Trans i18nKey="my_risks.negotiate" />)}
                                        </Button>
                                        <ToolTip title={t("my_risks.cancel_negotiation")} followCursor>
                                            <IconButton
                                                onClick={(e) => cancelDeal(e)}
                                                disabled={props.risk.status === RiskStatusEnum.AGREEMENT}
                                                sx={STYLES.ICON_BUTTON_SX}>
                                                <NotInterestedIcon />
                                            </IconButton>
                                        </ToolTip>
                                    </Box>
                                )}
                                {!props.taken && (
                                    <Box display="flex" justifyContent="flex-end">
                                        {props.risk.status === RiskStatusEnum.WITHDRAWN ||
                                        props.risk.status === RiskStatusEnum.DRAFT ? (
                                            <Button color="success" variant="contained" onClick={(e) => handlePublish(e)} size="small" startIcon={<SendIcon />}>
                                                <Trans i18nKey="my_risks.publish" />
                                            </Button>
                                        ) : (
                                            props.risk.status !== RiskStatusEnum.DEAL &&
                                            props.risk.status !== RiskStatusEnum.AGREEMENT && (
                                                <Button color="warning" variant="contained" onClick={(e) => handleWithdraw(e)} size="small" startIcon={<UndoIcon />}>
                                                    <Trans i18nKey="my_risks.withdraw" />
                                                </Button>
                                            )
                                        )}

                                        {props.risk.status === RiskStatusEnum.AGREEMENT && (
                                            <Button onClick={() => handleDeal(props.risk)} variant="outlined" size="small" startIcon={<InterpreterModeIcon />} sx={STYLES.CONTACT_BUTTON_SX}>
                                                <Trans i18nKey="my_risks.contact" />
                                            </Button>
                                        )}

                                        {
                                            props.risk.status !== RiskStatusEnum.AGREEMENT
                                                ?   (
                                                        <Button
                                                            variant="outlined"
                                                            disabled={props.risk.status !== RiskStatusEnum.DRAFT && props.risk.status !== RiskStatusEnum.WITHDRAWN}
                                                            onClick={() => setOpenRiskEditDialog(true)}
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            sx={STYLES.EDIT_BUTTON_SX}>
                                                            <Trans i18nKey="my_risks.edit" />
                                                        </Button>
                                                    )
                                                :   (
                                                        <Button
                                                            disabled={props.risk.occurred}
                                                            variant="outlined"
                                                            onClick={(e) => handleReportDamage(e, props.risk)}
                                                            startIcon={<FeedbackIcon />}
                                                            color="error"
                                                            sx={STYLES.CANCEL_REPORT_BUTTON_SX}>
                                                            <Trans i18nKey={props.risk.occurred ? "my_risks.claim_reported" : "my_risks.claim_report"}/>
                                                        </Button>
                                                    )
                                        }
                                        <IconButton
                                            size="small"
                                            disabled={deletionIsDisabled}
                                            onClick={(e) => handleDelete(e)}
                                            sx={STYLES.ICON_BUTTON_SX}>
                                            <DeleteIcon color={deletionIsDisabled ? "disabled" : "warning"}/>
                                        </IconButton>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Card>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0, borderTop: "none" }}>
                    <MyRiskRowDetails risk={props.risk} taken={props.taken} />
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
