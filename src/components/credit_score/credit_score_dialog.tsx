import Dialog from "@mui/material/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  TextField,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
} from "@mui/material";
import { Trans } from "react-i18next";
import { t } from "i18next";
import React, { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addAssesments,
  fetchAssesments,
  updateAssesment,
} from "../../store/slices/credit-assesment/thunks";
import { CreditAssesment } from "../../models/CreditAssesment";
import { auth } from "../../firebase_config";
import { selectAssesmentById } from "../../store/slices/credit-assesment/selectors";

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

  if (liquidity != null) {
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

  if (existingCredits != null) {
    if (existingCredits === 0) {
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

  if (otherAssets != null) {
    if (otherAssets > 0 && otherAssets < 100000) {
      ranking += 2;
    } else if (otherAssets >= 100000 && otherAssets < 500000) {
      ranking += 4;
    } else if (otherAssets >= 500000) {
      ranking += 6;
    }
  }

  if (netIncome != null && monthlyFixCosts != null) {
    if (monthlyFixCosts === 0) {
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
    return 5000;
  } else if (ranking <= 10) {
    return 10000;
  } else if (ranking <= 15) {
    return 25000;
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

  const uid = auth.currentUser?.uid!;
  //fetchAssesments(uid);

  const getAssesments = async () => {
    try {
      const resultAction = await dispatch(fetchAssesments(uid!));
      const assesments = resultAction.payload;

      console.log("Assesments:", assesments);
    } catch (err) {
      console.error("Failed to fetch assessments:", err);
    }
  };

  const assesment: CreditAssesment | null = useSelector((state: RootState) =>
    selectAssesmentById(state, uid)
  );

  const [liquidity, setLiquidity] = React.useState<number | null>(null);
  const [netIncome, setNetIncome] = React.useState<number | null>(null);
  const [existingCredits, setExistingCredits] = React.useState<number | null>(
    null
  );
  const [monthlyFixCosts, setMonthlyFixCosts] = React.useState<number | null>(
    null
  );
  const [otherAssets, setOtherAssets] = React.useState<number | null>(null);

  const [liquidityNoInput, setLiquidityNoInput] = React.useState<boolean>(true);
  const [netIncomeNoInput, setNetIncomeNoInput] = React.useState<boolean>(true);
  const [existingCreditsNoInput, setExistingCreditsNoInput] =
    React.useState<boolean>(true);
  const [monthlyFixCostsNoInput, setMonthlyFixCostsNoInput] =
    React.useState<boolean>(true);
  const [otherAssetsNoInput, setOtherAssetsNoInput] =
    React.useState<boolean>(true);

  const [liabilityLimit, setLiabilityLimit] = React.useState(5000);

  useEffect(() => {
    if (assesment) {
      setLiquidity(assesment?.liquidAssets);
      setNetIncome(assesment?.monthlyIncome);
      setExistingCredits(assesment?.currentLoan);
      setMonthlyFixCosts(assesment?.monthlyFixedCosts);
      setOtherAssets(assesment?.additionalAssets);
      setLiabilityLimit(assesment?.acquisitionLimit);
    }
  }, [assesment]);

  const formattedLimit = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(liabilityLimit);

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "error" | "success"
  >("error");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSave = () => {
    console.log(assesment);

    //Bonität berechnen und anzeigen (im Dialog und über die Snackbar)
    const liabilityLimit = computeLiabilityLimit(
      liquidity,
      netIncome,
      existingCredits,
      monthlyFixCosts,
      otherAssets
    );

    const newAssesment: CreditAssesment = {
      id: uid!,
      liquidAssets: liquidity,
      monthlyIncome: netIncome,
      currentLoan: existingCredits,
      monthlyFixedCosts: monthlyFixCosts,
      additionalAssets: otherAssets,
      acquisitionLimit: liabilityLimit,
    };
    if (assesment == null) {
      dispatch(addAssesments({ uid: uid, newAssesment: newAssesment }));
    } else {
      dispatch(updateAssesment(newAssesment));
    }

    setLiabilityLimit(liabilityLimit);
    setSnackbarMessage(
      t("credit_score_information.snackbar_updated_liability_limit", {
        limit: formattedLimit,
      })
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleSwitchLiquidity = (noInput: boolean) => {
    setLiquidityNoInput(noInput);
    if (noInput) {
      setLiquidity(null);
    }
  };

  const handleSwitchNetIncome = (noInput: boolean) => {
    setNetIncomeNoInput(noInput);
    if (noInput) {
      setNetIncome(null);
    }
  };

  const handleSwitchExistingCredits = (noInput: boolean) => {
    setExistingCreditsNoInput(noInput);
    if (noInput) {
      setExistingCredits(null);
    }
  };

  const handleSwitchMonthlyFixCosts = (noInput: boolean) => {
    setMonthlyFixCostsNoInput(noInput);
    if (noInput) {
      setMonthlyFixCosts(null);
    }
  };

  const handleSwitchOtherAssets = (noInput: boolean) => {
    setOtherAssetsNoInput(noInput);
    if (noInput) {
      setOtherAssets(null);
    }
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

        <Typography variant="h5" fontWeight="bold">
          <Trans
            i18nKey="credit_score_information.liability_limit_text"
            values={{ limit: formattedLimit }}
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
              disabled={liquidityNoInput}
              variant="outlined"
              fullWidth
              value={liquidity ? liquidity : ""}
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
                  checked={liquidityNoInput}
                  onChange={() => handleSwitchLiquidity(!liquidityNoInput)}
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
        <Grid2
          container
          direction="row"
          alignItems="center"
          size={{ md: 12, lg: 6 }}
          spacing={2}
        >
          <Grid2 size={{ md: 12, lg: 9 }}>
            <TextField
              disabled={netIncomeNoInput}
              variant="outlined"
              fullWidth
              value={netIncome ? netIncome : ""}
              onChange={(e) =>
                setNetIncome(Number(e.target.value.replace(/€\s?|(,*)/g, "")))
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
                  checked={netIncomeNoInput}
                  onChange={() => handleSwitchNetIncome(!netIncomeNoInput)}
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
              <Trans
                i18nKey={"credit_score_information.existing_credits_text"}
              />
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
              disabled={existingCreditsNoInput}
              variant="outlined"
              fullWidth
              value={existingCredits ? existingCredits : ""}
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
          <Grid2 size={{ md: 12, lg: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={existingCreditsNoInput}
                  onChange={() =>
                    handleSwitchExistingCredits(!existingCreditsNoInput)
                  }
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
              <Trans
                i18nKey={"credit_score_information.monthly_fix_costs_text"}
              />
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
              disabled={monthlyFixCostsNoInput}
              variant="outlined"
              fullWidth
              value={monthlyFixCosts ? monthlyFixCosts : ""}
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
          <Grid2 size={{ md: 12, lg: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={monthlyFixCostsNoInput}
                  onChange={() =>
                    handleSwitchMonthlyFixCosts(!monthlyFixCostsNoInput)
                  }
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
              <Trans i18nKey={"credit_score_information.other_assets_text"} />
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
              disabled={otherAssetsNoInput}
              variant="outlined"
              fullWidth
              value={otherAssets ? otherAssets : ""}
              onChange={(e) =>
                setOtherAssets(Number(e.target.value.replace(/€\s?|(,*)/g, "")))
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
                  checked={otherAssetsNoInput}
                  onChange={() => handleSwitchOtherAssets(!otherAssetsNoInput)}
                  name="noInput"
                  color="primary"
                />
              }
              label={t("credit_score_information.not_provided")}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            />
          </Grid2>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
