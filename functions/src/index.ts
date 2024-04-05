/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 * import { onRequest } from "firebase-functions/v2/https";
 * import * as logger from "firebase-functions/logger";
 * https://firebase.google.com/docs/functions/typescript
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Octokit } from "octokit";
admin.initializeApp();
// Default on-sign-up Claims function
export const addDefaultClaims = functions.auth.user().onCreate(async (user) => {
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

// onCall Function to be called from Frontend for making user Admin
export const addAdminRole = functions.https.onCall((data, context) => {
    // If user is not an Admin, decline request
    if (context.auth?.token.admin !== true) {
        return { error: "Only admins can add other admins" };
    }
    // Get USER and ADD custom claim (admin) based on Email
    return admin
        .auth()
        .getUserByEmail(data.email)
        .then((user) => {
            return admin.auth().setCustomUserClaims(user.uid, {
                admin: true,
            });
        })
        .then(() => {
            return {
                message: `Success! ${data.email} is now an Admin!`,
            };
        })
        .catch((err) => {
            return err;
        });
});

/**
 * This cloud function is use as a solution to the work around
 * when signing in with github would lead to unverified email
 * even if the email has actually been verified with github
 *
 * Calls the REST API with octokit to get all the emails the user
 * has with github and match it with the email we have with firebase auth
 *
 * refer the link below for more information
 * https://docs.github.com/en/rest/users/emails?apiVersion=2022-11-28#list-email-addresses-for-the-authenticated-user
 *
 * Sends back true/false of verification status
 */
export const verifyGitHubEmail = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            return new functions.https.HttpsError(
                "permission-denied",
                "Not authenticated"
            );
        }

        const { token, email } = data;

        if (!token || !email) {
            return new functions.https.HttpsError(
                "failed-precondition",
                "Invalid Payload"
            );
        }

        try {
            const octokit = new Octokit({
                auth: token,
            });

            const res = await octokit.request("GET /user/emails", {
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });

            if (res.status === 200) {
                const payloadEmail = res.data.filter(
                    (data) => data.email === email
                )[0];
                if (!payloadEmail)
                    return new functions.https.HttpsError(
                        "aborted",
                        "Fail to match email in payload"
                    );

                // since we got the email data we need, we check if its verified
                admin.auth().updateUser(context.auth.uid, {
                    emailVerified: payloadEmail.verified,
                });
                return payloadEmail.verified;
            } else {
                return new functions.https.HttpsError(
                    "unavailable",
                    "Service unavailable"
                );
            }
        } catch {
            return new functions.https.HttpsError(
                "internal",
                "Failed to verify email"
            );
        }
    }
);
