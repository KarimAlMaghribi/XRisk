import { Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRisks } from "../../store/slices/risks/selectors";
import { selectMyTakenRisks } from "../../store/slices/my-risks/selectors";
import { fetchMyTakenRisks } from "../../store/slices/risks/thunks";
import { AppDispatch } from "../../store/store";
import { Risk } from "../../models/Risk";
import { auth } from "../../firebase_config";
import Tooltip from "@mui/material/Tooltip";

export const LossRatio = () => {
    const dispatch: AppDispatch = useDispatch();
    const risks: Risk[] = useSelector(selectRisks);
    const myTakenRisks: Risk[] = useSelector(selectMyTakenRisks);
    const [lossRatio, setLossRatio] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchMyTakenRisks());
    }, [dispatch]);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid || risks.length === 0 || myTakenRisks.length === 0) {
            setLossRatio(null);
            return;
        }

        const receivedPayouts: number = risks
            .filter(risk =>
                risk.status === "agreement" &&
                risk.occurred === true &&
                risk.publisher?.uid === uid
            )
            .reduce((sum, risk) => sum + risk.value, 0);

        const totalFees: number = myTakenRisks.reduce((sum, risk) => sum + risk.value, 0);

        const calculatedLossRatio: number | null = totalFees > 0 ? receivedPayouts / totalFees : null;
        setLossRatio(calculatedLossRatio);
    }, [risks, myTakenRisks]);

    return (
        <>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" marginTop="10px">
                Schaden-Kosten-Quote
            </Typography>
            <Divider />
            <br />
            <Tooltip followCursor title={"Diese Quote gibt an, in welchem Verhältnis die erhaltenen Auszahlungen aus eingetretenen Schäden zu den gezahlten Gebühren für Risikoübernahmen stehen. Ein hoher Wert kann darauf hinweisen, dass der Nutzer häufig Schäden meldet, während ein niedriger Wert für eine verantwortungsbewusste Übernahme von Risiken spricht."} placement="top">
                <Typography marginLeft="10px" fontWeight="bold" style={{cursor: "pointer"}}>
                    {lossRatio !== null
                        ? `${(lossRatio * 100).toFixed(2)} %`
                        : "Keine Daten vorhanden"}
                </Typography>
            </Tooltip>
        </>
    );
};
