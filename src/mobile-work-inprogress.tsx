// src/components/MobileWorkInProgress.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import {Header} from "./components/layout/header";
import cover from "./assests/imgs/desert_1-min.png";

export const MobileWorkInProgress: React.FC = () => (
    <>
        <Header />
        <Box
            sx={{backgroundImage: `url(${cover})`}}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            p={2}>

            <Typography variant="h3" gutterBottom>
                🚧 Mobile-Ansicht in Arbeit
            </Typography>
            <Typography variant="h6">
                Diese Seite ist auf Mobilgeräten noch nicht verfügbar. Bitte nutzen Sie einen Desktop.
            </Typography>
        </Box>
    </>

);
