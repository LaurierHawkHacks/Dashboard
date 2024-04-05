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
import { z } from "zod";
import axios from 'axios';

// data imports
import { ages } from "./data";

admin.initializeApp();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID || '';

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

export const createUserProfile = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            return new functions.https.HttpsError(
                "permission-denied",
                "Not authenticated"
            );
        }

        const profileFormValidation = z.object({
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            countryOfResidence: z.string().length(2),
            phone: z
                .string()
                .min(1)
                .regex(/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/),
            school: z.string().min(1),
            levelOfStudy: z.string().min(1),
            age: z.string().refine((val) => ages.includes(val)),
            discord: z.string().refine((val) => {
                if (val.length < 1) return false;

                if (val[0] === "@" && val.length === 1) return false;

                return true;
            }),
        });

        const result = profileFormValidation.safeParse(data);

        if (!result.success) {
            return new functions.https.HttpsError(
                "invalid-argument",
                "Invalid argument"
            );
        }

        // explicitly take the values that we want.
        const {
            firstName,
            lastName,
            phone,
            school,
            levelOfStudy,
            countryOfResidence,
            age,
            discord,
        } = result.data;

        const payload = {
            id: context.auth.uid,
            firstName,
            lastName,
            phone,
            school,
            levelOfStudy,
            countryOfResidence,
            age,
            discord,
        };

        // check if resource exists already
        const usersRef = admin.firestore().collection("users");
        const query = usersRef.where("id", "==", context.auth.uid).limit(1);
        const snap = await query.get();
        const resource = snap.docs[0];

        try {
            if (resource) {
                await admin
                    .firestore()
                    .collection("users")
                    .doc(resource.id)
                    .update(payload);
            } else {
                // write if new document
                await admin.firestore().collection("users").add(payload);
            }
        } catch {
            return new functions.https.HttpsError(
                "unavailable",
                "Service down. 1100" // 1100 is a random number :)
            );
        }

        return { status: 200 };
    }
);

export const submitApplication = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            return new functions.https.HttpsError(
                "permission-denied",
                "Not authenticated"
            );
        }

        // only allow user to apply if user has profile
        try {
            const usersRef = admin.firestore().collection("users");
            const query = usersRef.where("id", "==", context.auth.uid).limit(1);
            const snap = await query.get();
            const resource = snap.docs[0];
            if (!resource)
                return new functions.https.HttpsError(
                    "invalid-argument",
                    "User has no profile."
                );
        } catch (e) {
            return new functions.https.HttpsError(
                "unavailable",
                "Service down. 1100"
            );
        }

        const hackerAppFormValidation = z.object({
            major: z.string().array().min(1),
            gender: z
                .string()
                .transform((val) => val ?? "Prefer not to answer"),
            pronouns: z
                .string()
                .array()
                .transform((val) =>
                    val.length > 0 ? val : ["Prefer not to answer"]
                ),
            sexuality: z
                .string()
                .transform((val) => val ?? "Prefer not to answer"),
            race: z.string().transform((val) => val ?? "Prefer not to answer"),
            diets: z
                .string()
                .array()
                .transform((val) => (val.length > 0 ? val : ["None"])),
            allergies: z.string().array(),
            shirtSizes: z.string().array().min(1),
            interests: z.string().array().min(1),
            hackathonExperience: z.string(),
            programmingLanguages: z.string().array(),
            participatingAs: z
                .string()
                .refine((val) =>
                    ["Hacker", "Mentor", "Volunteer"].includes(val)
                ),
            applicantId: z.string(),
            agreedToHawkHacksCoC: z.boolean(),
            agreedToWLUCoC: z.boolean(),
            agreedToMLHCoC: z.boolean(),
            agreetToMLHToCAndPrivacyPolicy: z.boolean(),
            agreedToReceiveEmailsFromMLH: z.boolean(),
        });

        const result = hackerAppFormValidation.safeParse(data);

        if (!result.success) {
            return new functions.https.HttpsError(
                "invalid-argument",
                "Invalid argument"
            );
        }

        // only take the fields that are editable by user
        const {
            major,
            gender,
            pronouns,
            sexuality,
            race,
            diets,
            allergies,
            shirtSizes,
            interests,
            hackathonExperience,
            programmingLanguages,
            participatingAs,
            agreedToMLHCoC,
            agreedToWLUCoC,
            agreedToHawkHacksCoC,
            agreetToMLHToCAndPrivacyPolicy,
            agreedToReceiveEmailsFromMLH,
        } = result.data;

        // check if there is an application that exists already
        // no duplicate application allow
        try {
            const appsRef = admin.firestore().collection("applications");
            const query = appsRef
                .where("applicantId", "==", context.auth.uid)
                .limit(1);
            const snap = await query.get();
            const resource = snap.docs[0];
            if (resource) {
                // application exists already, do not proceed
                return new functions.https.HttpsError(
                    "aborted",
                    "duplicate application"
                );
            }

            await appsRef.add({
                applicantId: context.auth.uid,
                timestamp: admin.firestore.Timestamp.now(),
                major,
                gender,
                pronouns,
                sexuality,
                race,
                diets,
                allergies,
                shirtSizes,
                interests,
                hackathonExperience,
                programmingLanguages,
                participatingAs,
                agreedToMLHCoC,
                agreedToWLUCoC,
                agreedToHawkHacksCoC,
                agreetToMLHToCAndPrivacyPolicy,
                agreedToReceiveEmailsFromMLH,
            });
        } catch (e) {
            return new functions.https.HttpsError(
                "unavailable",
                "Service down. 1100" // 1100 is a random number :)
            );
        }

        return { status: 200 };
    }
);

export const sendVerificationSms = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { phoneNumber } = data;
    const fullPhoneNumber = `+1${phoneNumber}`; // Adjust the country code as necessary

    const url = `https://verify.twilio.com/v2/Services/${TWILIO_SERVICE_SID}/Verifications`;

    try {
        const response = await axios.post(
            url,
            new URLSearchParams({
                To: fullPhoneNumber,
                Channel: 'sms',
            }).toString(),
            {
                auth: {
                    username: TWILIO_ACCOUNT_SID,
                    password: TWILIO_AUTH_TOKEN,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return { success: true, sid: response.data.sid };
    } catch (error) {
        console.error('Error sending verification SMS:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send verification SMS');
    }
});

export const verifySmsCode = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { phoneNumber, code } = data;
    const fullPhoneNumber = `+1${phoneNumber}`; // Adjust the country code as necessary

    const url = `https://verify.twilio.com/v2/Services/${TWILIO_SERVICE_SID}/VerificationCheck`;

    try {
        const response = await axios.post(
            url,
            new URLSearchParams({
                To: fullPhoneNumber,
                Code: code,
            }).toString(),
            {
                auth: {
                    username: TWILIO_ACCOUNT_SID,
                    password: TWILIO_AUTH_TOKEN,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return { success: response.data.status === 'approved', status: response.data.status };
    } catch (error) {
        console.error('Error verifying SMS code:', error);
        throw new functions.https.HttpsError('internal', 'Failed to verify SMS code');
    }
});