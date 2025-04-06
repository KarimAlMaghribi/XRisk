import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {Risk} from "../../models/Risk";
import {db} from "../../firebase_config";
import {FirestoreCollectionEnum} from "../../enums/FirestoreCollectionEnum";

export const useRiskHistory = (uid: string | null | undefined) => {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) return;

        const fetchRisks = async () => {
            setLoading(true);
            try {
                const risksRef = collection(db, FirestoreCollectionEnum.RISKS);
                const q = query(
                    risksRef,
                    where("publisher.uid", "==", uid)
                );
                const snapshot = await getDocs(q);

                const allRisks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Risk[];

                allRisks.sort((a, b) => {
                    const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
                    const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                })

                const recentRisks: Risk[] = allRisks.slice(0, 5);

                setRisks(recentRisks);
            } catch (err) {
                console.error("Fehler beim Laden der Risk-History:", err);
                setError("Risk-History konnten nicht geladen werden.");
            } finally {
                setLoading(false);
            }
        };

        fetchRisks();
    }, [uid]);

    return {risks, loading, error};
};
