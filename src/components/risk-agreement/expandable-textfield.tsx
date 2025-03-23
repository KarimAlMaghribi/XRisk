import {Accordion, Box, Collapse, IconButton, InputAdornment, TextField, Tooltip, Typography,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestoreSharpIcon from "@mui/icons-material/RestoreSharp";
import React, {useEffect, useState} from "react";
import i18next from "i18next";
import { Trans } from "react-i18next";

export const ExpandableTextField = ({
                                        label,
                                        name,
                                        id,
                                        value,
                                        oldValue,
                                        borderColor,
                                        handlerFunction,
                                        inputProps,
                                    }: {
    label: string;
    name: string;
    id: string;
    value: unknown | string | number;
    oldValue: unknown | string | number;
    borderColor: string;
    handlerFunction: Function;
    inputProps?: object;
}) => {
    const [expanded, setExpanded] = useState(false);
    const [expand, setExpand] = useState(borderColor == "grey");

    useEffect(() => {
        if (borderColor === "grey") {
            setExpand(false);
        }
        if (borderColor === "red") {
            setExpand(true);
        }
    }, [borderColor]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleRestore = () => {
        handlerFunction(oldValue);
    };

    return (
        <>
            {!expand ? (
                <TextField
                    margin="dense"
                    fullWidth
                    name={name}
                    id={id}
                    onChange={(event) =>
                        handlerFunction((event.target as HTMLInputElement).value)
                    }
                    value={value}
                    variant="outlined"
                    label={label}
                    InputProps={{
                        ...inputProps,
                    }}
                />
            ) : (
                <TextField
                    fullWidth
                    margin="dense"
                    name={name}
                    id={id}
                    value={value}
                    onChange={(event) =>
                        handlerFunction((event.target as HTMLInputElement).value)
                    }
                    variant="outlined"
                    label={label}
                    InputProps={{
                        ...inputProps,
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title={i18next.t("risk_agreement.expandable_textfield.adornment_tooltip_title")}>
                                    <IconButton onClick={handleExpandClick} edge="end">
                                        <ExpandMoreIcon
                                            style={{
                                                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s",
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        input: {color: "black"},
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {borderColor: borderColor},
                        },
                    }}
                />
            )}

            {expand && (
                <Collapse in={expanded} timeout={250} unmountOnExit>
                    <Accordion
                        expanded={expanded}
                        onChange={handleExpandClick}
                        elevation={0}
                        TransitionProps={{timeout: 250}}
                        sx={{margin: "0 10px"}}>
                        <Box display="flex" alignItems="center" margin="0 10px">
                            <Typography variant="subtitle1" color="secondary">
                                <i><Trans i18nKey={"risk_agreement.expandable_textfield.previous_entry"}/>:</i>
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" marginLeft="10px" marginRight="10px"
                                        color="secondary">
                                {oldValue ? oldValue.toString() : i18next.t("risk_agreement.expandable_textfield.no_prev_entry_message")}
                            </Typography>
                            <Tooltip title={i18next.t("risk_agreement.expandable_textfield.set_prev_entry_again")}>
                                <IconButton onClick={handleRestore}>
                                    <RestoreSharpIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Accordion>
                </Collapse>
            )}
        </>
    );
};
