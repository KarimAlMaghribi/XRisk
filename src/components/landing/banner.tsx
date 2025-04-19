import cover from "../../assests/imgs/desert_1-min.png";
import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

export const Banner = () => {
    return (
        <Box
            sx={{
                backgroundImage: `url(${cover})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "70vh",
                position: "relative", // Enable absolute positioning inside
            }}
        >
            <Typography
                variant="h2"
                color="black"
                sx={{
                    width: { xs: "90%", md: "40%" },
                    pt: { xs: 10, md: 25 }, // responsive padding
                    pl: { xs: 2, md: 10 },
                    fontSize: { xs: "1.5rem", md: "2.5rem" },
                }}
            >
                <b><Trans i18nKey="homepage.figure_text" /></b>
            </Typography>

            <Typography
                variant="h4"
                color="black"
                sx={{
                    width: { xs: "90%", md: "40%" },
                    pl: { xs: 2, md: 10 },
                    fontSize: { xs: "1rem", md: "1.5rem" },
                }}
            >
                <Trans i18nKey="homepage.figure_text2" />
            </Typography>
        </Box>
    );
};
