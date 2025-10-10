import React, {useEffect, useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField
} from "@mui/material";
import {AppDispatch} from "../../../store/store";
import {useDispatch} from "react-redux";
import {updateMyRisk} from "../../../store/slices/my-risks/thunks";
import {Risk} from "../../../models/Risk";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {RiskTypeSelector} from "../risk-type-selector";
import {EuroNumberFormat} from "../creation-dialog/my-risk-creation-dialog";
import CloseIcon from "@mui/icons-material/Close";
import {PaperComponent} from "../../ui/draggable-dialog";

export interface MyRiskEditDialogProps {
  risk: Risk;
  open: boolean;
  setOpen: (visible: boolean) => void;
}

export const MyRiskEditDialog = (props: MyRiskEditDialogProps) => {
  const [riskType, setRiskType] = useState<string[]>(props.risk.type || []);
  const [risk, setRisk] = useState<Risk>(props.risk);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setRisk(props.risk);
    setRiskType(props.risk.type || []);
  }, [props.risk]);

  const handleSave = () => {
    const updatedRisk: Risk = {
      ...risk,
      type: riskType,
    };
    dispatch(updateMyRisk(updatedRisk));
    props.setOpen(false);
  };

  return (
      <Dialog
          fullWidth
          maxWidth="sm"
          open={props.open}
          onClose={() => props.setOpen(false)}
          PaperComponent={PaperComponent}
          PaperProps={{
            sx: {
              position: 'absolute',
              top: {xs: '5%', md: '10%'},
              m: 0,
              maxHeight: {xs: '84vh', md: '88vh'},
              overflow: 'auto',
            },
          }}>
        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
          Risiko bearbeiten
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={() => props.setOpen(false)}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}>
          <CloseIcon/>
        </IconButton>

        <DialogContent sx={{px: 2, py: 1.5}}>
          <TextField
              disabled
              fullWidth
              label="ID"
              defaultValue={risk.id}
              slotProps={{input: {readOnly: true}}}
          />
          <TextField
              error={risk.name.length === 0}
              helperText={risk.name.length === 0 ? "Bitte gib einen Namen ein" : ""}
              sx={{mt: 2}}
              fullWidth
              label="Name"
              value={risk.name}
              onChange={(event) => setRisk({...risk, name: event.target.value})}
          />
          <TextField
              error={risk.description.length <= 20}
              helperText={
                risk.description.length === 0
                    ? "Bitte füge eine Beschreibung hinzu"
                    : risk.description.length <= 20
                        ? "Bitte füge eine längere Beschreibung hinzu"
                        : ""
              }
              sx={{mt: 2}}
              fullWidth
              label="Kurzbeschreibung"
              value={risk.description}
              multiline
              rows={5}
              onChange={(event) => setRisk({...risk, description: event.target.value})}
          />
          <RiskTypeSelector value={riskType} setValue={setRiskType}/>
          <TextField
              error={risk.value > 999999}
              helperText={
                risk.value > 999999
                    ? "Maximal 999.999,00 € möglich"
                    : risk.value < 0
                        ? "Bitte gib einen positiven Betrag ein"
                        : ""
              }
              margin="dense"
              fullWidth
              label="Absicherungssumme"
              value={risk.value}
              onChange={(event) =>
                  setRisk({
                    ...risk,
                    value: Number(event.target.value.replace(/€\s?|(,*)/g, "")),
                  })
              }
              name="value"
              id="value"
              InputProps={{
                inputComponent: EuroNumberFormat as any,
              }}
              inputProps={{inputMode: "numeric", pattern: "[0-9]*"}}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                sx={{mt: 2, width: "100%"}}
                format="DD.MM.YYYY"
                label="Laufzeitende"
                value={dayjs(risk.declinationDate)}
                onChange={(newValue) => {
                  if (newValue && newValue.isAfter(dayjs())) {
                    setRisk({
                      ...risk,
                      declinationDate: newValue.toISOString(),
                    });
                  }
                }}
                minDate={dayjs().add(10, "day")}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{px: 2, py: 1.5}}>
          <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                  risk.value > 999999 ||
                  risk.value < 0 ||
                  risk.name.length === 0 ||
                  risk.description.length < 20 ||
                  risk.type.length < 1
              }
          >
            Speichern
          </Button>
          <Button onClick={() => props.setOpen(false)} variant="outlined">
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
  );
};
