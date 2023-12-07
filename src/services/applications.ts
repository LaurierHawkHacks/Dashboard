import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export const getApplications = async (
    hackathonTerm: string
): Promise<Record<string, unknown>[]> => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User not authenticated");
        }

        const querySnapshot = await db
            .collection("applications")
            .where("hackathonTerm", "==", hackathonTerm)
            .where("userId", "==", user.uid)
            .get();

        const applications: Record<string, unknown>[] = [];
        querySnapshot.forEach((doc) => {
            applications.push(doc.data());
        });

        return applications;
    } catch (error) {
        console.error("Error retrieving applications:", error);
        throw error;
    }
};
