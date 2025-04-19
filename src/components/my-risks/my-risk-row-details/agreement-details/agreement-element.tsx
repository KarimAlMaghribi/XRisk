import {RiskAgreement} from "../../../../models/RiskAgreement";
import {Risk} from "../../../../models/Risk";
import {Chat} from "../../../../store/slices/my-bids/types";
import {useDispatch, useSelector} from "react-redux";
import {selectRiskAgreementByChatId} from "../../../../store/slices/my-risk-agreements/selectors";
import {AgreementTable} from "./agreement-table";
import React, {useEffect} from "react";
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {t} from "i18next";
import {riskAgreementsUnsubscribe, subscribeToRiskAgreements} from "../../../../store/slices/my-risk-agreements/thunks";
import {AppDispatch} from "../../../../store/store";

export interface AgreementElementProps {
    risk: Risk;
    chat: Chat;
}

export const AgreementElement = (props: AgreementElementProps) => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(subscribeToRiskAgreements());

        return () => {
            if (riskAgreementsUnsubscribe) {
                riskAgreementsUnsubscribe();
            }
        };
    }, [dispatch]);

    const riskAgreements = useSelector(
        selectRiskAgreementByChatId(props.chat.id)
    );

    const displayAgreements: RiskAgreement[] =
        riskAgreements?.length === 1
            ? riskAgreements
            : riskAgreements?.filter(
            (agreement) =>
                Object.values(agreement.riskGiverApprovals).every((v) => v) &&
                Object.values(agreement.riskTakerApprovals).every((v) => v)
        ) || [];

    if (displayAgreements.length === 0) {
        return null;
    }


    return (
        <>
            {displayAgreements.map((agreement) => (
                <Grid container spacing={2} key={agreement.id}>
                    <Grid size={4}>
                        <Grid container spacing={1}>
                            <Grid size={4}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {t("terms.riskgiver")}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {t("my_risks.last_activity")}
                                </Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography variant="subtitle1">
                                    {props.chat.riskProvider?.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {new Date(props.chat.lastActivity || "").toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={8}>
                        <AgreementTable riskAgreement={agreement} />
                    </Grid>
                </Grid>
            ))}
        </>
    );
};
