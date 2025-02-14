import React from "react";
import Grid from "@mui/material/Grid2";
import Logo from "../../assests/imgs/logo.png";
import {Chip, Divider, Typography} from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Footer = () => {

    const navigate = useNavigate();
    
    const goToFAQ = () => {
        navigate("/landingpage");
        setTimeout(() => {
          document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToProduct = () => {
        navigate("/product");
        setTimeout(() => {
          document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToProductPricing = () => {
        navigate("/product");
        setTimeout(() => {
          document.getElementById("price")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToProductOverview = () => {
        navigate("/product");
        setTimeout(() => {
          document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToProductBrowse = () => {
        navigate("/product");
        setTimeout(() => {
          document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToProductAccessibility = () => {
        navigate("/product");
        setTimeout(() => {
          document.getElementById("accessibility")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSolutions = () => {
        navigate("/solutions");
        setTimeout(() => {
          document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSolutionsBrainstroming = () => {
        navigate("/solutions");
        setTimeout(() => {
          document.getElementById("brainstroming")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSolutionsIdeation = () => {
        navigate("/solutions");
        setTimeout(() => {
          document.getElementById("ideation")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSolutionsWireframing = () => {
        navigate("/solutions");
        setTimeout(() => {
          document.getElementById("wireframing")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSolutionsResearch = () => {
        navigate("/solutions");
        setTimeout(() => {
          document.getElementById("research")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToResources = () => {
        navigate("/resources");
        setTimeout(() => {
          document.getElementById("resource")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToResourcesHelpCenter = () => {
        navigate("/resources");
        setTimeout(() => {
          document.getElementById("help_center")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToResourcesBlog = () => {
        navigate("/resources");
        setTimeout(() => {
          document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToResourcesTutorials = () => {
        navigate("/resources");
        setTimeout(() => {
          document.getElementById("tutorials")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSupport = () => {
        navigate("/support");
        setTimeout(() => {
          document.getElementById("support")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSupportContactUs = () => {
        navigate("/contact");
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSupportDevelopers = () => {
        navigate("/support");
        setTimeout(() => {
          document.getElementById("developers")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSupportDocumentation = () => {
        navigate("/support");
        setTimeout(() => {
          document.getElementById("documentation")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToSupportIntegrations = () => {
        navigate("/support");
        setTimeout(() => {
          document.getElementById("integrations")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToCompany = () => {
        navigate("/company");
        setTimeout(() => {
          document.getElementById("company")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToCompanyAboutUs = () => {
        navigate("/about");
        setTimeout(() => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToCompanyPress = () => {
        navigate("/company");
        setTimeout(() => {
          document.getElementById("press")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToCompanyEvents = () => {
        navigate("/company");
        setTimeout(() => {
          document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToCompanyRequestDemo = () => {
        navigate("/company");
        setTimeout(() => {
          document.getElementById("request_demo")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToPrivacy = () => {
        navigate("/privacy");
        setTimeout(() => {
          document.getElementById("privacy")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToImprint = () => {
        navigate("/imprint");
        setTimeout(() => {
          document.getElementById("imprint")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };

    const goToTerms = () => {
        navigate("/terms");
        setTimeout(() => {
          document.getElementById("terms")?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to allow page transition
    };


    return (
        <React.Fragment>
            <Grid container style={{backgroundColor: "#1F271B", padding: "60px 80px 100px 80px"}}>
                <Grid size={2}>
                    <img src={Logo} style={{width: "60px", height: "50px"}} alt="logo"/>
                </Grid>
                <Grid size={2}>
                    <Typography 
                        color="white" 
                        variant="h6" 
                        component={Link}
                        to="/product"
                        onClick={goToProduct}
                        sx={{ textDecoration: 'none' }}>
                        Product
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/product"
                        onClick={goToProductPricing}
                        sx={{ textDecoration: 'none' }}>
                        Pricing
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/product"
                        onClick={goToProductOverview}
                        sx={{ textDecoration: 'none' }}>
                        Overview
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/product"
                        onClick={goToProductBrowse}
                        sx={{ textDecoration: 'none' }}>
                        Browse
                    </Typography>
                    <br />
                    <br />
                    <div style={{display: "flex", alignItems: "center"}}>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/product"
                        onClick={goToProductAccessibility}
                        sx={{ textDecoration: 'none' }}>
                        Accessibility
                    </Typography> &nbsp; &nbsp;
                        <Chip label="BETA" color="primary" size="small" style={{borderRadius: "3px", color: "black"}}/>
                    </div>

                </Grid>
                <Grid size={2}>
                    <Typography 
                        color="white" 
                        variant="h6" 
                        component={Link}
                        to="/solutions"
                        onClick={goToSolutions}
                        sx={{ textDecoration: 'none' }}>
                        Solutions
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/solutions"
                        onClick={goToSolutionsBrainstroming}
                        sx={{ textDecoration: 'none' }}>
                        Brainstroming
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/solutions"
                        onClick={goToSolutionsIdeation}
                        sx={{ textDecoration: 'none' }}>
                        Ideation
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/solutions"
                        onClick={goToSolutionsWireframing}
                        sx={{ textDecoration: 'none' }}>
                        Wireframing
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/solutions"
                        onClick={goToSolutionsResearch}
                        sx={{ textDecoration: 'none' }}>
                        Research
                    </Typography>
                </Grid>
                <Grid size={2}>
                    <Typography 
                        color="white" 
                        variant="h6" 
                        component={Link}
                        to="/resources"
                        onClick={goToResources}
                        sx={{ textDecoration: 'none' }}>
                        Resources
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/resources"
                        onClick={goToResourcesHelpCenter}
                        sx={{ textDecoration: 'none' }}>
                        Help Center
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/resources"
                        onClick={goToResourcesBlog}
                        sx={{ textDecoration: 'none' }}>
                        Blog
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/resources"
                        onClick={goToResourcesTutorials}
                        sx={{ textDecoration: 'none' }}>
                        Tutorials
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/landingpage#faq"
                        onClick={goToFAQ}
                        sx={{ textDecoration: 'none' }}>
                        FAQs
                    </Typography>
                </Grid>
                <Grid size={2}>
                <Typography 
                        color="white" 
                        variant="h6" 
                        component={Link}
                        to="/support"
                        onClick={goToSupport}
                        sx={{ textDecoration: 'none' }}>
                        Support
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="contact"
                        onClick={goToSupportContactUs}
                        sx={{ textDecoration: 'none' }}>
                        Contact Us
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/support"
                        onClick={goToSupportDevelopers}
                        sx={{ textDecoration: 'none' }}>
                        Developers
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/support"
                        onClick={goToSupportDocumentation}
                        sx={{ textDecoration: 'none' }}>
                        Documentation
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/support"
                        onClick={goToSupportIntegrations}
                        sx={{ textDecoration: 'none' }}>
                        Integrations
                    </Typography>
                </Grid>
                <Grid size={2}>
                    <Typography 
                        color="white" 
                        variant="h6" 
                        component={Link}
                        to="/company"
                        onClick={goToCompany}
                        sx={{ textDecoration: 'none' }}>
                        Company
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="about"
                        onClick={goToCompanyAboutUs}
                        sx={{ textDecoration: 'none' }}>
                        About
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/company"
                        onClick={goToCompanyPress}
                        sx={{ textDecoration: 'none' }}>
                        Press
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/company"
                        onClick={goToCompanyEvents}
                        sx={{ textDecoration: 'none' }}>
                        Events
                    </Typography>
                    <br />
                    <br />
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="/company"
                        onClick={goToCompanyRequestDemo}
                        sx={{ textDecoration: 'none' }}>
                        Request Demo
                    </Typography>
                </Grid>
                <Grid size={12} style={{marginTop: "50px"}}>
                    <Divider color="white"/>
                </Grid>
                <Grid size={6} style={{marginTop: "20px"}}>
                    <Typography color="white">© {new Date().getFullYear()} xRisk AG (iG)</Typography>
                </Grid>
                <Grid size={6} display="flex" justifyContent="right" style={{marginTop: "20px"}}>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="imprint"
                        onClick={goToImprint}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        Imprint
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="terms"
                        onClick={goToTerms}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        Terms
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="privacy"
                        onClick={goToPrivacy}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        Privacy
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="support"
                        onClick={goToSupport}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        Support
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="about"
                        onClick={goToCompanyAboutUs}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        About
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="contact"
                        onClick={goToSupportContactUs}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        Contact
                    </Typography>
                    <LinkedInIcon style={{color: "white", marginLeft: "10px", marginRight: "10px"}}/>
                    <XIcon style={{color: "white", marginLeft: "10px", marginRight: "10px"}}/>
                </Grid>
            </Grid>

        </React.Fragment>

    )
}
