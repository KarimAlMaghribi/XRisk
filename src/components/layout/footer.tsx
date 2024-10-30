import React from "react";
import Grid from "@mui/material/Grid2";
import Logo from "../../assests/imgs/logo.png";
import {Chip, Divider, Typography} from "@mui/material";

export const Footer = () => {
    return (
        <React.Fragment>
            <Grid container style={{backgroundColor: "#1F271B", padding: "60px 80px 400px 80px"}}>
                <Grid size={2}>
                    <img src={Logo} style={{width: "60px", height: "60px"}}/>
                </Grid>
                <Grid size={2}>
                    <Typography variant="h6" color="white">Product</Typography>
                    <br />
                    <Typography color="white" variant="body2">Pricing</Typography>
                    <br />
                    <Typography color="white" variant="body2">Overview</Typography>
                    <br />
                    <Typography color="white" variant="body2">Browse</Typography>
                    <br />
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Typography color="white" variant="body2">Accessibility</Typography> &nbsp; &nbsp;
                        <Chip label="BETA" color="primary" size="small" style={{borderRadius: "3px", color: "black"}}/>
                    </div>

                </Grid>
                <Grid size={2}>
                    <Typography variant="h6" color="white">Solutions</Typography>
                    <br />
                    <Typography color="white" variant="body2">Brainstorming</Typography>
                    <br />
                    <Typography color="white" variant="body2">Ideation</Typography>
                    <br />
                    <Typography color="white" variant="body2">Wireframing</Typography>
                    <br />
                    <Typography color="white" variant="body2">Research</Typography>
                </Grid>
                <Grid size={2}>
                    <Typography variant="h6" color="white">Resources</Typography>
                    <br />
                    <Typography color="white" variant="body2">Help Center</Typography>
                    <br />
                    <Typography color="white" variant="body2">Blog</Typography>
                    <br />
                    <Typography color="white" variant="body2">Tutorials</Typography>
                    <br />
                    <Typography color="white" variant="body2">FAQs</Typography>
                </Grid>
                <Grid size={2}>
                    <Typography variant="h6" color="white">Support</Typography>
                    <br />
                    <Typography color="white" variant="body2">Contact Us</Typography>
                    <br />
                    <Typography color="white" variant="body2">Developers</Typography>
                    <br />
                    <Typography color="white" variant="body2">Documentation</Typography>
                    <br />
                    <Typography color="white" variant="body2">Integrations</Typography>
                </Grid>
                <Grid size={2}>
                    <Typography variant="h6" color="white">Company</Typography>
                    <br />
                    <Typography color="white" variant="body2">About</Typography>
                    <br />
                    <Typography color="white" variant="body2">Press</Typography>
                    <br />
                    <Typography color="white" variant="body2">Events</Typography>
                    <br />
                    <Typography color="white" variant="body2">Request Demo</Typography>
                </Grid>
            </Grid>
            <Divider color="primary"/>
        </React.Fragment>

    )
}
