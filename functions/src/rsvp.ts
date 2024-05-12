import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpStatus, response } from "./utils";
import { Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";

const WAITLIST_COLLECTION = "waitlist";
const SPOTS_COLLECTION = "spots";

async function sendNotificationEmail(name: string, email: string | undefined) {
    if (!email) {
        throw new Error("No email provided");
    }

    const config = functions.config();
    const RESEND_API_KEY = config.resend.key;
    const NOREPLY_EMAIL = config.email.noreply;
    const FE_URL = config.fe.url;

    functions.logger.info("Sending new available spot email...");
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: email,
        subject: "[HawkHacks] RSVP SPOT!",
        html: `<h1>Hi ${name}</h1><p>Here is you chance to RSVP! Make sure to RSVP within 24 hours to secure your spot.</p><a href="${FE_URL}">Go to Dashboard</a>`,
    });
}

export const withdrawRSVP = functions.https.onCall(async (_, context) => {
    if (!context.auth)
        return response(HttpStatus.UNAUTHORIZED, { message: "unauthorized" });

    try {
        functions.logger.info("Looking for user...", { uid: context.auth.uid });
        const user = await admin.auth().getUser(context.auth.uid);
        functions.logger.info("Dismissing RSVP...", { email: user.email });
        await admin.auth().setCustomUserClaims(user.uid, {
            ...user.customClaims,
            rsvpVerified: false,
        });
        functions.logger.info("RSVP dismissed.", { email: user.email });
        // logout user / prevent old claims to exists in client's device
        // which will allow it to browse all the pages
        await admin.auth().revokeRefreshTokens(user.uid);

        // move next in waitlist to spots
        const snap = await admin
            .firestore()
            .collection(WAITLIST_COLLECTION)
            .orderBy("joinAt", "asc")
            .limit(1)
            .get();
        if (snap.size) {
            const doc = snap.docs[0];
            await admin.firestore().runTransaction(async (tx) => {
                const expires = Timestamp.now().toDate();
                // 24 hours in milliseconds
                const oneDayInMs = 86400000;
                expires.setTime(expires.getTime() + oneDayInMs);
                const expiresAt = Timestamp.fromDate(expires);
                tx.create(
                    admin.firestore().collection(SPOTS_COLLECTION).doc(doc.id),
                    {
                        ...doc.data(),
                        expiresAt,
                    }
                );
                tx.delete(
                    admin
                        .firestore()
                        .collection(WAITLIST_COLLECTION)
                        .doc(doc.id)
                );
            });
            const app = (
                await admin
                    .firestore()
                    .collection("applications")
                    .where("applicantId", "==", user.uid)
                    .get()
            ).docs[0]?.data();
            await sendNotificationEmail(
                app?.firstName ?? user.displayName ?? "",
                user.email
            ).catch((error) =>
                functions.logger.error(
                    "Failed to send notification email about new available spot.",
                    { error }
                )
            );
        }
    } catch (error) {
        functions.logger.error("Failed to unverified rsvp", { error });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Failed to unverified rsvp",
        });
    }

    // move next in waitlist to rsvp
    return response(HttpStatus.OK);
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
            message: "RSVP already verified.",
        };
    } else if (user.customClaims?.isTestAccount) {
        const counterDocRef = admin
            .firestore()
            .collection("rsvpCounter-dev")
            .doc("counter");
        const counterDoc = await counterDocRef.get();

        if (counterDoc.exists) {
            const count = counterDoc.data()?.count || 0;

            if (count >= 5) {
                functions.logger.info("RSVP limit reached.", {
                    uid: context.auth.uid,
                });
                return {
                    status: 400,
                    verified: false,
                    message: "RSVP limit reached.",
                };
            } else {
                await counterDocRef.set({ count: count + 1 }, { merge: true });
            }
        } else {
            await counterDocRef.set({ count: 1 });
        }
        await admin.auth().setCustomUserClaims(user.uid, {
            ...user.customClaims,
            rsvpVerified: true,
        });

        return {
            status: 200,
            verified: true,
        };
    } else {
        try {
            functions.logger.info("Checking user in spots...", {
                email: user.email,
            });
            const spotSnap = await admin
                .firestore()
                .collection(SPOTS_COLLECTION)
                .where("uid", "==", user.uid)
                .get();
            if (!spotSnap.size) {
                functions.logger.info(
                    "User not in waitlist or no empty spots. Rejecting..."
                );
                return {
                    status: 400,
                    verified: false,
                    message: "RSVP limit reached.",
                };
            }
            const spotId = spotSnap.docs[0].id;
            const spotData = spotSnap.docs[0].data();
            if (Timestamp.now().seconds > spotData.expiresAt.seconds) {
                // expired spot, remove
                functions.logger.info(
                    "User verying with an expired spot. Rejecting..."
                );
                await admin.firestore().runTransaction(async (tx) => {
                    const waitListDoc = await tx.get(
                        admin
                            .firestore()
                            .collection(WAITLIST_COLLECTION)
                            .where("uid", "==", user.uid)
                    );
                    tx.delete(
                        admin
                            .firestore()
                            .collection(SPOTS_COLLECTION)
                            .doc(spotId)
                    );
                    const waitlist = waitListDoc.docs[0];
                    if (waitlist) {
                        tx.delete(waitlist.ref);
                    }
                });
                return {
                    status: 400,
                    verified: false,
                    message:
                        "Your chance to RSVP has expired. You can try again by entering the waitlist.",
                };
            } else {
                functions.logger.info("Verifying RSVP...");
                await admin.auth().setCustomUserClaims(user.uid, {
                    ...user.customClaims,
                    rsvpVerified: true,
                });
                await admin.firestore().runTransaction(async (tx) => {
                    const waitListDoc = await tx.get(
                        admin
                            .firestore()
                            .collection(WAITLIST_COLLECTION)
                            .where("uid", "==", user.uid)
                    );
                    const waitlist = waitListDoc.docs[0];
                    tx.delete(
                        admin
                            .firestore()
                            .collection(SPOTS_COLLECTION)
                            .doc(spotId)
                    );
                    if (waitlist) {
                        tx.delete(waitlist.ref);
                    }
                });
            }
        } catch (e) {
            functions.logger.error("Error verifying RSVP.", {
                uid: context.auth.uid,
                error: (e as Error).message,
            });
            throw new functions.https.HttpsError(
                "internal",
                "RSVP service down"
            );
        }

        return {
            status: 200,
            verified: true,
        };
    }
});

