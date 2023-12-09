import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { getAuth, User } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export const getApplications = async (
    hackathonTerm: string
): Promise<Record<string, unknown>[]> => {
    try {
        const user: User | null = auth.currentUser;

        if (!user) {
            throw new Error("User not authenticated");
        }

        const q = query(
            collection(db, "applications"),
            where("hackathonTerm", "==", hackathonTerm),
            where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

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
