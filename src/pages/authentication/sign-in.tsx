import { Button, Card, Container, TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
// @ts-ignore
import Logo from "../../assests/imgs/logo.png";
import Background from "../../assests/imgs/login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routing/routes";
import { useSnackbarContext } from "../../components/snackbar/custom-snackbar";
import { Trans } from "react-i18next";
import { useSession } from "../../auth/useSession";

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { showSnackbar } = useSnackbarContext();
  const { doLogin } = useSession();

  const signIn = async () => {
    setIsSubmitting(true);
    try {
      await doLogin(email, password);
      navigate(`/${ROUTES.MY_RISKS}`);
    } catch (error) {
      showSnackbar(
        "Login fehlgeschlagen!",
        "Email oder Passwort sind falsch.",
        { vertical: "top", horizontal: "center" },
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        pt: "calc(env(safe-area-inset-top) + 2rem)",
        pb: "calc(env(safe-area-inset-bottom) + 2rem)",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: "56.25rem", mx: "auto" }}>
        <Grid container>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundImage: `url(${Background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", p: 2.5 }}>
              <Box
                component="img"
                src={Logo}
                alt="logo"
                sx={{ height: "2rem", width: "2.5rem", mr: 2.5 }}
              />
              <Typography variant="body1" color="text.primary">
                <Trans i18nKey={"sign_in.we_make_risks_tradeable"} />
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid size={12} textAlign="center">
                <Typography variant="h6">
                  <Trans i18nKey={"sign_in.signin_text"} />
                </Typography>
              </Grid>

              <Grid size={12} textAlign="center">
                <Typography variant="caption">
                  <Trans i18nKey={"sign_in.use_email_and_password"} />
                </Typography>
              </Grid>

              <Container sx={{ maxWidth: "25rem", mx: "auto" }}>
                <Grid size={12} textAlign="center">
                  <TextField
                    InputProps={{
                      sx: {
                        fontSize: "0.875rem",
                      },
                    }}
                    autoComplete="email"
                    placeholder="max.mustermann@email.de"
                    variant="outlined"
                    name="Email"
                    size="small"
                    sx={{ mt: 2.5 }}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid size={12} textAlign="center">
                  <TextField
                    InputProps={{
                      sx: {
                        fontSize: "0.875rem",
                      },
                    }}
                    autoComplete="current-password"
                    variant="outlined"
                    name="Passwort"
                    size="small"
                    type="password"
                    sx={{ mt: 2.5 }}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid size={12} textAlign="center">
                  <Button
                    variant="contained"
                    sx={{ color: "white", mt: 1.25 }}
                    fullWidth
                    onClick={signIn}
                    disabled={isSubmitting}
                  >
                    <Trans i18nKey={"sign_in.SignIn"} />
                  </Button>
                </Grid>

                <Typography
                  variant="subtitle2"
                  sx={{ textAlign: "center", mt: 1.25 }}
                >
                  <Trans i18nKey={"sign_in.registration_text_1"} />{" "}
                  <Link to={`/${ROUTES.TERMS}`}>
                    <Trans i18nKey={"sign_in.conditions"} />
                  </Link>{" "}
                  <Trans i18nKey={"sign_in.and_our"} />
                  <Link to={`/${ROUTES.PRIVACY}`}>
                    <Trans i18nKey={"sign_in.data_protection_guidelines"} />
                  </Link>{" "}
                  <Trans i18nKey={"sign_in.to"} />.
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
