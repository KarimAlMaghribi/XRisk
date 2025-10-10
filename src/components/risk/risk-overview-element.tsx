import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Chip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect } from "react";
import { Risk } from "../../models/Risk";
import { FetchStatus } from "../../types/FetchStatus";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ModeIcon from '@mui/icons-material/Mode';
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { createChat } from "../../store/slices/my-bids/thunks";
import { ChatStatusEnum } from "../../enums/ChatStatus.enum";
import { auth } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { Chat } from "../../store/slices/my-bids/types";
import { selectChats } from "../../store/slices/my-bids/selectors";
import { setActiveChat } from "../../store/slices/my-bids/reducers";
import { selectProfileInformation, selectUserProfile } from "../../store/slices/user-profile/selectors";
import { ProfileInformation, UserProfile } from "../../store/slices/user-profile/types";
import { formatDate } from '../../utils/dateFormatter';
import { Publisher } from "../../models/Publisher";
import { useSnackbarContext } from "../snackbar/custom-snackbar";
import { PublisherProfile } from "./publisher-profile";
import { updateRiskStatus } from "../../store/slices/risks/thunks";
import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import { selectShowTaken } from "../../store/slices/risks/selectors";
import DeleteIcon from "@mui/icons-material/Delete";
import { RiskDeletionDialog } from "./risk-deletion-dialog";
import { fetchAssessments } from '../../store/slices/credit-assesment/thunks';
import { selectAssessmentById } from '../../store/slices/credit-assesment/selectors';
import { CreditAssesment } from '../../models/CreditAssesment';
import { AvatarWithBadge } from "../profile/avatar-with-badge-count";

export const elementBottomMargin: number = 20;

export interface RiskOverviewElementProps {
  risks: Risk[];
  status: FetchStatus;
}

