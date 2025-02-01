import Dialog from "@mui/material/Dialog";
import React, {useEffect} from "react";
import {Autocomplete, DialogActions, DialogContent, DialogTitle, Divider, Grid2, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ProfileAvatar} from "./profile-avatar";
import Button from "@mui/material/Button";
import {saveInStorage} from "../../firebase/firebase-service";
import {auth} from "../../firebase_config";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {updateImagePath, updateProfile} from "../../store/slices/user-profile/thunks";
import {selectUserProfile} from "../../store/slices/user-profile/selectors";
import {ProfileInformation, UserProfile} from "../../store/slices/user-profile/types";
import {Countries} from "./countries";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {updateRisk} from "../../store/slices/risks/thunks";

export interface ProfileDialogProps {
    show: boolean;
    handleClose: () => void;
}

export const ProfileDialog = (props: ProfileDialogProps) => {
    const dispatch: AppDispatch = useDispatch();
    const userProfile: UserProfile = useSelector(selectUserProfile);
    const [name, setName] = React.useState<string>();
    const [email, setEmail] = React.useState<string>();
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

    const handleFileUpload = async () => {
        if (!imageFile) {
            console.error("No file provided for upload!");
            return;
        }

        try {
            const downloadUrl = await saveInStorage(
                `profileImages/${auth.currentUser?.uid}`,
                imageFile
            );

            if (!downloadUrl) {
                console.error("Error uploading file! Could not find download URL!");
                return;
            }

            dispatch(updateImagePath(downloadUrl));
            setImagePath(downloadUrl);
        } catch (error) {
            console.error("File upload failed:", error);
        }
    };

    const handleSave = async () => {
        try {
            if (imageFile) {
                await handleFileUpload();
            }

            dispatch(
                updateProfile({
                    imagePath: imagePath || userProfile.profile.imagePath,
                    name,
                    gender,
                    birthdate,
                    birthplace,
                    phone,
                    country,
                    street,
                    number,
                    city,
                    zip,
                    aboutMe,
                })
            );

            props.handleClose();
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const handleCancel = () => {
        if (imagePath && imagePath.startsWith("blob:")) {
            URL.revokeObjectURL(imagePath);
        }
        setImageFile(null);
        props.handleClose();
    }

    return (
        <Dialog
            onClose={props.handleClose}
            open={props.show}
            PaperProps={{
                sx: {
                    maxHeight: "80%",
                    position: "absolute",
                    top: "10%",
                    margin: 0,
                    width: "50%",
                    maxWidth: "none"
                },
            }}>
            <DialogTitle>
                <Typography variant="h6">Profil</Typography>
                <Typography variant="subtitle1">Passe deine Profilinformationen an, die du auf der Webseite präsentierst</Typography>
            </DialogTitle>

            <Divider/>

            <DialogContent sx={{marginTop: "20px"}}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{md: 12, lg: 12}}>
                        <ProfileAvatar
                            imagePath={imagePath || userProfile.profile.imagePath || ""}
                            setImagePath={setImagePath}
                            file={imageFile}
                            setFile={setImageFile}
                        />
                    </Grid2>
                    <Grid2 size={{md: 12, lg: 6}}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{md: 12, lg: 6}}>
                        <TextField
                            disabled
                            variant="outlined"
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{md: 12, lg: 6}}>
                        <Countries value={country} setValue={setCountry} />
                    </Grid2>
                    <Grid2 size={{md: 12, lg: 6}}>
                        <Autocomplete
                            value={gender}
                            onChange={(event, newValue) => {
                                newValue && setGender(newValue);
                            }}
                            options={["Männlich", "Weiblich", "Divers"]}
                            renderInput={(params) => <TextField {...params} label="Geschlecht" variant="outlined" />}
                        />
                    </Grid2>
                    <Grid2 size={{xs: 12}}>
                        <TextField
                            sx={{
                                marginTop: "10px",
                            }}
                            rows={4}
                            multiline
                            variant="outlined"
                            fullWidth
                            label="Vorstellung"
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                        />
                    </Grid2>

                    <Grid2 size={{ md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Geburtsdatum"
                            type="date"
                            value={birthdate}
                            error={birthdateError}
                            helperText={birthdateError ? "Das Alter darf nicht unter 18 Jahren liegen!" : ""}
                            onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                const currentDate = new Date();
                                const age = currentDate.getFullYear() - selectedDate.getFullYear();

                                if (age < 18 || (age === 18 && currentDate < new Date(selectedDate.setFullYear(selectedDate.getFullYear() + 18)))) {
                                    setBirthdateError(true);
                                    setSnackbarMessage("Das Alter darf nicht unter 18 Jahren liegen!");
                                    setSnackbarSeverity("error");
                                    setSnackbarOpen(true);
                                    setBirthdate(""); // Zurücksetzen bei ungültigem Alter
                                } else {
                                    setBirthdateError(false);
                                    setBirthdate(e.target.value);
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Telefonnummer"
                            value={phone}
                            onChange={(e) => {setPhone(e.target.value);}
                            }
                        />
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 12 }}>
                        <Box mt={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Adresse
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Box>
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Straße"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Hausnummer"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Stadt"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 6 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Postleitzahl"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="outlined">Abbrechen</Button>
                <Button onClick={handleSave} variant="contained">Speichern</Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    )
}
