import {UserProfile} from "./types";

export const selectUserProfile = (state: { userProfile: UserProfile }) => state.userProfile;
export const selectName = (state: { userProfile: UserProfile }) => state?.userProfile?.profile?.name;
export const selectMail = (state: { userProfile: UserProfile }) => state?.userProfile?.profile?.email;
export const selectImagePath = (state: { userProfile: UserProfile }) => state?.userProfile?.profile?.imagePath;
export const selectProfileInformation = (state: { userProfile: UserProfile }) => state.userProfile.profile;

export const selectOpposingProfile = (state: { userProfile: UserProfile }) => state.userProfile.opposingProfile;
