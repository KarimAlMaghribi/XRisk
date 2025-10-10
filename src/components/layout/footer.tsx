import React from "react";
import Grid from "@mui/material/Grid2";
import Logo from "../../assests/imgs/logo.png";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { To } from "react-router-dom";
import type { SxProps, Theme } from "@mui/material/styles";

import { useTranslation, Trans } from "react-i18next";
// i18n als Side-Effect laden (vermeidet "unused import")
import "../../utils/i18n";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Typisierter Helper: Route + optionales Scrollziel
  const goTo = (path: To, anchorId?: string): (() => void) => {
    return () => {
      navigate(path);
      window.setTimeout(() => {
        if (anchorId) {
          document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
    };
  };

  // Ziele
  const goToFAQ = goTo("/landingpage", "faq");

  const goToProduct = goTo("/product", "product");
  const goToProductPricing = goTo("/product", "price");
  const goToProductOverview = goTo("/product", "overview");
  const goToProductBrowse = goTo("/product", "browse");
  const goToProductAccessibility = goTo("/product", "accessibility");

  const goToSolutions = goTo("/solutions", "solution");
  const goToSolutionsBrainstroming = goTo("/solutions", "brainstroming");
  const goToSolutionsIdeation = goTo("/solutions", "ideation");
  const goToSolutionsWireframing = goTo("/solutions", "wireframing");
  const goToSolutionsResearch = goTo("/solutions", "research");

  const goToResources = goTo("/resources", "resource");
  const goToResourcesHelpCenter = goTo("/resources", "help_center");
  const goToResourcesBlog = goTo("/resources", "blog");
  const goToResourcesTutorials = goTo("/resources", "tutorials");

  const goToSupport = goTo("/support", "support");
  const goToSupportContactUs = goTo("/contact", "contact");
  const goToSupportDevelopers = goTo("/support", "developers");
  const goToSupportDocumentation = goTo("/support", "documentation");
  const goToSupportIntegrations = goTo("/support", "integrations");

  const goToCompany = goTo("/company", "company");
  const goToCompanyAboutUs = goTo("/about", "about");
  const goToCompanyPress = goTo("/company", "press");
  const goToCompanyEvents = goTo("/company", "events");
  const goToCompanyRequestDemo = goTo("/company", "request_demo");

  const goToPrivacy = goTo("/privacy", "privacy");
  const goToImprint = goTo("/imprint", "imprint");
  const goToTerms = goTo("/terms", "terms");

  const year = new Date().getFullYear();

  const linkSx: SxProps<Theme> = {
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
    color: "white"
  };

  return (
      <React.Fragment>
        <Grid
            container
            sx={{
              backgroundColor: "#1F271B",
              px: { xs: "1rem", sm: "5rem" },
              pt: { xs: "2.5rem", sm: "3.75rem" },
              pb: {
                xs: "calc(2.5rem + env(safe-area-inset-bottom))",
                sm: "calc(6.25rem + env(safe-area-inset-bottom))"
              }
            }}
            // Einfach gehalten (konstant), um Versionsunterschiede zu vermeiden
            spacing={4}
        >
          {/* Logo */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                  src={Logo}
                  alt={t("brand.logoAlt", "xRisk Logo")}
                  style={{ width: 60, height: 50, objectFit: "contain" }}
              />
            </Box>
          </Grid>

          {/* Product */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography
                variant="h6"
                component={RouterLink}
                to="/product"
                onClick={goToProduct}
                sx={linkSx}
            >
              <Trans i18nKey="footer.product" />
            </Typography>

            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Typography variant="body2" component={RouterLink} to="/product" onClick={goToProductPricing} sx={linkSx}>
                <Trans i18nKey="footer.pricing" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/product" onClick={goToProductOverview} sx={linkSx}>
                <Trans i18nKey="footer.overview" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/product" onClick={goToProductBrowse} sx={linkSx}>
                <Trans i18nKey="footer.browse" />
              </Typography>

              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" component={RouterLink} to="/product" onClick={goToProductAccessibility} sx={linkSx}>
                  <Trans i18nKey="footer.accessibility" />
                </Typography>
                <Chip label="BETA" color="primary" size="small" sx={{ borderRadius: "3px", color: "black", height: 20 }} />
              </Box>
            </Stack>
          </Grid>

          {/* Solutions */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" component={RouterLink} to="/solutions" onClick={goToSolutions} sx={linkSx}>
              <Trans i18nKey="footer.solutions" />
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Typography variant="body2" component={RouterLink} to="/solutions" onClick={goToSolutionsBrainstroming} sx={linkSx}>
                <Trans i18nKey="footer.brainstroming" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/solutions" onClick={goToSolutionsIdeation} sx={linkSx}>
                <Trans i18nKey="footer.ideation" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/solutions" onClick={goToSolutionsWireframing} sx={linkSx}>
                <Trans i18nKey="footer.wireframing" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/solutions" onClick={goToSolutionsResearch} sx={linkSx}>
                <Trans i18nKey="footer.research" />
              </Typography>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" component={RouterLink} to="/resources" onClick={goToResources} sx={linkSx}>
              <Trans i18nKey="footer.resources" />
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Typography variant="body2" component={RouterLink} to="/resources" onClick={goToResourcesHelpCenter} sx={linkSx}>
                <Trans i18nKey="footer.help_center" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/resources" onClick={goToResourcesBlog} sx={linkSx}>
                <Trans i18nKey="footer.blog" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/resources" onClick={goToResourcesTutorials} sx={linkSx}>
                <Trans i18nKey="footer.tutorials" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/landingpage#faq" onClick={goToFAQ} sx={linkSx}>
                <Trans i18nKey="footer.faqs" />
              </Typography>
            </Stack>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" component={RouterLink} to="/support" onClick={goToSupport} sx={linkSx}>
              <Trans i18nKey="footer.support" />
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Typography variant="body2" component={RouterLink} to="/contact" onClick={goToSupportContactUs} sx={linkSx}>
                <Trans i18nKey="footer.contact_us" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/support" onClick={goToSupportDevelopers} sx={linkSx}>
                <Trans i18nKey="footer.developers" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/support" onClick={goToSupportDocumentation} sx={linkSx}>
                <Trans i18nKey="footer.documentation" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/support" onClick={goToSupportIntegrations} sx={linkSx}>
                <Trans i18nKey="footer.integrations" />
              </Typography>
            </Stack>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" component={RouterLink} to="/company" onClick={goToCompany} sx={linkSx}>
              <Trans i18nKey="footer.company" />
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Typography variant="body2" component={RouterLink} to="/about" onClick={goToCompanyAboutUs} sx={linkSx}>
                <Trans i18nKey="footer.about" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/company" onClick={goToCompanyPress} sx={linkSx}>
                <Trans i18nKey="footer.press" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/company" onClick={goToCompanyEvents} sx={linkSx}>
                <Trans i18nKey="footer.events" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/company" onClick={goToCompanyRequestDemo} sx={linkSx}>
                <Trans i18nKey="footer.request_demo" />
              </Typography>
            </Stack>
          </Grid>

          {/* Divider */}
          <Grid size={12} sx={{ mt: { xs: 2, md: 6 } }}>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.24)" }} />
          </Grid>

          {/* Bottom row */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 2 }}>
            <Typography color="white">© {year} xrisk Schweiz AG</Typography>
          </Grid>

          <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" }
              }}
          >
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" alignItems="center">
              <Typography variant="body2" component={RouterLink} to="/imprint" onClick={goToImprint} sx={linkSx}>
                <Trans i18nKey="footer.imprint" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/terms" onClick={goToTerms} sx={linkSx}>
                <Trans i18nKey="footer.terms" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/privacy" onClick={goToPrivacy} sx={linkSx}>
                <Trans i18nKey="footer.privacy" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/support" onClick={goToSupport} sx={linkSx}>
                <Trans i18nKey="footer.support" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/about" onClick={goToCompanyAboutUs} sx={linkSx}>
                <Trans i18nKey="footer.about" />
              </Typography>
              <Typography variant="body2" component={RouterLink} to="/contact" onClick={goToSupportContactUs} sx={linkSx}>
                <Trans i18nKey="footer.contact_us" />
              </Typography>

              <IconButton
                  component="a"
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("a11y.linkedin", "LinkedIn")}
                  sx={{ color: "white" }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                  component="a"
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("a11y.x", "X / Twitter")}
                  sx={{ color: "white" }}
              >
                <XIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </React.Fragment>
  );
};
