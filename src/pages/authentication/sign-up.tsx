import {Card, Checkbox, FormControlLabel, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../../routing/routes";
import {signUpWithEmail} from "../../firebase/firebase-service";

export const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        password: '',
        receiveUpdates: false
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const error = signUpWithEmail(formData.email, formData.password);
        if (!error) {
            navigate(`/${ROUTES.SIGN_IN}`);
        }

    };

    return (
        <div style={{justifyContent: "center", alignItems: "center", marginTop: "25vh"}}>
            <Box sx={{
                maxWidth: 400,
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Registrieren</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        size="small"
                        fullWidth
                        label="Name"
                        name="fullName"
                        value={formData.fullName}
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
                        onChange={handleChange}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={formData.receiveUpdates} onChange={handleChange} name="receiveUpdates" />}
                        label="Ich möchte Updates per Email erhalten."
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
                        Registrieren
                    </Button>
                    <Typography textAlign="center" sx={{ mb: 1 }} variant="subtitle1">
                        Ich habe bereits einen Account? <Link to={`/${ROUTES.SIGN_IN}`}>Log In</Link>
                    </Typography>
                </form>
            </Box>
        </div>

    );
}
