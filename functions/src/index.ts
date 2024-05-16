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
import { v4 as uuidv4 } from "uuid";
import { HttpStatus, response } from "./utils";
import * as QRCode from "qrcode";

const config = functions.config();

admin.initializeApp();

export const fetchOrGenerateTicket = functions.https.onCall(
    async (_, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "permission-denied",
                "User must be authenticated to initiate this operation."
            );
        }

        const userId = context.auth.uid;
        const ticketsRef = admin.firestore().collection("tickets");
        const ticketQuery = await ticketsRef
            .where("userId", "==", userId)
            .limit(1)
            .get();

        if (ticketQuery.empty) {
            let ticketId = "";
            let createTicket = false;
            const snap = await admin
                .firestore()
                .collection("tickets")
                .where("userId", "==", context.auth.uid)
                .get();
            const data = snap.docs[0]?.data();
            if (!data) {
                ticketId = uuidv4();
                createTicket = true;
            } else {
                ticketId = data.ticketId;
            }
            const qrCodeValue = `${config.fe.url}/ticket/${ticketId}`;

            try {
                const qrCodeDataURL = await QRCode.toDataURL(qrCodeValue, {
                    width: 256,
                });

                const base64Data = qrCodeDataURL.split(",")[1];
                const buffer = Buffer.from(base64Data, "base64");

                const storageRef = admin.storage().bucket();
                const fileRef = storageRef.file(
                    `qrCodes/${userId}/${ticketId}.png`
                );
                await fileRef.save(buffer, {
                    metadata: {
                        contentType: "image/png",
                    },
                });

                await fileRef.makePublic();

                const qrCodeUrl = fileRef.publicUrl();

                if (createTicket) {
                    await ticketsRef.doc(ticketId).set({
                        userId: userId,
                        ticketId: ticketId,
                        qrCodeUrl: qrCodeUrl,
                        foods: [],
                        events: [],
                        timestamp: new Date(),
                    });
                } else {
                    await admin
                        .firestore()
                        .collection("tickets")
                        .doc(ticketId)
                        .update({
                            qrCodeUrl: qrCodeUrl,
                            timestamp: new Date(),
                        });
                }

                return { qrCodeUrl };
            } catch (error) {
                functions.logger.error(
                    "Error generating or uploading QR code:",
                    error
                );
                throw new functions.https.HttpsError(
                    "internal",
                    "Failed to generate or upload QR code",
                    error instanceof Error ? error.message : "Unknown error"
                );
            }
        } else {
            const ticketData = ticketQuery.docs[0].data();
            return { qrCodeUrl: ticketData.qrCodeUrl };
        }
    }
);

