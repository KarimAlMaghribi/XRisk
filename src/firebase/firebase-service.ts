import {auth, googleAuthProvider, storage} from '../firebase_config';
import {
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,

} from "firebase/auth";
import { UserCredential, User } from "firebase/auth";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

export const signInWithGoogle = async (): Promise<User> => {
    try {
        const result: UserCredential = await signInWithPopup(auth, googleAuthProvider);
        return result.user;
    } catch (error) {
        console.error("Fehler bei der Google-Anmeldung:", (error as Error).message);
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        const signOutObject = await signOut(auth);
        return signOutObject;
    } catch (error) {
        console.error(error);
        alert(error)
    }
};

export const signUpWithEmail = async (email: string, password: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return false;
    } catch (error) {
        console.error(error);
        alert(error)
        return true;
    }

};

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error(error);
        alert(error)
    }
};

export const saveInStorage = async (path: string, file: File | null): Promise<string | null> => {
    const user = auth.currentUser;

    if (!file) {
        console.error("No file provided!");
        return null
    }

    if (!user) {
        console.error("No user logged in!");
        return null;
    }

    if (!path) {
        console.error("Path is empty!");
        return null;
    }

    const storageRef = ref(storage, path);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.debug("File uploaded successfully! Url: ", downloadUrl);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading file: ", error);
        return null;
    }

    return null;
}
