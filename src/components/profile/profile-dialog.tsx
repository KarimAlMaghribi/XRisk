import Dialog from "@mui/material/Dialog";
import React from "react";
import {DialogActions, DialogContent, DialogTitle, Divider, Grid2, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {ProfileAvatar} from "./profile-avatar";
import Button from "@mui/material/Button";

export interface ProfileDialogProps {
    show: boolean;
    handleClose: () => void;
}

export const ProfileDialog = (props: ProfileDialogProps) => {
    const [name, setName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');

    const handleSave = () => {
        console.log("Save profile data");
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
                    <Grid2 size={2}>
                        <ProfileAvatar />
                    </Grid2>
                    <Grid2 size={5}>
                        <TextField
                            variant="standard"
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={5}>
                        <TextField
                            variant="standard"
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="outlined">Abbrechen</Button>
                <Button onClick={handleSave} variant="contained">Speichern</Button>
            </DialogActions>
        </Dialog>
    )
}
