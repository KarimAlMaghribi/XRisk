import Dialog from "@mui/material/Dialog";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel, Grid2,
    IconButton,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { Trans } from "react-i18next";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
    addAssesments,
    fetchAssessments,
    updateAssesment,
} from "../../store/slices/credit-assesment/thunks";
import { CreditAssesment } from "../../models/CreditAssesment";
import { auth } from "../../firebase_config";
import { selectAssessmentById } from "../../store/slices/credit-assesment/selectors";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "../../theme";
import { computeLiabilityLimit } from "./liability-calculation";
import { EuroNumberFormat } from "./utils";
import { useSnackbarContext } from "../snackbar/custom-snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * Control for nullable number with "not provided" switch
 */
function useNullableNumberField(initial: number | null = null) {
    const [value, setValue] = useState<number | null>(initial);
    const [noInput, setNoInput] = useState<boolean>(initial == null);

    const handleChange = (raw: string) => {
        const cleaned = raw.replace(/€\s?|\.|,/g, "");
        if (cleaned === "") {
            setValue(null);
            setNoInput(true);
        } else {
            const num = Math.max(0, Number(cleaned));
            setValue(num);
            setNoInput(false);
        }
    };

    const toggleNoInput = () => {
        setNoInput((prev) => {
            const next = !prev;
            setValue(next ? null : value);
            return next;
        });
    };

    const setFromAssessment = (v: number | null) => {
        setValue(v);
        setNoInput(v == null);
    };

    return { value, noInput, handleChange, toggleNoInput, setFromAssessment };
}

export interface CreditScoreDialogProps {
    show: boolean;
    handleClose: () => void;
}

