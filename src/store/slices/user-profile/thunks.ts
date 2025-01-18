import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes, ProfileInformation} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, getDocs, query, updateDoc, where} from "firebase/firestore";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";

export const fetchUserProfile = createAsyncThunk(
    ActionTypes.FETCH_PROFILE,
    async (_, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const userProfilesCollection = collection(db, FirestoreCollectionEnum.USER_PROFILES);
            const userProfileQuery = query(userProfilesCollection, where("uid", "==", user.uid));

            const userProfileDocs = await getDocs(userProfileQuery);

            if (userProfileDocs.empty) {
                return rejectWithValue("Profile not found");
            }

            const userProfileDoc = userProfileDocs.docs[0];
            return userProfileDoc.data();
        } catch (error) {
            console.error("Error fetching profile:", error);
            return rejectWithValue(error);
        }
    }
);

export const addProfile = createAsyncThunk(
    ActionTypes.ADD_PROFILE,
    async (profile: ProfileInformation, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated");
            }

            const userProfilesCollection = collection(db, FirestoreCollectionEnum.USER_PROFILES);
            await addDoc(userProfilesCollection, {
                id: user.uid,
                profile: profile,
                createdAt: new Date().toISOString(),
                uid: user.uid
            });

            return {
                id: user.uid,
                profile: profile,
                createdAt: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error adding document: ", error);
            return rejectWithValue(error);
        }
    }
)

export const updateProfile = createAsyncThunk(
    ActionTypes.UPDATE_PROFILE,
    async (profile: ProfileInformation, {rejectWithValue}) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const userProfilesCollection = collection(db, FirestoreCollectionEnum.USER_PROFILES);
            const userProfileQuery = query(userProfilesCollection, where("uid", "==", user.uid));

            const userProfileDocs = await getDocs(userProfileQuery);

            if (userProfileDocs.empty) {
                return rejectWithValue("Risk not found");
            }

            const userProfileDocRef = userProfileDocs.docs[0].ref;
            await updateDoc(userProfileDocRef, {
                    id: user.uid,
                    profile: profile,
                    uid: user.uid,
                    updatedAt: new Date().toISOString()
                }
            );

            return {
                id: user.uid,
                profile: profile,
                updatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error updating risk-overview:", error);
            return rejectWithValue(error);
        }
    }
);
