import {createSlice} from "@reduxjs/toolkit";
import {FetchStatusEnum} from "../../../enums/FetchStatus.enum";
import {UserProfile} from "./types";
import {
    addProfile,
    checkUserProfileWithGoogle,
    fetchUserProfile,
    fetchUserProfileById, setDeleteFlag,
    updateImagePath,
    updateProfile
} from "./thunks";

const initialState: UserProfile = {
    id: null,
    profile: {
        name: "",
        email: ""
    },
    error: undefined,
    status: FetchStatusEnum.IDLE
};


export const userProfileSlice = createSlice({
        name: "userProfile",
        initialState: initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(addProfile.pending, (state) => {
                    state.profile = {name: "", email: ""};
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(addProfile.fulfilled, (state, action) => {
                    state.id = action.payload.id;
                    state.profile = action.payload.profile;
                    state.createdAt = action.payload.createdAt;
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(addProfile.rejected, (state, action) => {
                    state.profile = {name: "", email: ""};
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                })
                .addCase(updateProfile.pending, (state) => {
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(updateProfile.fulfilled, (state, action) => {
                    if (action.payload) {
                        state.profile = action.payload.profile;
                        state.updatedAt = action.payload.updatedAt;
                    }
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(updateProfile.rejected, (state, action) => {
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                })
                .addCase(fetchUserProfile.pending, (state) => {
                    state.profile = {name: "", email: ""};
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(fetchUserProfile.fulfilled, (state, action) => {
                    state.profile = action.payload.profile;
                    state.id = action.payload.id;
                    state.createdAt = action.payload.createdAt;
                    state.updatedAt = action.payload.updatedAt ? action.payload.updatedAt : undefined;
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(fetchUserProfile.rejected, (state, action) => {
                    state.profile = {name: "", email: ""};
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                })
                .addCase(checkUserProfileWithGoogle.pending, (state) => {
                    state.profile = {name: "", email: ""};
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(checkUserProfileWithGoogle.fulfilled, (state, action) => {
                    state.profile = action.payload.profile;
                    state.id = action.payload.id;
                    state.createdAt = action.payload.createdAt;
                    state.updatedAt = action.payload.updatedAt ? action.payload.updatedAt : undefined;
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(checkUserProfileWithGoogle.rejected, (state, action) => {
                    state.profile = {name: "", email: ""};
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                })
                .addCase(updateImagePath.pending, (state) => {
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(updateImagePath.fulfilled, (state, action) => {
                    state.profile.imagePath = action.payload.profile.imagePath;
                    state.updatedAt = new Date().toISOString();
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(updateImagePath.rejected, (state, action) => {
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                })
                .addCase(fetchUserProfileById.pending, (state) => {
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(fetchUserProfileById.fulfilled, (state, action) => {
                    state.opposingProfile = action.payload.profile;
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(fetchUserProfileById.rejected, (state, action) => {
                    state.opposingProfile = undefined;
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                })
                .addCase(setDeleteFlag.pending, (state) => {
                    state.error = undefined;
                    state.status = FetchStatusEnum.PENDING;
                })
                .addCase(setDeleteFlag.fulfilled, (state, action) => {
                    state.status = FetchStatusEnum.SUCCEEDED;
                })
                .addCase(setDeleteFlag.rejected, (state, action) => {
                    state.error = action.payload as string;
                    state.status = FetchStatusEnum.FAILED;
                });
        }
    }
);

export default userProfileSlice.reducer;
