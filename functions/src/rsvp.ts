import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpStatus, response } from "./utils";
import { Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";
import { v4 as uuid } from "uuid";

const WAITLIST_COLLECTION = "waitlist";
const SPOTS_COLLECTION = "spots";
const SPOTS_COUNTER_DOCUMENT = "available-spots";

async function sendNotificationEmail(name: string, email: string | undefined) {
    if (!email) {
        throw new Error("No email provided");
    }

    const config = functions.config();
    const RESEND_API_KEY = config.resend.key;
    const NOREPLY_EMAIL = config.email.noreply;
    const FE_URL = config.fe.url;

    functions.logger.info("Sending new available spot email...", { email });
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: email,
        subject: "[HawkHacks] RSVP SPOT!",
        html: `<!DOCTYPE html><html dir="ltr"lang="en"xmlns="http://www.w3.org/1999/xhtml"xmlns:o="urn:schemas-microsoft-com:office:office"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><meta name="x-apple-disable-message-reformatting"><meta content="IE=edge"http-equiv="X-UA-Compatible"><meta content="telephone=no"name="format-detection"><title>Copy of (1) New Message</title><!--[if (mso 16)]><style>a{text-decoration:none}</style><![endif]--><!--[if gte mso 9]><style>sup{font-size:100%!important}</style><![endif]--><!--[if gte mso 9]><xml><o:officedocumentsettings><o:allowpng></o:allowpng><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml><![endif]--><style>.rollover:hover .rollover-first{max-height:0!important;display:none!important}.rollover:hover .rollover-second{max-height:none!important;display:block!important}.rollover span{font-size:0}u+.body img~div div{display:none}#outlook a{padding:0}span.MsoHyperlink,span.MsoHyperlinkFollowed{color:inherit;mso-style-priority:99}a.es-button{mso-style-priority:100!important;text-decoration:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.es-desk-hidden{display:none;float:left;overflow:hidden;width:0;max-height:0;line-height:0;mso-hide:all}.es-button-border:hover>a.es-button{color:#fff!important}@media only screen and (max-width:600px){.es-m-p0r{padding-right:0!important}.es-m-p0l{padding-left:0!important}[class=gmail-fix]{display:none!important}a,p{line-height:150%!important}h1,h1 a{line-height:120%!important}h2,h2 a{line-height:120%!important}h3,h3 a{line-height:120%!important}h4,h4 a{line-height:120%!important}h5,h5 a{line-height:120%!important}h6,h6 a{line-height:120%!important}h1{font-size:36px!important;text-align:left}h2{font-size:26px!important;text-align:left}h3{font-size:20px!important;text-align:left}h4{font-size:24px!important;text-align:left}h5{font-size:20px!important;text-align:left}h6{font-size:16px!important;text-align:left}.es-content-body h1 a,.es-footer-body h1 a,.es-header-body h1 a{font-size:36px!important}.es-content-body h2 a,.es-footer-body h2 a,.es-header-body h2 a{font-size:26px!important}.es-content-body h3 a,.es-footer-body h3 a,.es-header-body h3 a{font-size:20px!important}.es-content-body h4 a,.es-footer-body h4 a,.es-header-body h4 a{font-size:24px!important}.es-content-body h5 a,.es-footer-body h5 a,.es-header-body h5 a{font-size:20px!important}.es-content-body h6 a,.es-footer-body h6 a,.es-header-body h6 a{font-size:16px!important}.es-menu td a{font-size:12px!important}.es-header-body a,.es-header-body p{font-size:14px!important}.es-content-body a,.es-content-body p{font-size:16px!important}.es-footer-body a,.es-footer-body p{font-size:14px!important}.es-infoblock a,.es-infoblock p{font-size:12px!important}.es-m-txt-c,.es-m-txt-c h1,.es-m-txt-c h2,.es-m-txt-c h3,.es-m-txt-c h4,.es-m-txt-c h5,.es-m-txt-c h6{text-align:center!important}.es-m-txt-r,.es-m-txt-r h1,.es-m-txt-r h2,.es-m-txt-r h3,.es-m-txt-r h4,.es-m-txt-r h5,.es-m-txt-r h6{text-align:right!important}.es-m-txt-j,.es-m-txt-j h1,.es-m-txt-j h2,.es-m-txt-j h3,.es-m-txt-j h4,.es-m-txt-j h5,.es-m-txt-j h6{text-align:justify!important}.es-m-txt-l,.es-m-txt-l h1,.es-m-txt-l h2,.es-m-txt-l h3,.es-m-txt-l h4,.es-m-txt-l h5,.es-m-txt-l h6{text-align:left!important}.es-m-txt-c img,.es-m-txt-l img,.es-m-txt-r img{display:inline!important}.es-m-txt-c .rollover:hover .rollover-second,.es-m-txt-l .rollover:hover .rollover-second,.es-m-txt-r .rollover:hover .rollover-second{display:inline!important}.es-m-txt-c .rollover span,.es-m-txt-l .rollover span,.es-m-txt-r .rollover span{line-height:0!important;font-size:0!important}.es-spacer{display:inline-table}a.es-button,button.es-button{font-size:20px!important;line-height:120%!important}.es-button-border,a.es-button,button.es-button{display:inline-block!important}.es-m-fw,.es-m-fw .es-button,.es-m-fw.es-fw{display:block!important}.es-m-il,.es-m-il .es-button,.es-menu,.es-social,.es-social td{display:inline-block!important}.es-adaptive table,.es-left,.es-right{width:100%!important}.es-content,.es-content table,.es-footer,.es-footer table,.es-header,.es-header table{width:100%!important;max-width:600px!important}.adapt-img{width:100%!important;height:auto!important}.es-hidden,.es-mobile-hidden{display:none!important}.es-desk-hidden{width:auto!important;overflow:visible!important;float:none!important;max-height:inherit!important;line-height:inherit!important}tr.es-desk-hidden{display:table-row!important}table.es-desk-hidden{display:table!important}td.es-desk-menu-hidden{display:table-cell!important}.es-menu td{width:1%!important}.esd-block-html table,table.es-table-not-adapt{width:auto!important}.es-social td{padding-bottom:10px}.h-auto{height:auto!important}.es-text-5004,.es-text-5004 a,.es-text-5004 b,.es-text-5004 em,.es-text-5004 h1,.es-text-5004 h2,.es-text-5004 h3,.es-text-5004 h4,.es-text-5004 h5,.es-text-5004 h6,.es-text-5004 i,.es-text-5004 li,.es-text-5004 ol,.es-text-5004 p,.es-text-5004 span,.es-text-5004 strong,.es-text-5004 sub,.es-text-5004 sup,.es-text-5004 u,.es-text-5004 ul{font-size:20px!important}}@media screen and (max-width:384px){.mail-message-content{width:414px!important}}</style><body class="body"style="width:100%;height:100%;padding:0;Margin:0"><div class="es-wrapper-color"dir="ltr"lang="en"style="background-color:#fafafa"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#fafafa"width="100%"class="es-wrapper"><tr><td style="padding:0;Margin:0"valign="top"><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;width:100%;table-layout:fixed!important"class="es-content"align="center"><tr><td style="padding:0;Margin:0"align="center"><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:#fff;width:600px"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td style="Margin:0;padding-top:30px;padding-right:20px;padding-bottom:10px;padding-left:20px"align="left"><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"width="100%"><tr><td style="padding:0;Margin:0;width:560px"align="center"valign="top"><table cellpadding="0"cellspacing="0"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"width="100%"><tr><td style="padding:0;Margin:0;font-size:0"align="center"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"style="display:block;font-size:14px;border:0;outline:0;text-decoration:none"width="560"><tr><td style="padding:0;Margin:0;font-size:0"align="center"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"style="display:block;font-size:14px;border:0;outline:0;text-decoration:none"width="330"><tr><td style="padding:0;Margin:0;padding-bottom:10px"align="center"class="es-m-txt-c"><h1 style="Margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:700;line-height:46px;color:#333">Hi ${name},here is your chance to RSVP!</h1><tr><td style="Margin:0;padding-top:5px;padding-right:40px;padding-bottom:5px;padding-left:40px"align="center"class="es-m-p0l es-m-p0r es-text-5004"><p style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:30px;letter-spacing:0;color:#333;font-size:20px">Make sure to RSVP within 24 hours to secure your spot.</table></table><tr><td style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-bottom:30px"align="left"><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"width="100%"><tr><td style="padding:0;Margin:0;width:560px"align="center"valign="top"><table cellpadding="0"cellspacing="0"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:separate;border-spacing:0;border-radius:5px"width="100%"><tr><td style="padding:0;Margin:0;padding-bottom:10px;padding-top:10px"align="center"><span class="es-button-border"style="border-style:solid;border-color:#2cb543;background:#2b6469;border-width:0;display:inline-block;border-radius:6px;width:auto"><a href="${FE_URL}"style="mso-style-priority:100!important;text-decoration:none!important;mso-line-height-rule:exactly;color:#fff;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#2b6469;border-radius:6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-weight:400;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #2b6469;padding-left:30px;padding-right:30px"target="_blank"class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;width:100%;table-layout:fixed!important;background-color:transparent;background-repeat:repeat;background-position:center top"class="es-footer"align="center"><tr><td style="padding:0;Margin:0"align="center"><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent;width:640px"class="es-footer-body"align="center"><tr><td style="Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;padding-bottom:20px"align="left"><table cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"width="100%"><tr><td style="padding:0;Margin:0;width:600px"align="left"><table cellpadding="0"cellspacing="0"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"width="100%"><tr><td style="padding:0;Margin:0;padding-bottom:35px"align="center"><p style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:18px;letter-spacing:0;color:#333;font-size:12px">Copyright © 2024 HawkHacks<tr><td style="padding:0;Margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"><table cellpadding="0"cellspacing="0"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"width="100%"class="es-menu"><tr class="links"><td style="Margin:0;border:0;padding-bottom:5px;padding-top:5px;padding-right:5px;padding-left:5px"align="center"valign="top"width="50.00%"><a href="https://hawkhacks.ca/"style="mso-line-height-rule:exactly;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';display:block;color:#999;font-size:12px"target="_blank">Visit Us</a><td style="Margin:0;border:0;padding-bottom:5px;padding-top:5px;padding-right:5px;padding-left:5px;border-left:1px solid #ccc"align="center"valign="top"width="50.00%"><a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style="mso-line-height-rule:exactly;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';display:block;color:#999;font-size:12px"target="_blank">Code of Conduct</a></table></table></table></table></table></table></div>`,
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
            functions.logger.info("Next user in waitlist found");
            const doc = snap.docs[0];
            const user = await admin.auth().getUser(doc.data().uid);
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
        } else {
            functions.logger.info(
                "No user in waitlist, adding empty spot to counter"
            );
            // record the number of spots that are available when no one is in the waitlist
            const counterDoc = await admin
                .firestore()
                .collection(SPOTS_COLLECTION)
                .doc(SPOTS_COUNTER_DOCUMENT)
                .get();
            const counterData = counterDoc.data();
            if (counterDoc.exists && counterData) {
                functions.logger.info("Spot counter found");
                await admin
                    .firestore()
                    .collection(SPOTS_COLLECTION)
                    .doc(SPOTS_COUNTER_DOCUMENT)
                    .update({
                        count: counterData.count + 1,
                    });
            } else {
                functions.logger.info("Spot counter not found, creating...");
                await admin
                    .firestore()
                    .collection(SPOTS_COLLECTION)
                    .doc(SPOTS_COUNTER_DOCUMENT)
                    .set({ count: 1 });
            }
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

        // this only occurs if no one was in the waitlist and there are spots
        functions.logger.info("Checking if there are spots available");
        const spotCounterSnap = await admin
            .firestore()
            .collection(SPOTS_COLLECTION)
            .doc(SPOTS_COUNTER_DOCUMENT)
            .get();
        const spotCounterData = spotCounterSnap.data();
        if (spotCounterData && spotCounterData.count > 0) {
            functions.logger.info("Empty spot found");
            await admin.firestore().runTransaction(async (tx) => {
                tx.update(spotCounterSnap.ref, {
                    count: spotCounterData.count - 1,
                });
                const expires = Timestamp.now().toDate();
                // 24 hours in milliseconds
                const oneDayInMs = 86400000;
                expires.setTime(expires.getTime() + oneDayInMs);
                const expiresAt = Timestamp.fromDate(expires);
                tx.create(
                    admin.firestore().collection(SPOTS_COLLECTION).doc(uuid()),
                    { uid: user.uid, expiresAt }
                );
            });
            await sendNotificationEmail(
                user.displayName ?? "",
                user.email
            ).catch((error) =>
                functions.logger.error(
                    "Failed to send notification email for rsvp",
                    { error, func }
                )
            );
        } else {
            functions.logger.info("No empty spot found, adding to waitlist");
            await admin.firestore().collection(WAITLIST_COLLECTION).add({
                uid: user.uid,
                joinAt: Timestamp.now(),
            });
        }
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
