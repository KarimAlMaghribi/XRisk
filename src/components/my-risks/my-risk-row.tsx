import React, {useMemo, useState} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Chip,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import SendIcon from "@mui/icons-material/Send";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Risk} from "../../models/Risk";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {updateMyRisk} from "../../store/slices/my-risks/thunks";
import {addRisk, deleteRisk} from "../../store/slices/risks/thunks";
import {AppDispatch} from "../../store/store";
import {UserProfile} from "../../store/slices/user-profile/types";
import {selectUserProfile} from "../../store/slices/user-profile/selectors";
import {ROUTES} from "../../routing/routes";
import {setActiveChatByRiskId} from "../../store/slices/my-bids/reducers";
import {deleteChatsByRiskId} from "../../store/slices/my-bids/thunks";
import {Chat} from "../../store/slices/my-bids/types";
import {selectChatByRiskId} from "../../store/slices/my-bids/selectors";

import ResponsiveActionBar, {
  ActionItem,
  Density
} from "../../components/my-risks/responsive-action-bar";
import {useSnackbarContext} from "../../components/snackbar/custom-snackbar";
import {STYLES} from "../../components/my-risks/risk-row-styles";
import {
  mapStatus,
  mapStatusChipColor,
  mapStatusIcon,
  mapStatusToolTip,
} from "../../components/my-risks/utils";
import {MyRiskRowDetails} from "../../components/my-risks/my-risk-row-details/my-risk-row-details";
import {MyRiskEditDialog} from "../../components/my-risks/edit-dialog/my-risk-edit-dialog";
import {MyRiskDeletionDialog} from "../../components/my-risks/deletion-dialog/deletion-dialog";
import {
  CancelDealDialog
} from "../../components/my-risks/my-risk-row-details/deals-details/cancel-deal-dialog";
import {
  HandleDamageDialog
} from "../../components/my-risks/my-risk-row-details/agreement-details/handle-damage-dialog";
import {t} from "i18next";

export interface MyRiskRowProps {
  risk: Risk;
  onEdit?: (risk: Risk) => void;
  onDelete?: (risk: Risk) => void;
  taken?: boolean;
  // density wird aus dem Kontext (Panel) abgeleitet; falls nicht gesetzt, nehmen wir taken?roomy:dense
  density?: Density;
}