// Default on-sign-up Claims function
export const addDefaultClaims = functions.auth.user().onCreate(async (user) => {
    const { uid } = user;
    try {
        await admin.auth().setCustomUserClaims(uid, {
            // Default Claims
            admin: false, // Example: set to true for admin users
            phoneVerified: false,
            rsvpVerified: false,
            type: "hacker",
        });
        functions.logger.info(`Custom claims added for user: ${uid}`);
    } catch (error) {
        functions.logger.error("Error adding custom claims:", error);
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

interface Socials {
    instagram: string;
    github: string;
    linkedin: string;
    discord: string;
    resumeRef: string;
    docId: string;
    uid: string;
    resumeVisibility: "Public" | "Private" | "Sponsors Only";
}

export const requestSocials = functions.https.onCall(async (_, context) => {
    if (!context.auth)
        return response(HttpStatus.UNAUTHORIZED, { message: "unauthorized" });

    const func = "requestSocials";

    functions.logger.info("Getting socials...");
    let socials: Socials | undefined;
    try {
        const snap = await admin
            .firestore()
            .collection("socials")
            .where("uid", "==", context.auth.uid)
            .get();
        socials = snap.docs[0]?.data() as Socials;
    } catch (e) {
        functions.logger.error("Failed to get socials.", { error: e, func });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "internal (get_socials) ",
        });
    }

    if (!socials) {
        // create a new socials document
        const app = (
            await admin
                .firestore()
                .collection("applications")
                .where("applicantId", "==", context.auth.uid)
                .get()
        ).docs[0]?.data();
        const docId = uuidv4();

        if (!app) {
            functions.logger.info(
                "Creating new socials with default values..."
            );
            // create with default
            socials = {
                instagram: "",
                github: "",
                linkedin: "",
                discord: "",
                resumeRef: "",
                docId,
                uid: context.auth.uid,
                resumeVisibility: "Public",
            };
        } else {
            functions.logger.info(
                "Creating new socials with selected application values..."
            );
            socials = {
                instagram: "",
                github: app.githubUrl ?? "",
                linkedin: app.linkedUrl ?? "",
                discord: app.discord,
                resumeRef:
                    app.participatingAs === "Mentor"
                        ? app.mentorResumeRef
                        : app.generalResumeRef,
                docId,
                uid: context.auth.uid,
                resumeVisibility: "Public",
            };
        }
        await admin.firestore().collection("socials").doc(docId).set(socials);
        functions.logger.info("Socials saved.");
    }

    return response(HttpStatus.OK, { message: "ok", data: socials });
});

export const updateSocials = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        functions.logger.info("Authentication required.");
        throw new functions.https.HttpsError(
            "permission-denied",
            "Not authenticated"
        );
    }

    functions.logger.info("Updating socials:", data);
    functions.logger.info("User ID in Func:", context.auth.uid);

    try {
        const doc = await admin
            .firestore()
            .collection("socials")
            .doc(data.docId)
            .get();
        if (!doc.exists)
            return response(HttpStatus.NOT_FOUND, { message: "not found" });

        const socials = doc.data() as Socials;
        if (socials.uid !== context.auth.uid)
            return response(HttpStatus.UNAUTHORIZED, {
                message: "cannot update socials",
            });

        functions.logger.info("Payload", { data });
        functions.logger.info("Updating socials for application:", doc.id);
        functions.logger.info("Data in ref:", doc);

        await admin.firestore().collection("socials").doc(doc.id).update({
            instagram: data.instagram,
            linkedin: data.linkedin,
            github: data.github,
            discord: data.discord,
            resumeRef: data.resumeRef,
            resumeVisibility: data.resumeVisibility,
        });
        functions.logger.info("Socials updated:", data);
        return response(HttpStatus.OK, { message: "ok" });
    } catch (error) {
        functions.logger.error("Failed to update socials", { error });
        throw new functions.https.HttpsError(
            "internal",
            "Failed to update socials",
            error
        );
    }
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

async function internalGetTicketData(id: string, extended = false) {
    functions.logger.info("Checking for ticket data...");
    const ticketDoc = await admin
        .firestore()
        .collection("tickets")
        .doc(id)
        .get();
    if (!ticketDoc.exists) {
        return response(HttpStatus.NOT_FOUND, { message: "not found" });
    }

    const ticket = ticketDoc.data() as {
        userId: string;
        foods: string[];
        events: string[];
    };

    functions.logger.info("Checking for application data...");
    const app = (
        await admin
            .firestore()
            .collection("applications")
            .where("applicantId", "==", ticket.userId)
            .get()
    ).docs[0]?.data();
    let firstName = "";
    let lastName = "";
    let pronouns = "";
    let discord = "";
    let linkedin = "";
    let github = "";
    let resumeRef = "";
    let allergies: string[] = [];

    if (!app) {
        // grab from user record
        functions.logger.info(
            "No application data, taking name from user record."
        );
        const user = await admin.auth().getUser(ticket.userId);
        const parts = user.displayName?.split(" ") ?? ["", ""];
        firstName = parts[0];
        lastName = parts[1];
    } else {
        firstName = app.firstName;
        lastName = app.lastName;
        pronouns = app.pronouns;
        discord = app.discord ?? "";
        linkedin = app.linkedinUrl ?? "";
        github = app.githubUrl ?? "";
        resumeRef =
            app.participatingAs === "Mentor"
                ? app.mentorResumeRef
                : app.generalResumeRef;
        allergies = app.allergies ?? [];
    }

    // get social ticket
    functions.logger.info("Checking for social data...");
    let socials = (
        await admin
            .firestore()
            .collection("socials")
            .where("uid", "==", ticket.userId)
            .get()
    ).docs[0]?.data();
    if (!socials) {
        functions.logger.info("No socials found, using default data...");
        socials = {
            instagram: "",
            linkedin: linkedin ?? "",
            github: github ?? "",
            discord: discord ?? "",
            resumeRef: resumeRef ?? "",
            docId: "",
            resumeVisibility: "Public",
        } as Socials;
    }

    const data = {
        firstName,
        lastName,
        pronouns,
        foods: [] as string[],
        events: [] as string[],
        allergies,
        ...socials,
    };

    if (extended) {
        data.foods = ticket.foods;
        data.events = ticket.events;
    }

    return data;
}

