import cover from "../../assests/imgs/desert_1-min.png";
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Link, Typography} from "@mui/material";
import { Trans } from "react-i18next";
import {getDownloadURL, getStorage, ref} from "firebase/storage";

export const Banner = () => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const storage = getStorage();
        const pdfRef = ref(
            storage,
            "slides/Präsentation Seniorenkolleg Uni Leipzig 24.04.25.pdf"
        );
        getDownloadURL(pdfRef)
            .then((url) => setPdfUrl(url))
            .catch((error) =>
                console.error("Fehler beim Laden der PDF-URL:", error)
            );
    }, []);

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
            {/*<Typography*/}
            {/*    variant="body1"*/}
            {/*    color="black"*/}
            {/*    sx={{ pl: { xs: 2, md: 10 }}}*/}
            {/*>*/}
            {/*    Foliensatz{" "}*/}
            {/*    {pdfUrl ? (*/}
            {/*        <Link*/}
            {/*            href={pdfUrl}*/}
            {/*            target="_blank"*/}
            {/*            rel="noopener noreferrer"*/}
            {/*            underline="hover"*/}
            {/*            sx={{ fontWeight: "bold" }}>*/}
            {/*            hier*/}
            {/*        </Link>*/}
            {/*    ) : (*/}
            {/*        "lädt..."*/}
            {/*    )}{" "}*/}
            {/*    herunterladen*/}
            {/*</Typography>*/}
        </Box>
    );
};
