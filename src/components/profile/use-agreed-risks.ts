import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {Risk} from "../../models/Risk";
import {db} from "../../firebase_config";
import {FirestoreCollectionEnum} from "../../enums/FirestoreCollectionEnum";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";


export const useAgreedRisks = (uid: string | null | undefined) => {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) {
            console.error("UID is not defined. Cannot fetch agreed risks.");
            return;
        }

        const fetchRisks = async () => {
            setLoading(true);
            try {
                const risksRef = collection(db, FirestoreCollectionEnum.RISKS);
                const q = query(
                    risksRef,
                    where("status", "==", RiskStatusEnum.AGREEMENT),
                    where("uid", "==", uid)
                );
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setRisks([]);
                } else {
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Risk[];

                    setRisks(data);
                }
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