export const CreditScoreDialog = (props: CreditScoreDialogProps) => {
    const dispatch: AppDispatch = useDispatch();
    const uid = auth.currentUser?.uid!;
    const { showSnackbar } = useSnackbarContext();

    const liquidityField = useNullableNumberField();
    const netIncomeField = useNullableNumberField();
    const existingCreditsField = useNullableNumberField();
    const monthlyFixCostsField = useNullableNumberField();
    const otherAssetsField = useNullableNumberField();

    const [liabilityLimit, setLiabilityLimit] = useState<number>(5000);
    const assessment: CreditAssesment | null = useSelector((state: RootState) =>
        selectAssessmentById(state, uid)
    );

    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

    useEffect(() => {
        if (uid) dispatch(fetchAssessments(uid));
    }, [dispatch, uid]);

    useEffect(() => {
        if (assessment) {
            liquidityField.setFromAssessment(assessment.liquidAssets);
            netIncomeField.setFromAssessment(assessment.monthlyIncome);
            existingCreditsField.setFromAssessment(assessment.currentLoan);
            monthlyFixCostsField.setFromAssessment(assessment.monthlyFixedCosts);
            otherAssetsField.setFromAssessment(assessment.additionalAssets);
            setLiabilityLimit(assessment.acquisitionLimit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assessment]);

    const formatLimit = (limit: number) =>
        new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(limit);

    const handleSave = () => {
        const limit = computeLiabilityLimit(
            liquidityField.value,
            netIncomeField.value,
            existingCreditsField.value,
            monthlyFixCostsField.value,
            otherAssetsField.value
        );
        const newA: CreditAssesment = {
            id: uid,
            liquidAssets: liquidityField.value,
            monthlyIncome: netIncomeField.value,
            currentLoan: existingCreditsField.value,
            monthlyFixedCosts: monthlyFixCostsField.value,
            additionalAssets: otherAssetsField.value,
            acquisitionLimit: limit,
        };

        if (!assessment) dispatch(addAssesments({ uid, newAssesment: newA }));
        else dispatch(updateAssesment(newA));

        setLiabilityLimit(limit);
        showSnackbar(
            "Bonität angepasst!",
            t("credit_score_information.snackbar_updated_liability_limit", {
                limit: formatLimit(limit),
            }),
            { vertical: "top", horizontal: "center" },
            "success"
        );
    };

    const fields = [
        { field: liquidityField, labelKey: "liquidity_text" },
        { field: netIncomeField, labelKey: "net_income_text" },
        { field: monthlyFixCostsField, labelKey: "monthly_fix_costs_text" },
        { field: existingCreditsField, labelKey: "existing_credits_text" },
        { field: otherAssetsField, labelKey: "other_assets_text" },
    ];

    return (
        <Dialog
            onClose={props.handleClose}
            open={props.show}
            fullScreen={isMobile}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: "600px", md: "720px" },
                    maxHeight: { xs: "100%", sm: "90vh" },
                    mx: { xs: 0, sm: "auto" },
                    my: { xs: 0, sm: 4 },
                    borderRadius: { xs: 0, sm: 2 },
                },
            }}
        >
            {/* Sticky Title auf Mobile */}
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: { xs: "sticky", sm: "static" },
                    top: 0,
                    zIndex: 1,
                    bgcolor: "background.paper",
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    py: { xs: 1, sm: 1.5 },
                }}
            >
                <Typography variant="h6">
                    <Trans i18nKey="credit_score_information.credit_score" />
                </Typography>
                <IconButton onClick={props.handleClose} sx={{ color: "grey.500" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 2, px: { xs: 2, sm: 3 } }}>
                {/* Einleitung */}
                <Grid2 container spacing={2} sx={{ mb: 2 }}>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            <Trans i18nKey={"credit_score_information.credit_score_explanation"} />
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <Trans i18nKey={"credit_score_information.credit_score_explanation_text"} />
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom mt={2}>
                            <Trans i18nKey={"credit_score_information.credit_score_notice"} />
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            <Trans i18nKey={"credit_score_information.credit_score_notice_text"} />
                        </Typography>
                    </Grid2>
                </Grid2>

                {/* Limit Anzeige */}
                <Box
                    sx={{
                        p: 2,
                        mb: 2,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 2,
                        bgcolor: "background.default",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.3 }}>
                        <Trans
                            i18nKey="credit_score_information.liability_limit_text"
                            values={{ limit: liabilityLimit ? formatLimit(liabilityLimit) : "---" }}
                            components={{
                                span: (
                                    <span
                                        style={{
                                            color: theme.palette.secondary.main,
                                            fontWeight: "bold",
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Felder: Responsive (xs=Stack, sm=2-spaltig bei Switch) */}
                {fields.map(({ field, labelKey }) => (
                    <Box key={labelKey} mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                            <Trans i18nKey={`credit_score_information.${labelKey}`} />
                        </Typography>

                        <Grid2 container alignItems="center" spacing={2}>
                            {/* Input links, Switch rechts – auf xs untereinander */}
                            <Grid2 size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    value={field.noInput ? "" : field.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    InputProps={{ inputComponent: EuroNumberFormat as any }}
                                    placeholder={field.noInput ? t("credit_score_information.not_provided") ?? "" : "€ 0,00"}
                                    disabled={field.noInput}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12, sm: 4 }}>
                                <FormControlLabel
                                    control={<Switch checked={field.noInput} onChange={field.toggleNoInput} />}
                                    label={t(`credit_score_information.not_provided`)}
                                />
                            </Grid2>
                        </Grid2>
                    </Box>
                ))}
            </DialogContent>

            {/* Sticky Actions auf Mobile */}
            <DialogActions
                sx={{
                    position: { xs: "sticky", sm: "static" },
                    bottom: 0,
                    bgcolor: "background.paper",
                    borderTop: (t) => `1px solid ${t.palette.divider}`,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.25, sm: 1.5 },
                }}
            >
                <Button onClick={props.handleClose} variant="outlined">
                    <Trans i18nKey="profile_information.cancel" />
                </Button>
                <Button onClick={handleSave} variant="contained">
                    <Trans i18nKey="profile_information.save" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
