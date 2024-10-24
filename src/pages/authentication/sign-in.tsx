import {Button, Card, Container, Divider, TextField, Typography} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
// @ts-ignore
import Logo from "../../assests/imgs/logo_white.png";
import "./style.scss";
import {theme} from "../../theme";
import GoogleIcon from '@mui/icons-material/Google';

export const SignIn = () => {
    const [email, setEmail] = React.useState<string>("");

    return (
        <div className="sign-in-card">
            <Card>
                <Grid container>
                    <Grid size={6} style={{backgroundColor: theme.palette.primary.main}}>
                        <div style={{display: "flex", alignItems: "center", padding: "20px"}}>
                            <img src={Logo} alt="logo" style={{height: "30px", width: "39px", marginRight: "20px"}}/>
                            <Typography variant="body1" style={{color: "white"}}>
                                Wir machen Risiken handelbar
                            </Typography>
                        </div>
                    </Grid>

                    <Grid size={6} style={{padding: "20px"}}>
                        <Grid container>
                            <Grid size={12} textAlign="right">
                                <Button style={{color: "black"}}>Sign In</Button>
                            </Grid>

                            <Grid size={12} textAlign="center">
                                <Typography variant="h6">Erstelle ein Konto</Typography>
                            </Grid>

                            <Grid size={12} textAlign="center">
                                <Typography variant="caption">Nutze deine Email zur Kontoerstellung</Typography>
                            </Grid>

                            <Container style={{maxWidth: "400px"}}>
                                <Grid size={12} textAlign="center">
                                    <TextField
                                        InputProps={{
                                            style: {
                                                fontSize: '14px'
                                            },
                                        }}
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
                                    <Button variant="contained" style={{color: "white", marginTop: "10px"}} fullWidth>
                                        Registrierung Email
                                    </Button>
                                </Grid>

                                <Divider style={{marginTop: "10px", marginBottom: "10px"}}><Typography
                                    variant="subtitle2" color="textSecondary">ODER REGISTRIERE DICH
                                    MIT</Typography></Divider>

                                <Button variant="outlined" startIcon={<GoogleIcon/>} fullWidth>
                                    Google
                                </Button>

                                <Typography variant="subtitle2" style={{textAlign: "center", marginTop: "10px"}}>
                                    Durch Registrierung, stimmst du automatisch unseren <a href="">AGBs</a> und
                                    unseren <a href="">Datenschutzrichtlinien</a> zu.
                                </Typography>

                            </Container>


                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </div>

    )
}
