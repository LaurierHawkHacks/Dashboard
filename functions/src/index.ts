/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// eslint-disable-next-line
import { onRequest } from "firebase-functions/v2/https";
// eslint-disable-next-line
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addAdminClaim = functions.https.onRequest(async (req, res) => {
    const uid = req.query.uid; // Get the UID from the request
    const customClaims = {
        admin: true,
    };
    try {
        await admin.auth().setCustomUserClaims(uid, customClaims);
        res.status(200).send("Custom claim added successfully");
    } catch (error) {
        console.error("Error adding custom claim:", error);
        res.status(500).send("Internal Server Error");
    }
});
