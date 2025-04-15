import { useEffect, useState } from "react";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { Risk } from "../../models/Risk";
import { db } from "../../firebase_config";
import { FirestoreCollectionEnum } from "../../enums/FirestoreCollectionEnum";
import { RiskAgreement } from "../../models/RiskAgreement";

export const useAgreedRisks = (uid: string | null | undefined) => {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) return;

        const fetchRisks = async () => {
            setLoading(true);
            try {
                const riskAgreementRef = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);

                const giverQuery = query(riskAgreementRef, where("riskGiverId", "==", uid));
                const takerQuery = query(riskAgreementRef, where("riskTakerId", "==", uid));

                const [giverSnapshot, takerSnapshot] = await Promise.all([
                    getDocs(giverQuery),
                    getDocs(takerQuery)
                ]);

                const allDocs = [...giverSnapshot.docs, ...takerSnapshot.docs];

                if (allDocs.length === 0) {
                    setRisks([]);
                    return;
                }

                const riskAgreements = allDocs.map((doc) => ({
                    ...doc.data(),
                })) as RiskAgreement[];

                // @ts-ignore
                const riskIds = [...new Set(riskAgreements.map((r) => r.riskId))]; // Duplikate vermeiden

                const risksRef = collection(db, FirestoreCollectionEnum.RISKS);

                const fetchedRisks: Risk[] = [];
                for (const riskId of riskIds) {
                    const q = query(risksRef, where("id", "==", riskId));
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Risk[];
                    fetchedRisks.push(...data);
                }

                // const expired: Risk[] = fetchedRisks.filter(
                //     (risk) =>
                //         risk.declinationDate &&
                //         new Date(risk.declinationDate) < new Date()
                // );

                setRisks(fetchedRisks);
            } catch (err) {
                console.error("Fehler beim Laden der agreed risks:", err);
                setError("Daten konnten nicht geladen werden.");
            } finally {
                setLoading(false);
            }
        };

        fetchRisks();
    }, [uid]);

    return { risks, loading, error };
};
