import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_PROFILE = "userProfile/fetchProfile",
    ADD_PROFILE = "userProfile/addProfile",
    UPDATE_PROFILE = "userProfile/updateProfile",
    CHECK_USER_PROFILE_WITH_GOOGLE = "userProfile/checkUserProfileWithGoogle",
    UPDATE_IMAGE_PATH = "userProfile/updateImagePath",
}

export interface ProfileInformation {
    name: string;
    gender?: string;
    birthdate?: string;
    birthplace?: string; // country
    email: string;
    phone?: string;
    imagePath?: string;
    socialEconomics?: {
        income?: number;
        occupation?: string;
        education?: string;
    };
    receiveUpdates?: boolean;
    country?: string;
    street?: string;
    number?: string;
    city?: string;
    zip?: string;
    aboutMe?: string;
}

export interface UserProfile {
    id: string | null;
    profile: ProfileInformation;
    createdAt?: string;
    updatedAt?: string;
    error?: string;
    status?: FetchStatus;
}

