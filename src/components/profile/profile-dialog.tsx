import Dialog from "@mui/material/Dialog";
import React, {useEffect} from "react";
import {DialogActions, DialogContent, DialogTitle, Divider, Grid2, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ProfileAvatar} from "./profile-avatar";
import Button from "@mui/material/Button";
import {saveInStorage} from "../../firebase/firebase-service";
import {auth} from "../../firebase_config";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {updateImagePath, updateProfile} from "../../store/slices/user-profile/thunks";
import {selectUserProfile} from "../../store/slices/user-profile/selectors";
import {UserProfile} from "../../store/slices/user-profile/types";
import {Countries} from "./countries";

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
    const [street, setStreet] = React.useState<string>();
    const [number, setNumber] = React.useState<string>();
    const [city, setCity] = React.useState<string>();
    const [zip, setZip] = React.useState<string>();
    const [gender, setGender] = React.useState<string>();
    const [birthdate, setBirthdate] = React.useState<string>();
    const [birthplace, setBirthplace] = React.useState<string>();
    const [phone, setPhone] = React.useState<string>();
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePath, setImagePath] = React.useState<string | null>(null);

    useEffect(() => {
        setName(userProfile.profile.name);
        setEmail(userProfile.profile.email);
    }, [userProfile])

    const handleFileUpload = async () => {
        const downloadUrl = await saveInStorage(`profileImages/${auth.currentUser?.uid}`, imageFile);

        if (!downloadUrl) {
            console.error("Error uploading file! Could not find download URL!")
            return;
        }

        dispatch(updateImagePath(downloadUrl));
        setImagePath(downloadUrl);
    };

    const handleSave = () => {
        handleFileUpload()
        // dispatch(updateProfile({name, email, country}));
        props.handleClose();
    }

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
                    position: "absolute",
                    top: "10%",
                    margin: 0,
                    width: "50%",
                    maxWidth: "none"
                },
            }}>
            <DialogTitle>
                <Typography variant="h6">Profil</Typography>
                <Typography variant="subtitle1">Passe die Profilinformationen an, die du auf der Webseite präsentierst</Typography>
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
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="outlined">Abbrechen</Button>
                <Button onClick={handleSave} variant="contained">Speichern</Button>
            </DialogActions>
        </Dialog>
    )
}
