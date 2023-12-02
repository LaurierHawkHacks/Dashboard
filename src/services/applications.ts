import * as admin from "firebase-admin";

const apiKey: string = import.meta.env.VITE_FIREBASE_API_KEY;

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(apiKey)),
    databaseURL: "https://hawkhacks-dashboard.firebaseapp.com",
});

const db = admin.firestore();

export const getApplications = async (
    hackathonTerm: string
): Promise<Record<string, unknown>[]> => {
    try {
        const querySnapshot = await db
            .collection("applications")
            .where("hackathonTerm", "==", hackathonTerm)
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
