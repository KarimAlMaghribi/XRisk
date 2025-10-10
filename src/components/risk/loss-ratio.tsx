import {Divider, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectRisks} from "../../store/slices/risks/selectors";
import {AppDispatch} from "../../store/store";
import {Risk} from "../../models/Risk";
import {db} from "../../firebase_config";
import Tooltip from "@mui/material/Tooltip";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {Chat} from "../../store/slices/my-bids/types";
import {collection, getDocs} from "firebase/firestore";

export interface LossRatioProps {
    uid: string | undefined | null;
}

export const LossRatio = (props: LossRatioProps) => {
    const risks: Risk[] = useSelector(selectRisks);
    const [lossRatio, setLossRatio] = useState<number | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatsRef = collection(db, "chats");
                const querySnapshot = await getDocs(chatsRef);
                const fetchedChats = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Chat[];
                setChats(fetchedChats);
            } catch (error) {
                console.error("Fehler beim Laden der Chats:", error);
            }
        };

        fetchChats();
    }, []);

    useEffect(() => {
        if (!props.uid || risks.length === 0) {
            setLossRatio(null);
            return;
        }

        const receivedPayouts: number = risks
            .filter(risk =>
                risk.status === RiskStatusEnum.AGREEMENT &&
                risk.occurred === true &&
                risk.publisher?.uid === props.uid
            )
            .reduce((sum, risk) => sum + risk.value, 0);

        const totalFees = risks.filter((risk) => {
            const chat = chats.find(
                (chat) => chat.riskId === risk.id && chat.riskProvider?.uid === props.uid
            );
            return !!chat;
        }).reduce((sum, risk) => sum + risk.value, 0);

        const calculatedLossRatio: number | null = totalFees > 0 ? receivedPayouts / totalFees : null;

        setLossRatio(calculatedLossRatio);
    }, [risks, chats, props.uid]);

    return (
        <>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" marginTop="10px">
                Schaden-Kosten-Quote
            </Typography>
            <Divider/>
            <br/>
            <Tooltip followCursor
                     title={"Diese Quote zeigt das Verhältnis zwischen Schadenzahlungen, die ein Risikogeber erhalten hat, und den Prämien, die er gezahlt hat. Ein hoher Wert kann darauf hinweisen, dass der Nutzer häufig Schäden meldet, während ein niedriger Wert für eine verantwortungsbewusste Abgabe von Risiken spricht."}
                     placement="top">
                <Typography marginLeft="10px" style={{cursor: "pointer"}}>
                    {lossRatio !== null
                        ? `${(lossRatio * 100).toFixed(2)} %`
                        : "Keine Daten vorhanden"}
                </Typography>
            </Tooltip>
        </>
    );
};
