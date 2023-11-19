import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const addRoleClaims = functions.auth.user().onCreate(async (user) => {
    const { uid } = user;

    try {
        await admin.auth().setCustomUserClaims(uid, {
            // Default Claims
            admin: false, // Example: set to true for admin users
        });

        console.log(`Custom claims added for user: ${uid}`);
    } catch (error) {
        console.error("Error adding custom claims:", error);
    }
});
