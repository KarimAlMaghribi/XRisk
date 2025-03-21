import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import Dialog from "@mui/material/Dialog";
import {
  Autocomplete,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
import { Trans } from "react-i18next";
import i18next, { t } from "i18next";
import React from "react";
import { NumericFormat } from "react-number-format";

export interface CreditScoreDialogProps {
  show: boolean;
  handleClose: () => void;
}

export const EuroNumberFormat = React.forwardRef(function EuroNumberFormat(
  props: any,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values: any) => {
        onChange({
          target: {
            value: values.value,
            name: props.name,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="€ "
    />
  );
});

export const computeLiabilityLimit = (
  liquidity: number | null,
  netIncome: number | null,
  existingCredits: number | null,
  monthlyFixCosts: number | null,
  otherAssets: number | null
) => {
  var ranking = 0;
  if (liquidity) {
    if (liquidity >= 5000 && liquidity < 25000) {
      ranking += 2;
    } else if (liquidity >= 25000 && liquidity < 100000) {
      ranking += 4;
    } else if (liquidity >= 100000 && liquidity < 500000) {
      ranking += 6;
    } else if (liquidity >= 500000) {
      ranking += 8;
    }
  }

  if (existingCredits) {
    if (existingCredits == 0) {
      ranking += 5;
    } else if (existingCredits < 50000) {
      ranking += 2;
    } else if (existingCredits < 200000) {
      ranking += 0;
    } else if (existingCredits >= 200000) {
      ranking += -3;
    }
  } else {
    ranking += -3;
  }

  if (otherAssets) {
    if (otherAssets > 0 && otherAssets < 100000) {
      ranking += 2;
    } else if (otherAssets >= 100000 && otherAssets < 500000) {
      ranking += 4;
    } else if (otherAssets >= 500000) {
      ranking += 6;
    }
  }

  if (netIncome && monthlyFixCosts) {
    if (netIncome > 0 && monthlyFixCosts == 0) {
      ranking += 10;
    } else {
      const incomeFixcostsQuota = netIncome / monthlyFixCosts;

      if (incomeFixcostsQuota >= 1 && incomeFixcostsQuota < 1.5) {
        ranking += 2;
      } else if (incomeFixcostsQuota >= 1.5 && incomeFixcostsQuota < 2) {
        ranking += 4;
      } else if (incomeFixcostsQuota >= 2 && incomeFixcostsQuota < 3) {
        ranking += 6;
      } else if (incomeFixcostsQuota >= 3 && incomeFixcostsQuota < 5) {
        ranking += 8;
      } else if (incomeFixcostsQuota >= 5) {
        ranking += 10;
      }
    }
  }

  //Bestimmung des Übernahmelimits anhand der vergebenen Punkte
  if (ranking <= 5) {
    return 0;
  } else if (ranking <= 10) {
    return 5000;
  } else if (ranking <= 15) {
    return 10000;
  } else if (ranking <= 20) {
    return 50000;
  } else if (ranking <= 25) {
    return 100000;
  } else {
    return 500000;
  }
};

export const CreditScoreDialog = (props: CreditScoreDialogProps) => {
  const dispatch: AppDispatch = useDispatch();

  const [liquidity, setLiquidity] = React.useState<number>(0);
  const [netIncome, setNetIncome] = React.useState<number>(0);
  const [existingCredits, setExistingCredits] = React.useState<number>(0);
  const [monthlyFixCosts, setMonthlyFixCosts] = React.useState<number>(0);
  const [otherAssets, setOtherAssets] = React.useState<number>(0);

  const [liabilityLimit, setLiabilityLimit] = React.useState(0);

  const [noInput, setNoInput] = React.useState<boolean>(true);

  //TODO handleSave implementieren
  const handleSave = () => {
    //Werte im Firestore speichern

    //Bonität berechnen und anzeigen (im Dialog und evtl über die Snackbar)
    const liabilityLimit = computeLiabilityLimit(
      liquidity,
      netIncome,
      existingCredits,
      monthlyFixCosts,
      otherAssets
    );
    setLiabilityLimit(liabilityLimit);
  };

  const handleCancel = () => {
    props.handleClose();
  };

  return (
    <Dialog
      onClose={props.handleClose}
      open={props.show}
      PaperProps={{
        sx: {
          maxHeight: "80%",
          position: "absolute",
          top: "10%",
          margin: 0,
          width: "50%",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          <Trans i18nKey={"credit_score_information.credit_score"} />
        </Typography>
        <Typography variant="subtitle1">
          <Trans
            i18nKey={"credit_score_information.update_credit_score_text"}
          />
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ marginTop: "20px" }}>
        <Grid2 size={{ md: 12, lg: 12 }}>
          <Box mr={3}>
            {" "}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              <Trans
                i18nKey={"credit_score_information.credit_score_explanation"}
              />
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Trans
                i18nKey={
                  "credit_score_information.credit_score_explanation_text"
                }
              />
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              mt={2}
            >
              <Trans i18nKey={"credit_score_information.credit_score_notice"} />
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              <Trans
                i18nKey={"credit_score_information.credit_score_notice_text"}
              />
            </Typography>
          </Box>
        </Grid2>

        <Typography variant="subtitle1" fontWeight="bold">
          <Trans
            i18nKey="credit_score_information.liability_limit_text"
            values={{ limit: liabilityLimit }}
          />
        </Typography>
        <Divider />

        <Grid2 size={{ md: 12, lg: 12 }}>
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              <Trans i18nKey={"credit_score_information.liquidity_text"} />
            </Typography>
          </Box>
        </Grid2>
        <Grid2
          container
          direction="row"
          alignItems="center"
          size={{ md: 12, lg: 6 }}
          spacing={2}
        >
          <Grid2 size={{ md: 12, lg: 9 }}>
            <TextField
              disabled={noInput}
              variant="outlined"
              fullWidth
              value={liquidity}
              onChange={(e) =>
                setLiquidity(Number(e.target.value.replace(/€\s?|(,*)/g, "")))
              }
              InputProps={{
                inputComponent: EuroNumberFormat,
              }}
            />
          </Grid2>
          <Grid2 size={{ md: 12, lg: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={noInput}
                  onChange={() => setNoInput(!noInput)}
                  name="noInput"
                  color="primary"
                />
              }
              label={t("credit_score_information.not_provided")}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            />
          </Grid2>
        </Grid2>

        <Grid2 size={{ md: 12, lg: 12 }}>
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              <Trans i18nKey={"credit_score_information.net_income_text"} />
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 12, lg: 6 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={netIncome}
            onChange={(e) =>
              setNetIncome(Number(e.target.value.replace(/€\s?|(,*)/g, "")))
            }
            InputProps={{
              inputComponent: EuroNumberFormat,
            }}
          />
        </Grid2>
        <Grid2 size={{ md: 12, lg: 12 }}>
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              <Trans
                i18nKey={"credit_score_information.existing_credits_text"}
              />
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 12, lg: 6 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={existingCredits}
            onChange={(e) =>
              setExistingCredits(
                Number(e.target.value.replace(/€\s?|(,*)/g, ""))
              )
            }
            InputProps={{
              inputComponent: EuroNumberFormat,
            }}
          />
        </Grid2>
        <Grid2 size={{ md: 12, lg: 12 }}>
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              <Trans
                i18nKey={"credit_score_information.monthly_fix_costs_text"}
              />
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 12, lg: 6 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={monthlyFixCosts}
            onChange={(e) =>
              setMonthlyFixCosts(
                Number(e.target.value.replace(/€\s?|(,*)/g, ""))
              )
            }
            InputProps={{
              inputComponent: EuroNumberFormat,
            }}
          />
        </Grid2>
        <Grid2 size={{ md: 12, lg: 12 }}>
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              <Trans i18nKey={"credit_score_information.other_assets_text"} />
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ md: 12, lg: 6 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={otherAssets}
            onChange={(e) =>
              setOtherAssets(Number(e.target.value.replace(/€\s?|(,*)/g, "")))
            }
            InputProps={{
              inputComponent: EuroNumberFormat,
            }}
          />
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          <Trans i18nKey={"profile_information.cancel"} />
        </Button>
        <Button onClick={handleSave} variant="contained">
          <Trans i18nKey={"profile_information.save"} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
