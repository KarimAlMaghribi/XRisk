import { Checkbox, FormControlLabel, TextField, Snackbar, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routing/routes";
import { signUpWithEmail } from "../../firebase/firebase-service";
import "./style.scss";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { ProfileInformation } from "../../store/slices/user-profile/types";
import { addProfile } from "../../store/slices/user-profile/thunks";

export const SignUp = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        receiveUpdates: false,
    });
    const [errors, setErrors] = useState({
        fullName: false,
        email: false,
        password: false,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">("error");

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const validateFields = (): boolean => {
        let isValid = true;
        const newErrors = {
            fullName: false,
            email: false,
            password: false,
        };

        // Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = true;
            isValid = false;
            setSnackbarMessage("Bitte geben Sie Ihren Namen ein.");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = true;
            isValid = false;
            setSnackbarMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        }

        // Password validation
        if (formData.password.length < 6) {
            newErrors.password = true;
            isValid = false;
            setSnackbarMessage("Das Passwort muss mindestens 6 Zeichen lang sein.");
        }

        setErrors(newErrors);

        if (!isValid) {
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateFields()) return;

        const error = await signUpWithEmail(formData.email, formData.password);

        if (error) {
            setSnackbarMessage("Fehler beim Registrieren. Bitte versuchen Sie es erneut.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        try {
            saveProfileInformation();
            setSnackbarMessage("Registrierung erfolgreich!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            navigate(`/${ROUTES.MY_RISKS}`);
        } catch (error) {
            setSnackbarMessage("Fehler beim Speichern der Profildaten.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const saveProfileInformation = () => {
        const newProfile: ProfileInformation = {
            name: formData.fullName,
            email: formData.email,
            receiveUpdates: formData.receiveUpdates,
        };

        dispatch(addProfile(newProfile));
    };

    return (
        <div className="sign-up-card">
            <Box
                sx={{
                    maxWidth: 400,
                    mx: "auto",
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Registrieren
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        size="small"
                        fullWidth
                        label="Name"
                        name="fullName"
                        value={formData.fullName}
                        error={errors.fullName}
                        helperText={errors.fullName ? "Name darf nicht leer sein." : ""}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        size="small"
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        error={errors.email}
                        helperText={errors.email ? "Bitte geben Sie eine gültige E-Mail-Adresse ein." : ""}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Passwort"
                        name="password"
                        type="password"
                        value={formData.password}
                        error={errors.password}
                        helperText={errors.password ? "Passwort muss mindestens 6 Zeichen lang sein." : ""}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.receiveUpdates}
                                onChange={handleChange}
                                name="receiveUpdates"
                            />
                        }
                        label="Ich möchte Updates per Email erhalten."
                        sx={{ mb: 2 }}
                    />
                    <Button
                        disabled={!formData.email || !formData.password || !formData.fullName}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2 }}
                    >
                        Registrieren
                    </Button>
                    <Typography textAlign="center" sx={{ mb: 1 }} variant="subtitle1">
                        Ich habe bereits einen Account? <Link to={`/${ROUTES.SIGN_IN}`}>Zur Anmeldung</Link>
                    </Typography>
                </form>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};
