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
import { GoogleAuth } from "google-auth-library";
import * as jwt from "jsonwebtoken";

// data imports
const runtimeConfig = require("../../functions/.runtimeconfig.json");

admin.initializeApp();

const credentials = require("../../functions/hawkhacks-googleWallet-key.json");

const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

export const createPassClass = functions.https.onCall(
    async (data: any, context: any) => {
        const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";
        const issuerId = runtimeConfig.googleWallet.issuerId;
        const classId = `${issuerId}.hawkhacks-ticket`;

        const updatedClass = {
            id: `${classId}`,
            classTemplateInfo: {
                cardTemplateOverride: {
                    cardRowTemplateInfos: [
                        {
                            twoItems: {
                                startItem: {
                                    firstValue: {
                                        fields: [
                                            {
                                                fieldPath:
                                                    'textModulesData["from"]',
                                            },
                                        ],
                                    },
                                },
                                endItem: {
                                    firstValue: {
                                        fields: [
                                            {
                                                fieldPath:
                                                    "object.textModulesData['to']",
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            linksModuleData: {
                uris: [
                    {
                        uri: "https://hawkhacks.ca/",
                        description: "Hawkhacks 2024",
                        id: "official_site",
                    },
                ],
            },
        };

        try {
            // Try to get the class, if it exists
            const response = await httpClient.request({
                url: `${baseUrl}/genericClass/${classId}`,
                // method: "GET",
                method: "PUT",
                data: updatedClass,
            });

            return {
                result: "Class updated successfully",
                details: response.data,
            };
        } catch (error) {
            if (error instanceof Response && error.status === 404) {
                // Class does not exist, create it
                const createResponse = await httpClient.request({
                    url: `${baseUrl}/genericClass`,
                    method: "POST",
                    data: updatedClass,
                });

                // console.log("Class insert response");
                // console.log(createResponse);

                return {
                    result: "Class created",
                    details: createResponse.data,
                };
            } else {
                console.log(error);
                throw new functions.https.HttpsError(
                    "unknown",
                    "Failed to handle request",
                    error
                );
            }
        }
    }
);

export const createPassObject = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "permission-denied",
                "Not authenticated"
            );
        }
        const userId = context.auth.uid;
        const userRecord = await admin.auth().getUser(userId);
        const fullName = userRecord.displayName || "";
        const names = fullName.split(" ");
        const firstName = names[0] || "Unknown";
        const lastName = names[1] || "Unknown";

        const userEmail = context.auth.token.email || data.email;

        // const userName = context.auth.token.name || "No Name Provided";

        const objectSuffix = userEmail.replace(/[^\w.-]/g, "_");
        const objectId = `${runtimeConfig.googleWallet.issuerId}.${objectSuffix}`;
        const classId = `${runtimeConfig.googleWallet.issuerId}.hawkhacks-ticket`;
        const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";

        const updatedGenericObject = {
            id: `${objectId}`,
            classId: `${classId}`,
            genericType: "GENERIC_TYPE_UNSPECIFIED",
            logo: {
                sourceUri: {
                    uri: "https://hawkhacks.ca/icon.png",
                },
                contentDescription: {
                    defaultValue: {
                        language: "en-US",
                        value: "LOGO_IMAGE_DESCRIPTION",
                    },
                },
            },
            cardTitle: {
                defaultValue: {
                    language: "en-US",
                    value: "HawkHacks 2024",
                },
            },
            subheader: {
                defaultValue: {
                    language: "en-US",
                    value: "Hacker",
                },
            },
            header: {
                defaultValue: {
                    language: "en-US",
                    value: `${firstName} ${lastName}`,
                },
            },
            linksModuleData: {
                uris: [
                    {
                        kind: "walletobjects#uri",
                        uri: "https://www.hawkhacks.ca",
                        description: "Visit HawkHacks",
                    },
                ],
            },
            textModulesData: [
                {
                    id: "from",
                    header: "From",
                    body: "May 12th, 2024",
                },
                {
                    id: "to",
                    header: "To",
                    body: "May 16th, 2024",
                },
            ],
            barcode: {
                type: "QR_CODE",
                value: `${objectId}`,
                alternateText: "QR code goes here",
            },

            hexBackgroundColor: "#006d8f",
            heroImage: {
                sourceUri: {
                    uri: "https://hawkhacks.ca/icon.png",
                },
                contentDescription: {
                    defaultValue: {
                        language: "en-US",
                        value: "HERO_IMAGE_DESCRIPTION",
                    },
                },
            },
        };

        console.log("Pass object being sent:", updatedGenericObject);

        //FOR POSTING NEW OBJECTS
        // try {
        //     const response = await httpClient.request({
        //         url: `${baseUrl}/genericObject`,
        //         method: "POST",
        //         data: updatedGenericObject,
        //     });
        //     console.log("Pass created successfully", response.data);
        // } catch (error) {
        //     console.error("Failed to create pass object", error);
        // }

        //FOR UPDATING OBJECTS
        try {
            const response = await httpClient.request({
                url: `${baseUrl}/genericObject/${objectId}`,
                method: "PATCH",
                data: updatedGenericObject,
            });

            console.log("Pass updated successfully", response.data);
        } catch (error) {
            console.error("Failed to update object", error);
            throw new functions.https.HttpsError(
                "internal",
                "Object update failed"
            );
        }

        const claims = {
            iss: credentials.client_email,
            aud: "google",
            origins: [],
            typ: "savetowallet",
            payload: {
                genericObjects: [updatedGenericObject],
            },
        };

        const token = jwt.sign(claims, credentials.private_key, {
            algorithm: "RS256",
        });
        const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

        const ticketsRef = admin.firestore().collection("tickets");
        await ticketsRef.doc(userId).set({
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            timestamp: new Date(),
        });

        return { url: saveUrl };
    }
);

///////////////////

// Default on-sign-up Claims function
export const addDefaultClaims = functions.auth.user().onCreate(async (user) => {
    const { uid } = user;
    try {
        await admin.auth().setCustomUserClaims(uid, {
            // Default Claims
            admin: false, // Example: set to true for admin users
            phoneVerified: false,
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

export const logEvent = functions.https.onCall((data, context) => {
    const uid = context.auth?.uid;

    const payloadValidation = z.object({
        type: z
            .string()
            .refine((val) => ["error", "info", "log"].includes(val)),
        data: z.any(),
    });

    const result = payloadValidation.safeParse(data);
    if (!result.success) functions.logger.info("Invalid log payload");
    else {
        switch (result.data.type) {
            case "error":
                functions.logger.error({ data: result.data.data, uid });
                break;
            case "info":
                functions.logger.info({ data: result.data.data, uid });
                break;
            default:
                functions.logger.log({ data: result.data.data, uid });
                break;
        }
    }
});

export const verifyRSVP = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Not authenticated"
        );
    }

    functions.logger.info("Verify RSVP called.", { uid: context.auth.uid });

    // only verify once
    const user = await admin.auth().getUser(context.auth.uid);
    if (user.customClaims?.rsvpVerified) {
        return {
            status: 200,
            verified: true,
        };
    } else {
        try {
            functions.logger.info("Verifying RSVP. User: " + context.auth.uid);
            // add to custom claims
            await admin.auth().setCustomUserClaims(user.uid, {
                ...user.customClaims,
                rsvpVerified: true,
            });
        } catch (e) {
            functions.logger.error("Error verifying RSVP.", {
                uid: context.auth.uid,
                error: (e as Error).message,
            });
            throw new functions.https.HttpsError(
                "internal",
                "Service down. 1101"
            );
        }

        return {
            status: 200,
            verified: true,
        };
    }
});

export {
    isTeamNameAvailable,
    createTeam,
    getTeamByUser,
    inviteMember,
    updateTeamName,
    removeMembers,
    deleteTeam,
    validateTeamInvitation,
    rejectInvitation,
    checkInvitation,
} from "./teams";
