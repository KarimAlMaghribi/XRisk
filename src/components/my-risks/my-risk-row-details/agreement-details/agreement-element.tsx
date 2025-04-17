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

    const riskAgreement: RiskAgreement | undefined = useSelector(selectRiskAgreementByChatId(props.chat.id));

    const agreed = riskAgreement &&
        Object.values(riskAgreement.riskGiverApprovals).every((v) => v) &&
        Object.values(riskAgreement.riskTakerApprovals).every((v) => v);

    return (
        <>
            {
                agreed &&
                <Grid container>
                    <Grid size={4}>
                        <Grid container>
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
                                    {props.chat?.riskProvider?.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {new Date(props.chat?.lastActivity || "").toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={8}>
                        <AgreementTable riskAgreement={riskAgreement}/>
                    </Grid>
                </Grid>
            }
        </>
    );
};
