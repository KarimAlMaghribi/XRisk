import {IconButton, Tooltip} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";

export const InfoTooltip = (props: {title: string}) => (
    <Tooltip title={props.title}>
        <IconButton><InfoIcon /></IconButton>
    </Tooltip>
);
