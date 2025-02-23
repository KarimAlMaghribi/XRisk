import {createAsyncThunk} from "@reduxjs/toolkit";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {db} from "../../../firebase_config";
import {collection, getCountFromServer, getDocs, orderBy, query, limit} from "firebase/firestore";
import {Risk} from "../../../models/Risk";

export const fetchUserCount = createAsyncThunk(
    "meta/fetchUserCount",
    async () => {
        const coll = collection(db, FirestoreCollectionEnum.USER_PROFILES);
        const snapshot = await getCountFromServer(coll);
        return snapshot.data().count;
    }
);

export const fetchHighestRiskValue = createAsyncThunk(
    "meta/fetchHighestRiskValue",
    async () => {
        const coll = collection(db, FirestoreCollectionEnum.RISKS);
        const q = query(coll, orderBy("value", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No risks found");
        }

        const highestRisk = querySnapshot.docs[0].data() as Risk;
        return highestRisk;
    }
);
