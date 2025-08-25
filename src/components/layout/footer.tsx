import React from "react";
import Grid from "@mui/material/Grid2";
import Logo from "../../assests/imgs/logo.png";
import {Chip, Divider, Typography} from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useTranslation, Trans } from 'react-i18next';
import i18n from "../../utils/i18n";

export const Footer = () => {

    const { t } = useTranslation();

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
            <Grid
                container
                sx={{
                    backgroundColor: "#1F271B",
                    p: { xs: "2.5rem 1rem", sm: "3.75rem 5rem 6.25rem" },
                    pb: {
                        xs: "calc(2.5rem + env(safe-area-inset-bottom))",
                        sm: "calc(6.25rem + env(safe-area-inset-bottom))",
                    },
                }}>
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
                        <Trans i18nKey="footer.product"></Trans>
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
                        <Trans i18nKey="footer.pricing"></Trans>
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
                        <Trans i18nKey="footer.overview"></Trans>
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
                        <Trans i18nKey="footer.browse"></Trans>
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
                        <Trans i18nKey="footer.accessibility"></Trans>
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
                        <Trans i18nKey="footer.solutions"></Trans>
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
                        <Trans i18nKey="footer.brainstroming"></Trans>
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
                        <Trans i18nKey="footer.ideation"></Trans>
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
                        <Trans i18nKey="footer.wireframing"></Trans>
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
                        <Trans i18nKey="footer.research"></Trans>
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
                        <Trans i18nKey="footer.resources"></Trans>
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
                        <Trans i18nKey="footer.help_center"></Trans>
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
                        <Trans i18nKey="footer.blog"></Trans>
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
                        <Trans i18nKey="footer.tutorials"></Trans>
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
                        <Trans i18nKey="footer.faqs"></Trans>
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
                        <Trans i18nKey="footer.support"></Trans>
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
                        <Trans i18nKey="footer.contact_us"></Trans>
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
                        <Trans i18nKey="footer.developers"></Trans>
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
                        <Trans i18nKey="footer.documentation"></Trans>
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
                        <Trans i18nKey="footer.integrations"></Trans>
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
                        <Trans i18nKey="footer.company"></Trans>
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
                        <Trans i18nKey="footer.about"></Trans>
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
                        <Trans i18nKey="footer.press"></Trans>
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
                        <Trans i18nKey="footer.events"></Trans>
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
                        <Trans i18nKey="footer.request_demo"></Trans>
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
                        <Trans i18nKey="footer.imprint"></Trans>
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="terms"
                        onClick={goToTerms}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <Trans i18nKey="footer.terms"></Trans>
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="privacy"
                        onClick={goToPrivacy}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <Trans i18nKey="footer.privacy"></Trans>
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="support"
                        onClick={goToSupport}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <Trans i18nKey="footer.support"></Trans>
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="about"
                        onClick={goToCompanyAboutUs}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <Trans i18nKey="footer.about"></Trans>
                    </Typography>
                    <Typography 
                        color="white" 
                        variant="body2" 
                        component={Link}
                        to="contact"
                        onClick={goToSupportContactUs}
                        sx={{ textDecoration: 'none' }}
                        style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <Trans i18nKey="footer.contact_us"></Trans>
                    </Typography>
                    <LinkedInIcon style={{color: "white", marginLeft: "10px", marginRight: "10px"}}/>
                    <XIcon style={{color: "white", marginLeft: "10px", marginRight: "10px"}}/>
                </Grid>
            </Grid>

        </React.Fragment>

    )
}
