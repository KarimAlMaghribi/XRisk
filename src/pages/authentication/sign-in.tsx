import {Button, Card, TextField, Typography} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
// @ts-ignore
import Logo from "../../assests/imgs/logo_white.png";
import "./style.scss";
import {theme} from "../../theme";

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
                                <Typography variant="caption">Nutze deine Email Adresse zur Erstellung</Typography>
                            </Grid>

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
                                />
                            </Grid>

                            <Grid size={12} textAlign="center">
                                <Button variant="contained" style={{color: "white", marginTop: "10px"}}>
                                    Sign up with email
                                </Button>
                            </Grid>


                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </div>

    )
}
