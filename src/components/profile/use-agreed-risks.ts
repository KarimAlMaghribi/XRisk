import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase_config";
import { FirestoreCollectionEnum } from "../../enums/FirestoreCollectionEnum";
import { Risk } from "../../models/Risk";
import { RiskAgreement } from "../../models/RiskAgreement";

export const useAgreedRisks = (uid?: string | null) => {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) {
            setRisks([]);
            return;
        }

        let cancelled = false;

        const fetchRisks = async () => {
            setLoading(true);
            setError(null);

            try {
                const raRef = collection(db, FirestoreCollectionEnum.MY_RISK_AGREEMENTS);
                const [giverSnap, takerSnap] = await Promise.all([
                    getDocs(query(raRef, where("riskGiverId", "==", uid))),
                    getDocs(query(raRef, where("riskTakerId", "==", uid))),
                ]);

                const agreements: RiskAgreement[] = [...giverSnap.docs, ...takerSnap.docs]
                    .map(doc => {
                        const data = doc.data() as Omit<RiskAgreement, "id">;
                        return { ...data, id: doc.id };
                    })
                    .reduce<RiskAgreement[]>((acc, ra) =>
                            acc.some(a => a.riskId === ra.riskId) ? acc : [...acc, ra],
                        []);

                const successfulIds = agreements
                    .filter(ra =>
                        Object.values(ra.riskGiverApprovals).every(v => v) &&
                        Object.values(ra.riskTakerApprovals).every(v => v),
                    )
                    .map(ra => ra.riskId);

                if (successfulIds.length === 0) {
                    if (!cancelled) setRisks([]);
                    return;
                }

                const riskRef = collection(db, FirestoreCollectionEnum.RISKS);
                const fetchedRisks: Risk[] = [];

                await Promise.all(
                    successfulIds.map(async rid => {
                        const snap = await getDocs(query(riskRef, where("id", "==", rid)));
                        snap.docs.forEach(doc => {
                            const data = doc.data() as Omit<Risk, "id">;
                            fetchedRisks.push({ ...data, id: doc.id });
                        });
                    }),
                );

                if (!cancelled) {
                    setRisks(fetchedRisks);
                }
            } catch (e) {
                console.error("Fehler beim Laden der agreed risks:", e);
                if (!cancelled) {
                    setError("Daten konnten nicht geladen werden.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchRisks();
        return () => {
            cancelled = true;
        };
    }, [uid]);

    return { risks, loading, error };
};
