import { auth, googleAuthProvider } from '../firebase_config';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleAuthProvider);
};

export const signOutUser = async () => {
    return await signOut(auth);
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
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        alert(error)
    }
};
