import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routing/routes";
import { useSession } from "../../auth/useSession";

export const SignUp = () => {
  const navigate = useNavigate();
  const { doRegister } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    familyName: "",
    email: "",
    password: "",
    receiveUpdates: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await doRegister(formData.email, formData.password, `${formData.name} ${formData.familyName}`.trim());
      navigate(`/${ROUTES.MY_RISKS}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: "calc(env(safe-area-inset-top) + 2rem)", md: "calc(env(safe-area-inset-top) + 4rem)" },
        pb: { xs: "calc(env(safe-area-inset-bottom) + 2rem)", md: "calc(env(safe-area-inset-bottom) + 4rem)" },
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "25rem",
          p: { xs: 3, md: 4 },
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
            label="Vorname"
            name="name"
            autoComplete="given-name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            required
            size="small"
            fullWidth
            label="Nachname"
            name="familyName"
            autoComplete="family-name"
            value={formData.familyName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            size="small"
            fullWidth
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputProps={{ inputMode: "email" }}
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={formData.receiveUpdates} onChange={handleChange} name="receiveUpdates" />}
            label="Ich möchte Updates per Email erhalten."
            sx={{ mb: 2 }}
          />
          <Button
            disabled={!formData.email || !formData.password || !formData.name || !formData.familyName || isSubmitting}
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
    </Box>
  );
};