export const joinWaitlist = functions.https.onCall(async (_, context) => {
    if (!context.auth)
        return response(HttpStatus.UNAUTHORIZED, { message: "unauthorized" });
    const func = "joinWaitlist";

    try {
        const user = await admin.auth().getUser(context.auth.uid);
        if (user.customClaims?.rsvpVerified) {
            return response(HttpStatus.BAD_REQUEST, { message: "User RSVP'd" });
        }

        const snap = await admin
            .firestore()
            .collection(WAITLIST_COLLECTION)
            .where("uid", "==", user.uid)
            .get();
        if (snap.size > 0) {
            return response(HttpStatus.BAD_REQUEST, {
                message: "User in waitlist already",
            });
        }

        await admin.firestore().collection(WAITLIST_COLLECTION).add({
            uid: user.uid,
            joinAt: Timestamp.now(),
        });
    } catch (error) {
        functions.logger.error("Error joining waitlist.", { error, func });
        throw new functions.https.HttpsError(
            "internal",
            "Waitlist service down."
        );
    }

    return response(HttpStatus.OK);
});

export const expiredSpotCleanup = functions.pubsub
    .schedule("every 30 minutes")
    .onRun(async () => {
        functions.logger.info("Start expired spot clean up");
        const batch = admin.firestore().batch();
        let snap = await admin
            .firestore()
            .collection(SPOTS_COLLECTION)
            .where("expiresAt", "<", Timestamp.now())
            .get();
        const count = snap.size;
        snap.forEach((doc) => {
            batch.delete(doc.ref);
        });
        snap = await admin
            .firestore()
            .collection(WAITLIST_COLLECTION)
            .orderBy("joinAt", "asc")
            .limit(count)
            .get();
        // 24 hours in milliseconds
        const oneDayInMs = 86400000;
        snap.forEach((doc) => {
            const expires = Timestamp.now().toDate();
            expires.setTime(expires.getTime() + oneDayInMs);
            const expiresAt = Timestamp.fromDate(expires);
            batch.create(
                admin.firestore().collection(SPOTS_COLLECTION).doc(doc.id),
                { ...doc.data(), expiresAt }
            );
            batch.delete(doc.ref);
        });
        await batch.commit();
    });
