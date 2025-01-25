import {createAsyncThunk} from "@reduxjs/toolkit";
import {ActionTypes, ProfileInformation, UserProfile} from "./types";
import {auth, db} from "../../../firebase_config";
import {addDoc, collection, getDocs, query, updateDoc, where} from "firebase/firestore";
import {FirestoreCollectionEnum} from "../../../enums/FirestoreCollectionEnum";
import {User} from "firebase/auth";

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

export const checkUserProfileWithGoogle = createAsyncThunk<any, User>(
    ActionTypes.CHECK_USER_PROFILE_WITH_GOOGLE,
    async (user, {rejectWithValue}) => {
        try {
            const userProfilesCollection = collection(db, FirestoreCollectionEnum.USER_PROFILES);
            const userProfileQuery = query(userProfilesCollection, where("uid", "==", user.uid));

            const userProfileDocs = await getDocs(userProfileQuery);

            if (userProfileDocs.empty) {
                const newUserProfile: UserProfile = {
                    id: user.uid,
                    profile: {
                        name: user.displayName || "Unbekannt",
                        email: user.email || "",
                        imagePath: user.photoURL || undefined,
                        receiveUpdates: true,
                        phone: user.phoneNumber || "",
                    }
                };

                const docRef = await addDoc(userProfilesCollection, {...newUserProfile, uid: user.uid});

                return {...newUserProfile, id: docRef.id};
            }

            const userProfileDoc = userProfileDocs.docs[0];
            return {id: userProfileDoc.id, ...userProfileDoc.data()};
        } catch (error) {
            console.error("Error checking or creating google user profile:", error);
            return rejectWithValue("Error checking or creating google user profile:");
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

export const updateImagePath = createAsyncThunk(
    ActionTypes.UPDATE_IMAGE_PATH,
    async (imagePath: string, { rejectWithValue, getState }) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const state: any = getState();
            const currentUserProfile = state.userProfile;

            if (!currentUserProfile || !currentUserProfile.profile) {
                return rejectWithValue("Current user profile not found in state");
            }

            const existingProfile = currentUserProfile.profile;

            const userProfilesCollection = collection(
                db,
                FirestoreCollectionEnum.USER_PROFILES
            );
            const userProfileQuery = query(
                userProfilesCollection,
                where("uid", "==", user.uid)
            );

            const userProfileDocs = await getDocs(userProfileQuery);

            if (userProfileDocs.empty) {
                return rejectWithValue("Profile not found in Firestore");
            }

            const userProfileDocRef = userProfileDocs.docs[0].ref;

            const updatedProfile: ProfileInformation = {
                ...existingProfile,
                imagePath: imagePath,
            };

            await updateDoc(userProfileDocRef, {
                profile: updatedProfile,
                updatedAt: new Date().toISOString(),
            });

            return {
                ...currentUserProfile,
                id: user.uid,
                profile: updatedProfile,
                updatedAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error("Error updating image path:", error);
            return rejectWithValue(error);
        }
    }
);

export const updateProfile = createAsyncThunk(
    ActionTypes.UPDATE_PROFILE,
    async (profile: Partial<ProfileInformation>, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("User not authenticated");
            }

            const userProfilesCollection = collection(
                db,
                FirestoreCollectionEnum.USER_PROFILES
            );
            const userProfileQuery = query(
                userProfilesCollection,
                where("uid", "==", user.uid)
            );

            const userProfileDocs = await getDocs(userProfileQuery);

            if (userProfileDocs.empty) {
                return rejectWithValue("Profile not found");
            }

            const userProfileDoc = userProfileDocs.docs[0];
            const existingProfile = userProfileDoc.data()?.profile || {};

            // Zusammenführen alter und neuer Werte
            const updatedProfile = {
                ...existingProfile,
                ...profile,
            };

            const userProfileDocRef = userProfileDoc.ref;
            await updateDoc(userProfileDocRef, {
                profile: updatedProfile,
                uid: user.uid,
                updatedAt: new Date().toISOString(),
            });

            return {
                id: user.uid,
                profile: updatedProfile,
                updatedAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error("Error updating profile:", error);
            return rejectWithValue(error);
        }
    }
);