export const getTicketData = functions.https.onCall(async (data) => {
    if (!z.string().uuid().safeParse(data.id).success) {
        return response(HttpStatus.BAD_REQUEST, { message: "bad request" });
    }

    try {
        const ticketData = await internalGetTicketData(data.id);
        return response(HttpStatus.OK, {
            message: "ok",
            data: ticketData,
        });
    } catch (e) {
        functions.logger.error("Failed to get ticket data.", { error: e });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "internal error",
        });
    }
});

export const getExtendedTicketData = functions.https.onCall(async (data) => {
    if (!z.string().uuid().safeParse(data.id).success) {
        return response(HttpStatus.BAD_REQUEST, { message: "bad request" });
    }

    try {
        const ticketData = await internalGetTicketData(data.id, true);

        return response(HttpStatus.OK, {
            message: "ok",
            data: ticketData,
        });
    } catch (e) {
        functions.logger.error("Failed to get extended ticket data.", {
            error: e,
        });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "internal error",
        });
    }
});

export const redeemItem = functions.https.onCall(async (data, context) => {
    if (!context.auth)
        return response(HttpStatus.UNAUTHORIZED, { message: "unauthorized" });

    const user = await admin.auth().getUser(context.auth.uid);
    if (!user.customClaims?.admin)
        return response(HttpStatus.UNAUTHORIZED, { message: "unauthorized" });

    const validateResults = z
        .object({
            ticketId: z.string(),
            itemId: z.string(),
            action: z.string().refine((v) => v === "check" || "uncheck"),
        })
        .safeParse(data);
    if (!validateResults.success) {
        functions.logger.error("Bad request", {
            issues: validateResults.error.issues.map((i) => i.path),
        });
        return response(HttpStatus.BAD_REQUEST, { message: "bad request" });
    }

    const ticket = (
        await admin.firestore().collection("tickets").doc(data.ticketId).get()
    ).data();
    if (!ticket)
        return response(HttpStatus.NOT_FOUND, { message: "ticket not found" });

    let events = [];
    if (data.action === "check") {
        events = [...ticket.events, data.itemId];
        await admin
            .firestore()
            .collection("tickets")
            .doc(data.ticketId)
            .update({ events });
    } else {
        events = ticket.events.filter((evt: string) => evt !== data.itemId);
        await admin
            .firestore()
            .collection("tickets")
            .doc(data.ticketId)
            .update({ events });
    }

    return response(HttpStatus.OK, { data: events });
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
    getUserInvitations,
} from "./teams";

export { createTicket } from "./apple";

export { createPassClass, createPassObject } from "./google";

export {
    verifyRSVP,
    withdrawRSVP,
    joinWaitlist,
    // expiredSpotCleanup,
    // moveToSpots,
} from "./rsvp";
