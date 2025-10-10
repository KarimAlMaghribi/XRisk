import Dialog from "@mui/material/Dialog";
import React, {useEffect} from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {ProfileAvatar} from "./profile-avatar";
import {saveInStorage} from "../../firebase/firebase-service";
import {auth} from "../../firebase_config";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {updateImagePath, updateProfile} from "../../store/slices/user-profile/thunks";
import {selectUserProfile} from "../../store/slices/user-profile/selectors";
import {UserProfile} from "../../store/slices/user-profile/types";
import {Countries} from "./countries";
import {updateProviderDetails} from "../../store/slices/risks/thunks";
import {Publisher} from "../../models/Publisher";
import {Trans} from "react-i18next";
import i18next from "i18next";
import {RiskGiverHistory} from "./riskGiverHistory";
import {LossRatio} from "../risk/loss-ratio";
import {useAgreedRisks} from "./use-agreed-risks";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface ProfileDialogProps {
    show: boolean;
    handleClose: () => void;
}

export const ProfileDialog = (props: ProfileDialogProps) => {
    const dispatch: AppDispatch = useDispatch();
    const userProfile: UserProfile = useSelector(selectUserProfile);
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [country, setCountry] = React.useState<string>("");
    const [street, setStreet] = React.useState<string>("");
    const [number, setNumber] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("");
    const [zip, setZip] = React.useState<string>("");
    const [gender, setGender] = React.useState<string>("");
    const [birthdate, setBirthdate] = React.useState<string>("");
    const [birthplace, setBirthplace] = React.useState<string>("");
    const [aboutMe, setAboutMe] = React.useState<string>("");
    const [phone, setPhone] = React.useState<string>("");
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePath, setImagePath] = React.useState<string | null>(null);

    const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"error" | "success">("error");
    const [birthdateError, setBirthdateError] = React.useState<boolean>(false);

    const {risks} = useAgreedRisks(auth.currentUser?.uid);
    const calcSuccessfulTransfers = () => risks.length;
    const handleSnackbarClose = () => setSnackbarOpen(false);

    useEffect(() => {
        setName(userProfile.profile.name);
        setEmail(userProfile.profile.email);
        setCountry(userProfile.profile.country || "");
        setStreet(userProfile.profile.street || "");
        setNumber(userProfile.profile.number || "");
        setCity(userProfile.profile.city || "");
        setZip(userProfile.profile.zip || "");
        setGender(userProfile.profile.gender || "");
        setBirthdate(userProfile.profile.birthdate || "");
        setBirthplace(userProfile.profile.birthplace || "");
        setPhone(userProfile.profile.phone || "");
        setAboutMe(userProfile.profile.aboutMe || "");
    }, [userProfile]);

    useEffect(() => {
        if (imageFile) {
            (async () => {
                try {
                    const downloadUrl = await saveInStorage(`imgs/profile/${auth.currentUser?.uid}`, imageFile);
                    if (!downloadUrl) {
                        console.error("Error uploading file! Could not get download URL!");
                        setSnackbarMessage("Fehler beim Hochladen des Bildes!");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                        return;
                    }
                    dispatch(updateImagePath(downloadUrl));
                    setImagePath(downloadUrl);
                } catch (error) {
                    console.error("File upload failed:", error);
                    const errorMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
                    setSnackbarMessage("Fehler beim Hochladen: " + errorMsg);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                } finally {
                    setImageFile(null);
                }
            })();
        }
    }, [imageFile, dispatch]);

    const handleSave = async () => {
        try {
            dispatch(updateProfile({
                imagePath: imagePath || userProfile.profile.imagePath || "",
                email, name, gender, birthdate, birthplace, phone, country, street, number, city, zip, aboutMe,
            }));

            const publisherInfos: Publisher = {
                uid: auth.currentUser?.uid || userProfile.id || "",
                name, email, phoneNumber: phone,
                imagePath: imagePath || userProfile.profile.imagePath || "",
                address: `${street} ${number}, ${zip} ${city}, ${country}`,
                description: aboutMe,
            };
            dispatch(updateProviderDetails(publisherInfos));
            props.handleClose();
        } catch (error) {
            console.error("Error saving profile:", error);
            const errorMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
            setSnackbarMessage("Fehler beim Speichern: " + errorMsg);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCancel = () => props.handleClose();

    // ---- Mobile Fullscreen & Sticky Header/Actions ----
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog
            onClose={props.handleClose}
            open={props.show}
            fullScreen={fullScreen}
            fullWidth
            maxWidth="md"
            scroll="paper"
            PaperProps={{
                sx: fullScreen
                    ? { width: "100%", height: "100%", m: 0, borderRadius: 0 }
                    : { width: "min(720px, 90vw)", maxHeight: "90vh", m: "auto" },
            }}
        >
            <DialogTitle
                sx={{
                    position: fullScreen ? "sticky" : "static",
                    top: 0,
                    zIndex: 1,
                    bgcolor: "background.paper",
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    py: { xs: 1, sm: 1.5 },
                }}
            >
                <Typography variant="h6">
                    <Trans i18nKey={"profile_information.profile"} />
                </Typography>
                <Typography variant="subtitle1">
                    <Trans i18nKey={"profile_information.update_profile_text"} />
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2, px: { xs: 2, sm: 3 } }}>
                {/* Kopfbereich: Avatar / LossRatio / Transfer-Stat */}
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ProfileAvatar
                            imagePath={imagePath || userProfile.profile.imagePath || ""}
                            setImagePath={setImagePath}
                            file={imageFile}
                            setFile={setImageFile}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <LossRatio uid={userProfile.id} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Box sx={{ width: "100%" }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold" mt={1}>
                                Risiko-Transfer
                            </Typography>
                            <Divider />
                            <Box mt={1}>
                                <Tooltip
                                    followCursor
                                    title={"Diese Quote gibt die Anzahl der abgeschlossenen Risko-Transfers des Nutzers an."}
                                    placement="top"
                                >
                                    <Typography sx={{ cursor: "pointer", ml: 1 }}>
                                        {calcSuccessfulTransfers() !== null ? calcSuccessfulTransfers() : "Keine Daten vorhanden"}
                                    </Typography>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ width: "100%" }}>
                            <RiskGiverHistory uid={userProfile.id} />
                        </Box>
                    </Grid>
                </Grid>

                {/* Basisdaten */}
                <Box mt={3}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Basisdaten
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Box>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.name_label")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.email_label")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <Countries value={country} setValue={setCountry} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <Autocomplete
                            value={gender}
                            onChange={(_, newValue) => { newValue && setGender(newValue); }}
                            options={["Männlich", "Weiblich", "Divers"]}
                            renderInput={(params) => (
                                <TextField {...params} label={i18next.t("profile_information.sex_label")} variant="outlined" />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            sx={{ mt: 1 }}
                            rows={4}
                            multiline
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.introduction_label")}
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.birthdate_label")}
                            type="date"
                            value={birthdate}
                            error={birthdateError}
                            helperText={birthdateError ? "Das Alter darf nicht unter 18 Jahren liegen!" : ""}
                            onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                const currentDate = new Date();
                                const age = currentDate.getFullYear() - selectedDate.getFullYear();
                                const turned18 = new Date(selectedDate);
                                turned18.setFullYear(selectedDate.getFullYear() + 18);

                                if (age < 18 || (age === 18 && currentDate < turned18)) {
                                    setBirthdateError(true);
                                    setSnackbarMessage("Das Alter darf nicht unter 18 Jahren liegen!");
                                    setSnackbarSeverity("error");
                                    setSnackbarOpen(true);
                                    setBirthdate("");
                                } else {
                                    setBirthdateError(false);
                                    setBirthdate(e.target.value);
                                }
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.telephone_label")}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>

                    {/* Adresse */}
                    <Grid size={{ xs: 12 }}>
                        <Box mt={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                <Trans i18nKey={"profile_information.adress"} />
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.street_label")}
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.house_number_label")}
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.city_label")}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={i18next.t("profile_information.zip_label")}
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions
                sx={{
                    position: fullScreen ? "sticky" : "static",
                    bottom: 0,
                    bgcolor: "background.paper",
                    borderTop: (t) => `1px solid ${t.palette.divider}`,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.25, sm: 1.5 },
                }}
            >
                <Button onClick={handleCancel} variant="outlined">
                    <Trans i18nKey={"profile_information.cancel"} />
                </Button>
                <Button onClick={handleSave} variant="contained">
                    <Trans i18nKey={"profile_information.save"} />
                </Button>
            </DialogActions>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};
