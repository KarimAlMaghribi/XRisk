import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestoreSharpIcon from "@mui/icons-material/RestoreSharp";
import { useEffect, useState } from "react";

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
  const [expand, setExpand] = useState(borderColor == "grey" ? true : false);

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
                <Tooltip title="View previous Changes">
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
            input: { color: "black" }, // Change text color
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: borderColor }, // Change border color
            },
          }}
        />
      )}

      {/* Accordion appears only when expanded is true */}
      {expand && expanded && (
        <Accordion expanded={expanded} onChange={handleExpandClick}>
          <AccordionSummary>
            <Typography>Old value</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {oldValue
                ? oldValue.toString()
                : "Kein vorheriger Wert verfügbar"}
              <Tooltip title="Restore the previous value">
                <IconButton onClick={handleRestore}>
                  <RestoreSharpIcon></RestoreSharpIcon>
                </IconButton>
              </Tooltip>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};