const MyRiskRow = (props: MyRiskRowProps) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const {showSnackbar} = useSnackbarContext();

  const user: UserProfile = useSelector(selectUserProfile);
  const riskRelatedChat: Chat | undefined = useSelector(selectChatByRiskId(props.risk.id));

  const [openRiskEditDialog, setOpenRiskEditDialog] = useState(false);
  const [noAddressError, setNoAddressError] = useState(false);
  const [noPhoneError, setNoPhoneError] = useState(false);
  const [noImageError, setNoImageError] = useState(false);
  const [openDeletionDialog, setOpenDeletionDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openCancelDealDialog, setOpenCancelDealDialog] = useState(false);
  const [openHandleDamageDialog, setOpenHandleDamageDialog] = useState(false);

  // --- Error Snackbars für fehlende Profilangaben ---
  React.useEffect(() => {
    if (noAddressError) {
      showSnackbar(
          "Adresse fehlt!",
          "Bitte vervollständige deine Adresse in deinem Profil, um ein Risiko zu veröffentlichen.",
          {vertical: "top", horizontal: "center"},
          "warning"
      );
      setNoAddressError(false);
      return;
    }
    if (noPhoneError) {
      showSnackbar(
          "Telefonnummer fehlt!",
          "Bitte vervollständige deine Telefonnummer in deinem Profil, um ein Risiko zu veröffentlichen.",
          {vertical: "top", horizontal: "center"},
          "warning"
      );
      setNoPhoneError(false);
      return;
    }
    if (noImageError) {
      showSnackbar(
          "Profilbild fehlt!",
          "Bitte lade ein Profilbild in deinem Profil hoch, um ein Risiko zu veröffentlichen.",
          {vertical: "top", horizontal: "center"},
          "warning"
      );
      setNoImageError(false);
      return;
    }
  }, [noAddressError, noPhoneError, noImageError, showSnackbar]);

  // --- Actions/Handlers ---
  const handlePublish = (e?: any): void => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    if (!user || !user.id) {
      console.error("User not authenticated or UID missing:", user);
      showSnackbar(
          "Nutzer-ID unbekannt!",
          "Risiko kann nicht veröffentlicht werden. Melde dich ab- und wieder an.",
          {vertical: "top", horizontal: "center"},
          "error"
      );
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
          phoneNumber: user.profile.phone,
        },
        status: RiskStatusEnum.PUBLISHED,
        publishedAt: new Date().toISOString(),
      };

      dispatch(updateMyRisk(riskToPublish));
      dispatch(addRisk(riskToPublish));
    }
  };

  const handleWithdraw = (e?: any): void => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    if (props.risk.status === RiskStatusEnum.PUBLISHED || props.risk.status === RiskStatusEnum.DEAL) {
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

  const handleReportDamage = (e: any, _risk: Risk): void => {
    e?.stopPropagation?.();
    setOpenHandleDamageDialog(true);
  };

  const handleDelete = (e?: any): void => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    setOpenDeletionDialog(true);
  };

  const cancelDeal = (e?: any) => {
    e?.stopPropagation?.();
    setOpenCancelDealDialog(true);
  };

  // *** vor Actions definieren, damit in actions benutzt werden kann
  const deletionIsDisabled =
      props.risk.status === RiskStatusEnum.PUBLISHED ||
      props.risk.status === RiskStatusEnum.AGREEMENT ||
      props.risk.status === RiskStatusEnum.DEAL;

  // --- Anzeigeformate ---
  const formattedValue = useMemo(() => {
    if (props.risk.value == null) return "-";
    try {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(props.risk.value);
    } catch {
      return `${props.risk.value.toLocaleString()},00 €`;
    }
  }, [props.risk.value]);

  const visibleTypes = useMemo(
      () => (!props.risk.type ? [] : mdUp ? props.risk.type : props.risk.type.slice(0, 3)),
      [props.risk.type, mdUp]
  );
  const restTypeCount = (props.risk.type?.length || 0) - (visibleTypes?.length || 0);

  // --- Action-Spezifikation für ResponsiveActionBar ---
  const actions: ActionItem[] = useMemo(() => {
    const list: ActionItem[] = [];

    const statusEnum = props.risk.status ?? RiskStatusEnum.DRAFT;

    const push = (
        key: string,
        labelKey: string,
        icon: React.ReactElement,
        onClick: (e?: React.SyntheticEvent) => void,
        priority: number,
        disabled?: boolean
    ) => list.push({key, label: (t as any)(labelKey) as string, icon, onClick, priority, disabled});

    const canEdit = statusEnum === RiskStatusEnum.DRAFT || statusEnum === RiskStatusEnum.WITHDRAWN;

    if (props.taken) {
      if (statusEnum === RiskStatusEnum.AGREEMENT) {
        push("contact", "my_risks.contact",
            <InterpreterModeIcon/>, () => handleDeal(props.risk), 0);
        push(
            "reportDamage",
            props.risk.occurred ? "my_risks.claim_reported" : "my_risks.claim_report",
            <FeedbackIcon/>,
            (e) => handleReportDamage(e as any, props.risk),
            1,
            !!props.risk.occurred
        );
      } else {
        push("negotiate", "my_risks.negotiate",
            <SignLanguageIcon/>, () => handleDeal(props.risk), 0);
        push("cancelNegotiation", "my_risks.cancel_negotiation",
            <NotInterestedIcon/>, (e) => cancelDeal(e as any), 1);
      }
      push("delete", "my_risks.delete", <DeleteIcon/>, () => handleDelete(), 3, deletionIsDisabled);
    } else {
      if (statusEnum === RiskStatusEnum.WITHDRAWN || statusEnum === RiskStatusEnum.DRAFT) {
        push("publish", "my_risks.publish", <SendIcon/>, (e) => handlePublish(e as any), 0);
      } else if (statusEnum !== RiskStatusEnum.DEAL && statusEnum !== RiskStatusEnum.AGREEMENT) {
        push("withdraw", "my_risks.withdraw", <UndoIcon/>, (e) => handleWithdraw(e as any), 0);
      }

      if (statusEnum === RiskStatusEnum.AGREEMENT) {
        push("contact", "my_risks.contact",
            <InterpreterModeIcon/>, () => handleDeal(props.risk), 1);
        push(
            "reportDamage",
            props.risk.occurred ? "my_risks.claim_reported" : "my_risks.claim_report",
            <FeedbackIcon/>,
            (e) => handleReportDamage(e as any, props.risk),
            2,
            !!props.risk.occurred
        );
      } else {
        push("edit", "my_risks.edit", <EditIcon/>, () => setOpenRiskEditDialog(true), 2, !canEdit);
      }

      push("delete", "my_risks.delete", <DeleteIcon/>, () => handleDelete(), 3, deletionIsDisabled);
    }

    return list;
  }, [props.risk, props.taken, deletionIsDisabled]);

  return (
      <>
        <Accordion
            TransitionProps={{style: {transformOrigin: "top"}}}
            expanded={expanded}
            onChange={(_event, isExpanded) => setExpanded(isExpanded)}
            elevation={0}
            sx={STYLES.ACCORDION_SX}
        >
          <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              sx={{
                ...STYLES.ACCORDION_SUMMARY_SX,
                "& .MuiAccordionSummary-content": {
                  minWidth: 0,
                  gap: 1,
                },
              }}
          >
            <Card elevation={0} sx={{...STYLES.CARD_SX, width: "100%"}}>
              {/* Header: links (Status+Name), rechts (Wert+Actions) */}
              <Box
                  sx={{
                    display: "flex",
                    flexDirection: {xs: "column", md: "row"},
                    alignItems: {md: "center"},
                    gap: {xs: 1, md: 2},
                    width: "100%",
                  }}
              >
                {/* Links: Status + Name (MOBIL: UNTEREINANDER) */}
                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" }, // ← fehlendes Komma war hier
                  gap: { xs: 0.5, md: 1 },
                  flex: "1 1 auto",
                  minWidth: 0
                }}>
                  <Tooltip title={mapStatusToolTip(t as any, props.risk.status)} followCursor
                           sx={STYLES.STATUS_TOOLTIP_SX}>
                    <Chip
                        icon={mapStatusIcon(props.risk.status)}
                        label={mapStatus(t as any, props.risk.status)}
                        variant="filled"
                        color={mapStatusChipColor(props.risk.status)}
                        sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
                    />
                  </Tooltip>

                  <Typography
                      variant="body1"
                      fontWeight="bolder"
                      noWrap={mdUp}
                      sx={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word"
                      }}
                      title={props.risk.name}
                  >
                    {props.risk.name}
                  </Typography>
                </Box>

                {/* Rechts: Wert (md+) + ActionBar */}
                <Box
                    sx={{ml: "auto", display: "flex", alignItems: "center", gap: 1, flexShrink: 0}}>
                  {/* Wert nur ab md sichtbar (mobil unten extra) */}
                  <Box sx={{display: {xs: "none", md: "block"}}}>
                    <Typography variant="body1" sx={{whiteSpace: "nowrap"}}>
                      {props.risk.value != null ? formattedValue : "-"}
                    </Typography>
                  </Box>

                  <ResponsiveActionBar
                      actions={actions}
                      density={props.density ?? (props.taken ? "roomy" : "dense")}
                      moreLabel={(t as any)("common.more_actions") as string}
                  />
                </Box>
              </Box>

              {/* Zweite Zeile: Chips + mobiler Wert */}
              <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    width: "100%",
                    mt: {xs: 1, md: 0},
                  }}
              >
                <Box sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  maxWidth: "100%",
                  overflow: "hidden"
                }}>
                  {visibleTypes.map((element, idx) => (
                      <Chip key={idx} label={element} clickable sx={STYLES.TYPE_CHIP_SX}/>
                  ))}
                  {restTypeCount > 0 &&
                      <Chip label={`+${restTypeCount}`} clickable sx={STYLES.TYPE_CHIP_SX}/>}
                </Box>

                {/* Wert nur mobil */}
                <Box sx={{display: {xs: "block", md: "none"}}}>
                  <Typography variant="body2" fontWeight={600}>
                    {formattedValue}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </AccordionSummary>

          {/* Details */}
          <AccordionDetails sx={{padding: 0, borderTop: "none"}}>
            <MyRiskRowDetails risk={props.risk} taken={props.taken}/>
          </AccordionDetails>

          {/* Dialoge */}
          <MyRiskEditDialog open={openRiskEditDialog} setOpen={setOpenRiskEditDialog}
                            risk={props.risk}/>
          <MyRiskDeletionDialog open={openDeletionDialog} setOpen={setOpenDeletionDialog}
                                risk={props.risk}/>
          {riskRelatedChat && (
              <CancelDealDialog open={openCancelDealDialog} setOpen={setOpenCancelDealDialog}
                                chat={riskRelatedChat}/>
          )}
        </Accordion>

        <HandleDamageDialog open={openHandleDamageDialog} setOpen={setOpenHandleDamageDialog}
                            risk={props.risk}/>
      </>
  );
};

export default MyRiskRow;
export {MyRiskRow};
