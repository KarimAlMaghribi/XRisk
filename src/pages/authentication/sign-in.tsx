import {Button, Card, Container, Divider, TextField, Typography, Box} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useEffect} from "react";
// @ts-ignore
import Logo from "../../assests/imgs/logo.png";
import Background from "../../assests/imgs/login.jpg";
import GoogleIcon from '@mui/icons-material/Google';
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../../routing/routes";
import {signInWithEmail, signInWithGoogle, signOutUser} from "../../firebase/firebase-service";
import {auth} from "../../firebase_config";
import {checkUserProfileWithGoogle, fetchUserProfile} from "../../store/slices/user-profile/thunks";
import {AppDispatch, resetStore} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbarContext} from "../../components/snackbar/custom-snackbar";
import {fetchRisks} from "../../store/slices/risks/thunks";
import {fetchMyChats, fetchMyChatsWithDeletion} from "../../store/slices/my-bids/thunks";
import {Trans} from "react-i18next";
import {ProfileInformation} from "../../store/slices/user-profile/types";
import {selectLoadingStatus, selectProfileInformation} from "../../store/slices/user-profile/selectors";
import {FetchStatus} from "../../types/FetchStatus";
import {FetchStatusEnum} from "../../enums/FetchStatus.enum";
import {fetchAssessments} from "../../store/slices/credit-assesment/thunks";

export const SignIn = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const {showSnackbar} = useSnackbarContext();
    const profile: ProfileInformation | null = useSelector(selectProfileInformation);
    const loading: FetchStatus | undefined = useSelector(selectLoadingStatus);

    useEffect(() => {
        if (loading !== FetchStatusEnum.SUCCEEDED) return;

        if (profile && profile.deleted === true) {
            showSnackbar(
                "Dein Account wurde gelöscht!",
                "Dein Account wurde gelöscht. Bitte kontaktiere den Support, wenn du deinen Account wiederherstellen möchtest.",
                {vertical: "top", horizontal: "center"},
                "error"
            );
            signOutUser();
            dispatch(resetStore());
            localStorage.clear();
            sessionStorage.clear();
            return;
        }

        if (!profile) {
            showSnackbar(
                "Account nicht gefunden!",
                "Es scheint Probleme bei der Identifizierung deines Accounts zu geben. Bitte wende dich an den Support.",
                {vertical: "top", horizontal: "center"},
                "warning"
            );
            signOutUser();
            dispatch(resetStore());
            localStorage.clear();
            sessionStorage.clear();
            return;
        }

        if (auth.currentUser && profile && profile.deleted !== true) {
            navigate(`/${ROUTES.MY_RISKS}`);
        }
    }, [loading, auth.currentUser, profile, navigate, showSnackbar, dispatch]);

    const signIn = async () => {
        try {
            const user = await signInWithEmail(email, password);

            if (user?.refreshToken) {
                dispatch(fetchUserProfile());
                dispatch(fetchAssessments(auth.currentUser?.uid!));
                dispatch(fetchRisks());
                dispatch(fetchMyChatsWithDeletion());
            }
        } catch (error) {
            showSnackbar(
                "Login fehlgeschlagen!",
                "Email oder Passwort sind falsch.",
                {vertical: "top", horizontal: "center"},
                "error"
            );
        }
    };

    const signInGoogle = async () => {
        try {
            const user = await signInWithGoogle();
            dispatch(checkUserProfileWithGoogle(user))

            if (user?.refreshToken) {
                dispatch(fetchAssessments(auth.currentUser?.uid!));
                dispatch(fetchRisks())
                dispatch(fetchMyChatsWithDeletion());
            }
        } catch (error) {
            console.error(error)
            showSnackbar("Login fehlgeschlagen!", "Google konnte deine Anmeldedaten nicht verifizieren.", {
                vertical: "top",
                horizontal: "center"
            }, "error")
        }

    }

    return (
        <Box component="section" sx={{
            pt: 'calc(env(safe-area-inset-top) + 2rem)',
            pb: 'calc(env(safe-area-inset-bottom) + 2rem)',
            px: 2,
        }}>
            <Card sx={{maxWidth: '56.25rem', mx: 'auto'}}>
                <Grid container>
                    {/*<Grid size={6} style={{backgroundColor: "#1F271B"}}>*/}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <Box sx={{display: 'flex', alignItems: 'center', p: 2.5}}>
                            <Box component="img" src={Logo} alt="logo" sx={{height: '2rem', width: '2.5rem', mr: 2.5}}/>
                            <Typography variant="body1" color="text.primary">
                                <Trans i18nKey={"sign_in.we_make_risks_tradeable"}/>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }} sx={{p: 2.5}}>
                        <Grid container spacing={2}>
                            <Grid size={12} textAlign="center">
                                <Typography variant="h6">
                                    <Trans i18nKey={"sign_in.signin_text"}/>
                                </Typography>
                            </Grid>

                            <Grid size={12} textAlign="center">
                                <Typography variant="caption">
                                    <Trans i18nKey={"sign_in.use_email_and_password"}/>
                                </Typography>
                            </Grid>

                            <Container sx={{maxWidth: '25rem', mx: 'auto'}}>
                                <Grid size={12} textAlign="center">
                                    <TextField
                                        InputProps={{
                                            sx: {
                                                fontSize: '0.875rem',
                                            },
                                        }}
                                        autoComplete="email"
                                        placeholder="max.mustermann@email.de"
                                        variant="outlined"
                                        name="Email"
                                        size="small"
                    sx={{mt: 2.5}}
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={12} textAlign="center">
                                    <TextField
                                        InputProps={{
                                            sx: {
                                                fontSize: '0.875rem',
                                            },
                                        }}
                                        autoComplete="current-password"
                                        variant="outlined"
                                        name="Passwort"
                                        size="small"
                                        type="password"
                    sx={{mt: 2.5}}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={12} textAlign="center">
                                    <Button
                                        variant="contained"
                                        sx={{color: 'white', mt: 1.25}}
                                        fullWidth
                                        onClick={signIn}
                                    >
                                        <Trans i18nKey={"sign_in.SignIn"}/>
                                    </Button>
                                </Grid>

                                <Divider sx={{my: 1.25}}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        <Trans i18nKey={"sign_in.or_login_with"}/>
                                    </Typography>
                                </Divider>

                                <Button
                                    variant="outlined"
                                    startIcon={<GoogleIcon/>}
                                    fullWidth
                                    onClick={signInGoogle}
                                >
                                    Google
                                </Button>

                                <Typography
                                    variant="subtitle2"
                                    sx={{textAlign: 'center', mt: 1.25}}
                                >
                                    <Trans i18nKey={"sign_in.registration_text_1"}/>{" "}
                                    <Link to={`/${ROUTES.TERMS}`}>
                                        <Trans i18nKey={"sign_in.conditions"}/>
                                    </Link>{" "}
                                    <Trans i18nKey={"sign_in.and_our"}/>
                                    <Link to={`/${ROUTES.PRIVACY}`}>
                                        <Trans i18nKey={"sign_in.data_protection_guidelines"}/>
                                    </Link>{" "}
                                    <Trans i18nKey={"sign_in.to"}/>.
                                </Typography>
                            </Container>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};


