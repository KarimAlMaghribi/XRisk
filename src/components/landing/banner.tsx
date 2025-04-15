import cover from "../../assests/imgs/desert_1-min.png";
import React from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import { Trans } from "react-i18next";

export const Banner = () => {
        return (
            <Box
                sx={{
                    backgroundImage:`url(${cover})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "70vh"
                }}>
                <Typography
                    variant="h2"
                    color="black"
                    style={{width: "40%", paddingTop: "200px", paddingLeft: "100px"}}>
                    <b><Trans i18nKey="homepage.figure_text" /></b>
                </Typography>
                

                <Typography
                    variant="h4"
                    color="black"
                    style={{width: "40%", paddingLeft: "100px"}}>
                    <Trans i18nKey="homepage.figure_text2" />
                </Typography>
                <Typography
                    variant="h2"
                    className="rubber"
                    color="white"
                    sx={{
                        position: "absolute",
                        bottom: 550,
                        right: 20,
                        m: 2,
                      }}
                    style={{width: "40%", paddingTop: "20", paddingLeft: "20px"}}>
                    <b><Trans i18nKey="homepage.rubber_stamp" /></b>
                </Typography>
            </Box>
        )


}
