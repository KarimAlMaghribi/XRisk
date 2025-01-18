import {UserProfile} from "./types";

export const selectName = (state: { userProfile: UserProfile }) => state?.userProfile?.profile?.name;
export const selectMail = (state: { userProfile: UserProfile }) => state?.userProfile?.profile?.email;
export const selectStatus = (state: { userProfile: UserProfile }) => state?.userProfile?.status;
export const selectUserProfile = (state: { userProfile: UserProfile }) => state?.userProfile;
export const selectProfileInformation = (state: { userProfile: UserProfile }) => state.userProfile.profile;
