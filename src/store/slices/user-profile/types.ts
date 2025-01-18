import {FetchStatus} from "../../../types/FetchStatus";

export enum ActionTypes {
    FETCH_PROFILE = "userProfile/fetchProfile",
    ADD_PROFILE = "userProfile/addProfile",
    UPDATE_PROFILE = "userProfile/updateProfile",
}

export interface Address {
    country: string;
    street: string;
    number: string;
    city: string;
    zip: string;
}

export interface ProfileInformation {
    name: string;
    gender?: string;
    address?: Address;
    birthdate?: string;
    birthplace?: Address;
    email: string;
    phone?: string;
    image?: any;
    socialEconomics?: {
        income?: number;
        occupation?: string;
        education?: string;
    };
    receiveUpdates?: boolean;
}

export interface UserProfile {
    id: string | null;
    profile: ProfileInformation;
    createdAt?: string;
    updatedAt?: string;
    error?: string;
    status?: FetchStatus;
}

