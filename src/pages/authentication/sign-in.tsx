import {Button, Card, Container, Divider, TextField, Typography,} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useEffect} from "react";
// @ts-ignore
import Logo from "../../assests/imgs/logo.png";
import Background from "../../assests/imgs/login.jpg";
import "./style.scss";
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
import {fetchAssesments} from "../../store/slices/credit-assesment/thunks";

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
                dispatch(fetchAssesments(auth.currentUser?.uid!));
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
                dispatch(fetchAssesments(auth.currentUser?.uid!));
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
        <div className="sign-in-card">
            <Card>
                <Grid container>
                    {/*<Grid size={6} style={{backgroundColor: "#1F271B"}}>*/}
                    <Grid size={6} style={{ backgroundImage: `url(${Background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div
                            style={{display: "flex", alignItems: "center", padding: "20px"}}>
                            <img
                                src={Logo}
                                alt="logo"
                                style={{height: "30px", width: "39px", marginRight: "20px"}}
                            />
                            <Typography variant="body1" style={{color: "black"}}>
                                <Trans i18nKey={"sign_in.we_make_risks_tradeable"}/>
                            </Typography>
                        </div>
                    </Grid>

                    <Grid size={6} style={{padding: "20px"}}>
                        <Grid container>
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

                            <Container style={{maxWidth: "400px"}}>
                                <Grid size={12} textAlign="center">
                                    <TextField
                                        InputProps={{
                                            style: {
                                                fontSize: "14px",
                                            },
                                        }}
                                        autoComplete="email"
                                        placeholder="max.mustermann@email.de"
                                        variant="outlined"
                                        name="Email"
                                        size="small"
                                        style={{marginTop: "20px"}}
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={12} textAlign="center">
                                    <TextField
                                        InputProps={{
                                            style: {
                                                fontSize: "14px",
                                            },
                                        }}
                                        autoComplete="current-password"
                                        variant="outlined"
                                        name="Passwort"
                                        size="small"
                                        type="password"
                                        style={{marginTop: "20px"}}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={12} textAlign="center">
                                    <Button
                                        variant="contained"
                                        style={{color: "white", marginTop: "10px"}}
                                        fullWidth
                                        onClick={signIn}
                                    >
                                        <Trans i18nKey={"sign_in.SignIn"}/>
                                    </Button>
                                </Grid>

                                <Divider style={{marginTop: "10px", marginBottom: "10px"}}>
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
                                    style={{textAlign: "center", marginTop: "10px"}}
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
        </div>
    );
};


