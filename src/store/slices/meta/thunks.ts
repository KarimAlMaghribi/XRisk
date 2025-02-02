import {createAsyncThunk} from "@reduxjs/toolkit";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {db} from "../../../firebase_config";
import {collection, getCountFromServer} from "firebase/firestore";

export const fetchUserCount = createAsyncThunk(
    "meta/fetchUserCount",
    async () => {
        const coll = collection(db, FirestoreCollectionEnum.USER_PROFILES);
        const snapshot = await getCountFromServer(coll);
        return snapshot.data().count;
    }
);
