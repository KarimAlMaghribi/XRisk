import { auth, googleAuthProvider } from '../firebase_config';
import {
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,

} from "firebase/auth";
import { UserCredential, User } from "firebase/auth";

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