export const RiskOverviewElement = (props: RiskOverviewElementProps) => {
  const user = auth.currentUser;
  const assessment: CreditAssesment | null = useSelector((state: RootState) => selectAssessmentById(state, user?.uid!));
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const profileInfo: ProfileInformation = useSelector(selectProfileInformation);
  const showTaken: boolean = useSelector(selectShowTaken);
  const [riskToDelete, setRiskToDelete] = React.useState<Risk | null>(null);
  const [openRiskDeletionDialog, setOpenRiskDeletionDialog] = React.useState<boolean>(false);
  const [openPublisherProfileDialog, setOpenPublisherProfileDialog] = React.useState<boolean>(false);
  const [publisherProfile, setPublisherProfile] = React.useState<Publisher | null | undefined>(null);
  const [expandedPanels, setExpandedPanels] = React.useState<string[]>([]);
  const [noAddressError, setNoAddressError] = React.useState(false);
  const [noPhoneError, setNoPhoneError] = React.useState(false);
  const [noImageError, setNoImageError] = React.useState(false);
  const [creditAssessmentError, setCreditAssessmentError] = React.useState(false);
  const { showSnackbar } = useSnackbarContext();
  const userProfile: UserProfile = useSelector(selectUserProfile);
  const chats: Chat[] = useSelector(selectChats);

  useEffect(() => {
    const uid: string | undefined = auth.currentUser?.uid;
    if (!uid) { setCreditAssessmentError(true); return; }
    if (!assessment) { dispatch(fetchAssessments(uid)); }
  }, []);

  useEffect(() => {
    if (noAddressError) { showSnackbar("Adresse fehlt!", "Bitte vervollständige deine Adresse in deinem Profil, um Kontakt aufzunehmen.", {vertical:"top",horizontal:"center"}, "warning"); setNoAddressError(false); }
    if (noPhoneError) { showSnackbar("Telefonnummer fehlt!", "Bitte vervollständige deine Adresse in deinem Profil, um Kontakt aufzunehmen.", {vertical:"top",horizontal:"center"}, "warning"); setNoPhoneError(false); }
    if (noImageError) { showSnackbar("Profilbild fehlt!", "Bitte vervollständige deine Adresse in deinem Profil, um Kontakt aufzunehmen.", {vertical:"top",horizontal:"center"}, "warning"); setNoImageError(false); }
  }, [noAddressError, noPhoneError, noImageError]);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) =>
      setExpandedPanels((prev) => (isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)));

  const displayPublisherProfile = (event: any, publisher: Publisher | undefined) => {
    event.stopPropagation();
    if (!publisher) {
      showSnackbar("Probleme bei der Profilanzeige!", "Profil des Anbieters konnte nicht geladen werden. Lade die Seite erneut!", {vertical:"top",horizontal:"center"}, "error");
    }
    setPublisherProfile(publisher);
    setOpenPublisherProfileDialog(true);
  };

  const openBid = (riskIndex: number) => {
    const userNow = auth.currentUser;
    if (!userNow?.uid) { showSnackbar("Nutzer nicht authentifiziert!", "Konnte Verhandlung nicht starten.", {vertical:"top",horizontal:"center"}, "error"); return; }
    if (!userProfile.profile.street || !userProfile.profile.number || !userProfile.profile.zip || !userProfile.profile.city) { setNoAddressError(true); return; }
    if (!userProfile.profile.phone) { setNoPhoneError(true); return; }
    if (!userProfile.profile.imagePath) { setNoImageError(true); return; }

    const selectedRisk = props.risks[riskIndex];
    if (!selectedRisk) { showSnackbar("Risiko nicht gefunden", "Bitte aktualisiere die Seite.", {vertical:"top",horizontal:"center"}, "error"); return; }

    const acquisitionLimit = assessment?.acquisitionLimit || 0;
    if (!creditAssessmentError && acquisitionLimit <= selectedRisk.value) {
      showSnackbar("Niedrige Bonität", `Übernahmelimit (${acquisitionLimit.toFixed(2)}€) < Absicherungssumme (${selectedRisk.value.toFixed(2)}€).`, {vertical:"top",horizontal:"center"}, "error");
      return;
    }
    if (selectedRisk.publisher?.uid === userNow.uid) {
      showSnackbar("Falsches Risiko", "Du kannst nicht auf dein eigenes Risiko bieten.", {vertical:"top",horizontal:"center"}, "error");
      return;
    }

    const existingChat = chats.find((c) => c.riskId === selectedRisk.id && c.riskTaker.uid === userNow.uid);
    if (existingChat) { dispatch(setActiveChat(existingChat.id)); navigate(`/chat`); return; }

    const newChat: Omit<Chat, "id"> = {
      riskId: selectedRisk.id, created: new Date().toISOString(), lastActivity: new Date().toISOString(),
      topic: selectedRisk.name, status: ChatStatusEnum.ONLINE,
      riskProvider: { name: selectedRisk.publisher?.name || "Unknown Provider", uid: selectedRisk.publisher?.uid || "unknown_provider_uid", imagePath: selectedRisk.publisher?.imagePath || "" },
      riskTaker: { name: userNow.displayName || profileInfo.name, uid: userNow.uid, imagePath: profileInfo.imagePath || userNow.photoURL || "" },
    };

    dispatch(updateRiskStatus({ id: selectedRisk.id, status: RiskStatusEnum.DEAL }));
    dispatch(createChat(newChat));
    navigate(`/chat`);
  };

  const handleRiskDeletionDialog = (risk: Risk) => { setRiskToDelete(risk); setOpenRiskDeletionDialog(true); };

  const displayedRisks = !useSelector(selectShowTaken)
      ? props.risks.filter(risk => risk.status !== RiskStatusEnum.AGREEMENT)
      : props.risks;

  return (
      <>
        {displayedRisks && displayedRisks.map((risk: Risk, index) => (
            <Accordion
                sx={{ m: 0, '&.MuiAccordion-root': { m: 0 }, '&.MuiAccordion-gutters': { m: 0 } }}
                elevation={0}
                key={risk.id ?? index}
                expanded={expandedPanels.includes(risk.id!)}
                onChange={handleChange(risk.id!)}
            >
              {/* ===== Summary (responsive Spalten) ===== */}
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderTop: '1px solid #f3f3f3', borderBottom: '1px solid #f3f3f3', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
                  id={`panel-header-${risk.id}`}
              >
                <Grid container columns={12} alignItems="center" sx={{ width: '100%' }}>
                  {/* Name — immer sichtbar */}
                  <Grid size={{ xs: 7, sm: 7, md: 5, lg: 3, xl: 3 }}>
                    <Typography variant="body1" sx={{ cursor: 'pointer', fontWeight: "bolder", color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : "black" }}>
                      {risk.name}
                      {risk.status === RiskStatusEnum.AGREEMENT && (
                          <Tooltip title={"Risiko wurde bereits übernommen"} followCursor>
                            <Chip label="Übernommen" color="error" variant="outlined" sx={{ ml: 1, fontSize: "11px" }} />
                          </Tooltip>
                      )}
                    </Typography>
                  </Grid>

                  {/* Risikoart — ab lg */}
                  <Grid
                      size={{ lg: 3, xl: 3 }}
                      sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" } }}
                  >
                    <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                      {risk.type?.map((element, idx) => (
                          <Chip
                              key={idx}
                              label={element}
                              clickable={risk.status !== RiskStatusEnum.AGREEMENT}
                              sx={{
                                bgcolor: risk.status === RiskStatusEnum.AGREEMENT ? "white" : '#f3f3f3',
                                color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : '#343434',
                                mr: '4px',
                                border: '1px solid',
                                borderColor: "#d7d7d7",
                              }}
                          />
                      ))}
                    </Typography>
                  </Grid>

                  {/* Absicherungssumme — immer sichtbar */}
                  <Grid
                      size={{ xs: 5, sm: 5, md: 3, lg: 2, xl: 2 }}
                      sx={{ textAlign: { xs: 'right', sm: 'right', md: 'left' } }}
                  >
                    <Typography variant="subtitle1" sx={{ cursor: 'pointer', whiteSpace: "nowrap" }} style={{ color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : "black" }}>
                      {`${risk.value.toLocaleString()},00 €`}
                    </Typography>
                  </Grid>

                  {/* Fällig am — ab md */}
                  <Grid
                      size={{ md: 4, lg: 2, xl: 2 }}
                      sx={{ display: { xs: "none", sm: "none", md: "block" } }}
                  >
                    <Typography variant="subtitle1" sx={{ cursor: 'pointer' }} style={{ color: risk.status === RiskStatusEnum.AGREEMENT ? "grey" : "black" }}>
                      {formatDate(new Date(risk.declinationDate))}
                    </Typography>
                  </Grid>

                  {/* Anbieter — nur xl */}
                  <Grid
                      size={{ xl: 2 }}
                      sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "flex" }, justifyContent: "center", alignItems: "center" }}
                  >
                    <AvatarWithBadge
                        name={risk.publisher?.name}
                        uid={risk.publisher?.uid}
                        avatarSize={40}
                        image={risk.publisher?.imagePath}
                        onClick={(event: any) => {
                          event.stopPropagation();
                          displayPublisherProfile(event, risk.publisher);
                        }}
                    />
                  </Grid>
                </Grid>
              </AccordionSummary>

              {/* ===== Details (immer vollständig) ===== */}
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Aktionen */}
                  <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', pr: "20px" }}>
                    <Button
                        disabled={risk.publisher?.uid === user?.uid || risk.status === RiskStatusEnum.AGREEMENT}
                        onClick={() => openBid(index)}
                        variant="contained"
                        endIcon={<ModeIcon />}
                        sx={{ maxHeight: "40px", height: "40px" }}
                    >
                      Kontakt aufnehmen
                    </Button>
                    {profileInfo.admin && (
                        <Button
                            color="error"
                            onClick={() => handleRiskDeletionDialog(risk)}
                            variant="contained"
                            endIcon={<DeleteIcon />}
                            sx={{ maxHeight: "40px", height: "40px", ml: 1 }}
                        >
                          Risiko löschen
                        </Button>
                    )}
                  </Grid>

                  {/* Beschreibung */}
                  {risk.description && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body1" sx={{ mb: `${elementBottomMargin}px` }}>
                          Beschreibung
                        </Typography>
                        <Typography variant="body2" sx={{ color: "grey" }}>
                          {risk.description}
                        </Typography>
                      </Grid>
                  )}

                  {/* Strukturierte Details */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1">Details</Typography>
                    <br />

                    <Grid container spacing={2}>
                      {/* Risikoart */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" sx={{ color: "grey", mb: 1 }}>
                          Risikoart
                        </Typography>
                        <Typography variant="body2">
                          {risk.type?.length
                              ? risk.type.map((t, i) => (
                                  <Chip key={i} label={t} size="small" variant="outlined" sx={{ mr: .5, mb: .5 }} />
                              ))
                              : "–"}
                        </Typography>
                      </Grid>

                      {/* Fällig am */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" sx={{ color: "grey", mb: 1 }}>
                          Fällig am
                        </Typography>
                        <Typography variant="body2">
                          {risk.declinationDate ? formatDate(new Date(risk.declinationDate)) : "–"}
                        </Typography>
                      </Grid>

                      {/* Anbieter */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" sx={{ color: "grey", mb: 1 }}>
                          Anbieter
                        </Typography>
                        <Typography variant="body2">{risk.publisher?.name || "-"}</Typography>
                        {risk.publisher?.email && (
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {risk.publisher.email}
                            </Typography>
                        )}
                      </Grid>

                      {/* Anbieter-Bild (Avatar) für Mobile in Details */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" sx={{ color: "grey", mb: 1 }}>
                          Anbieter-Bild
                        </Typography>
                        <AvatarWithBadge
                            name={risk.publisher?.name}
                            uid={risk.publisher?.uid}
                            avatarSize={36}
                            image={risk.publisher?.imagePath}
                            onClick={(event: any) => displayPublisherProfile(event, risk.publisher)}
                        />
                      </Grid>

                      {/* Absicherungssumme */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" sx={{ color: "grey", mb: 1 }}>
                          Absicherungssumme
                        </Typography>
                        <Typography variant="body2">{`${risk.value.toLocaleString()},00 €`}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
        ))}

        {(!displayedRisks || displayedRisks.length === 0) && (
            <Typography variant="h5" sx={{ mt: "20px", textAlign: "center" }}>
              Keine Risiken gefunden.
            </Typography>
        )}

        <PublisherProfile
            open={openPublisherProfileDialog}
            setOpen={setOpenPublisherProfileDialog}
            publisher={publisherProfile}
            setPublisher={setPublisherProfile}
        />
        <RiskDeletionDialog
            open={openRiskDeletionDialog}
            setOpen={setOpenRiskDeletionDialog}
            risk={riskToDelete}
        />
      </>
  );
};
