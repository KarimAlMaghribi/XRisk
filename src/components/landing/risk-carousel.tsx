import React from "react";
import Grid from "@mui/material/Grid2";
import RouteIcon from "@mui/icons-material/Route";
import GavelIcon from "@mui/icons-material/Gavel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import route from "../../assests/imgs/risk-examples/wings.jpg";
import process from "../../assests/imgs/risk-examples/process.jpg";
import event from "../../assests/imgs/risk-examples/event.jpg";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import IconButton from "@mui/material/IconButton";
import { theme } from "../../theme";
import { Trans, useTranslation } from "react-i18next";

interface RiskExample {
  img: string;
  title: string;
  icon: any;
}

const iconSx = { fontSize: { xs: 32, md: 50 } };
const riskExamples: RiskExample[] = [
  {
    title: "way",
    img: route,
    icon: <RouteIcon sx={iconSx} />,
  },
  {
    title: "process",
    img: process,
    icon: <GavelIcon sx={iconSx} />,
  },
  {
    title: "event",
    img: event,
    icon: <CalendarMonthIcon sx={iconSx} />,
  },
];

export const RiskElement = (props: RiskExample) => {
  return (
    <Card sx={{ textAlign: "center", cursor: "pointer" }} elevation={2}>
      <CardMedia
        sx={{ aspectRatio: '4/3', width: '100%' }}
        title={props.title}
        image={props.img}
      />

      <Box sx={{ my: { xs: 4, md: 7 } }}>{props.icon}</Box>

      <Typography gutterBottom variant="h5" component="div">
        {props.title}
      </Typography>
    </Card>
  );
};

export const RiskCarousel = () => {
  const orange = theme.palette.primary.main;
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        color="grey"
        sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}
      >
        <Trans i18nKey="homepage.middle_page_text" />{" "}
        <Box component="span" sx={{ color: orange }}>X</Box>RISK
      </Typography>
      <Typography
        variant="h3"
        sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
      >
        {i18n.language === "en" && (
          <b>
            <Box component="span" sx={{ color: orange }}>Offer your Risks</Box> now.
          </b>
        )}
        {i18n.language === "de" && (
          <b>
            Jetzt <Box component="span" sx={{ color: orange }}>mit Risiken handeln!</Box>
          </b>
        )}
      </Typography>
      <Typography
        variant="h5"
        color="black"
        sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
      >
        <Trans i18nKey="homepage.middle_page_text3"></Trans>
      </Typography>

      <Grid
        container
        sx={{
          my: { xs: 5, md: 12 },
          px: { xs: 2, md: 5 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid size={1} sx={{ textAlign: 'right' }}>
          <IconButton aria-label="previous">
            <KeyboardArrowLeftIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          </IconButton>
        </Grid>
        {riskExamples.map((riskExample: RiskExample) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
            key={riskExample.title}
            sx={{ m: { xs: 2, md: 5 } }}
          >
            <RiskElement
              img={riskExample.img}
              title={t(`homepage.${riskExample.title}_figure_text`)}
              icon={riskExample.icon}
            />
          </Grid>
        ))}
        <Grid size={1}>
          <IconButton aria-label="next">
            <KeyboardArrowRightIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          </IconButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
