import {Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {Publisher} from "../../models/Publisher";
import { PaperComponent } from "../ui/draggable-dialog";
import React, {useEffect} from "react";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";

export interface PublisherProfileProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    publisher: Publisher | undefined | null;
    setPublisher?: (publisher: Publisher | null | undefined) => void;
}

export const PublisherProfile = (props: PublisherProfileProps) => {
    const { showSnackbar } = useSnackbarContext();
    const elementBottomMargin: number = 20;

    useEffect(() => {
        if (props.open && !props.publisher) {
            console.error("Publisher not found!");
            showSnackbar("Darstellung fehlerhaft!", "Anbieterdaten konnten nicht dargestellt werden", {vertical: "top", horizontal: "center"},"error");
        }
    }, [props.publisher]);

    const handleClose = () => {
        props.setOpen(false);
    }

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            PaperProps={{
                sx: {
                    position: 'absolute',
                    top: '10%',
                    m: 0,
                },
            }}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {props.publisher?.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Box marginBottom="20px">
                        <Avatar sx={{width: 70, height: 70}} src={props.publisher?.imagePath} />
                    </Box>
                    <Grid container>
                        <Grid size={4}>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}} >
                                Anbieter
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Telefonnummer
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                E-Mail
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Adresse
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px`}}>
                                Vorstellung
                            </Typography>
                        </Grid>
                        <Grid size={8}>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.publisher?.name || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.publisher?.phoneNumber || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.publisher?.email || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.publisher?.address || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: `${elementBottomMargin}px` }}>
                                {props.publisher?.description || "-"}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
    )
}
