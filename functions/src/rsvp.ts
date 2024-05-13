import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpStatus, response } from "./utils";
import { Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";
import { v4 as uuid } from "uuid";

const WAITLIST_COLLECTION = "waitlist";
const SPOTS_COLLECTION = "spots";
const SPOTS_COUNTER_DOCUMENT = "available-spots";

const config = functions.config();
const RESEND_API_KEY = config.resend.key;
const NOREPLY_EMAIL = config.email.noreply;
const resend = new Resend(RESEND_API_KEY);

async function sendSpotAvailableEmail(name: string, email: string | undefined) {
    if (!email) {
        throw new Error("No email provided");
    }

    functions.logger.info("Sending new available spot email...", { email });
    await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: email,
        subject: "[HawkHacks] RSVP SPOT!",
        html: `
<!doctypehtml><html dir="ltr"xmlns="http://www.w3.org/1999/xhtml"xmlns:o="urn:schemas-microsoft-com:office:office"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><meta name="x-apple-disable-message-reformatting"><meta content="IE=edge"http-equiv="X-UA-Compatible"><meta content="telephone=no"name="format-detection"><title></title><!--[if (mso 16)
        ]><style>
            a {
                text-decoration: none;
            }
        </style><!
    [endif]--><!--[if gte mso 9
        ]><style>
            sup {
                font-size: 100% !important;
            }
        </style><!
    [endif]--><!--[if gte mso 9
        ]><xml
            ><o:officedocumentsettings
                ><o:allowpng></o:allowpng
                ><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings
            ></xml
        ><!
    [endif]--><!--[if mso]>
        <style type="text/css">
            ul {
         margin: 0 !important;
         }
         ol {
         margin: 0 !important;
         }
         li {
         margin-left: 47px !important;
         }
       
        </style><![endif]
       --><body class="body"><div class="es-wrapper-color"dir="ltr"><!--[if gte mso 9
                ]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"width="100%"class="es-wrapper"><tr><td class="esd-email-paddings"valign="top"><table cellpadding="0"cellspacing="0"class="es-content"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="600"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td class="es-p10b es-p20l es-p20r es-p30t esd-structure"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="es-p20b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"width="560"></a><tr><td class="es-p30b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"width="330"></a><tr><td class="esd-block-text es-m-txt-c es-p15b es-text-6134"align="center"><h1 style='font-size:36px;line-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Hi ${name}, it's time to RSVP!</h1><tr><td class="esd-block-text es-m-p0l es-m-p0r es-p40l es-p40r es-p5b es-p5t es-text-5004"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:20px;line-height:150%'>The wait is finally over - you’re next in line!<br><br>This is your <strong>last chance</strong> to attend HawkHacks! Make sure to <strong>RSVP within the next 24 hours</strong> to secure your spot. After this period, <strong>you will not be given another opportunity!</strong><br><br>Good luck, and hope to see you soon!</table></table><tr><td class="es-p20l es-p20r esd-structure es-p30b"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"style="border-radius:5px;border-collapse:separate"><tr><td class="es-p10t es-p30b esd-block-button"align="center"><span class="es-button-border"style="border-radius:6px;background:#2b6469"><a target="_blank"href="${config.fe.url}"style='padding:10px 30px 10px 30px;color:#fff;font-size:20px;border-radius:6px;background:#2b6469;mso-border-alt:10px solid #2b6469;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="640"class="es-footer-body"align="center"style="background-color:transparent"><tr><td class="es-p20l es-p20r esd-structure es-p20b es-p20t"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="left"width="600"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-block-text es-p35b"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Copyright © 2024 HawkHacks<tr><td class="esd-block-menu"style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'esd-tmp-divider="1|solid|#cccccc"esd-tmp-menu-color="#999999"esd-tmp-menu-padding="5|5"><table cellpadding="0"cellspacing="0"width="100%"class="es-menu"><tr><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px"><a target="_blank"href="https://hawkhacks.ca/"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Visit Us</a><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px;border-left:1px solid #ccc"><a target="_blank"href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Code of Conduct</a></table></tr></table></table></table></table></table></div>
`,
    });
}

async function sendJoinedWaitlistEmail(name: string, email: string) {
    if (!email) {
        throw new Error("No email provided");
    }

    functions.logger.info("Sending new available spot email...", { email });
    await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: email,
        subject: "[HawkHacks] JOINED WAITLIST!",
        html: `
<!doctypehtml><html dir="ltr"xmlns="http://www.w3.org/1999/xhtml"xmlns:o="urn:schemas-microsoft-com:office:office"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><meta name="x-apple-disable-message-reformatting"><meta content="IE=edge"http-equiv="X-UA-Compatible"><meta content="telephone=no"name="format-detection"><title></title><!--[if (mso 16)
        ]><style>
            a {
                text-decoration: none;
            }
        </style><!
    [endif]--><!--[if gte mso 9
        ]><style>
            sup {
                font-size: 100% !important;
            }
        </style><!
    [endif]--><!--[if gte mso 9
        ]><xml
            ><o:officedocumentsettings
                ><o:allowpng></o:allowpng
                ><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings
            ></xml
        ><!
    [endif]--><!--[if mso]>
        <style type="text/css">
            ul {
         margin: 0 !important;
         }
         ol {
         margin: 0 !important;
         }
         li {
         margin-left: 47px !important;
         }
       
        </style><![endif]
       --><body class="body"><div class="es-wrapper-color"dir="ltr"><!--[if gte mso 9
                ]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"width="100%"class="es-wrapper"><tr><td class="esd-email-paddings"valign="top"><table cellpadding="0"cellspacing="0"class="es-content"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="600"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td class="es-p10b es-p20l es-p20r es-p30t esd-structure"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="es-p20b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"width="560"></a><tr><td class="es-p30b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"width="330"></a><tr><td class="esd-block-text es-m-txt-c es-p15b es-text-6134"align="center"><h1 style='font-size:36px;line-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Hi ${name}, you're on the waitlist!</h1><tr><td class="esd-block-text es-m-p0l es-m-p0r es-p40l es-p40r es-p5b es-p5t es-text-5004"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",so t Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:20px;line-height:150%'>You will get another email from us if there is a spot for you.<br>Make sure to check your email everyday and/or open the dashboard.</table></table><tr><td class="es-p20l es-p20r esd-structure es-p30b"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"style="border-radius:5px;border-collapse:separate"><tr><td class="es-p10t es-p30b esd-block-button"align="center"><span class="es-button-border"style="border-radius:6px;background:#2b6469"><a target="_blank"href="${config.fe.url}"style='padding:10px 30px 10px 30px;font-size:20px;text-decoration:none;color:#fff;border-radius:6px;background:#2b6469;mso-border-alt:10px solid #2b6469;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="640"class="es-footer-body"align="center"style="background-color:transparent"><tr><td class="es-p20l es-p20r esd-structure es-p20b es-p20t"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="left"width="600"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-block-text es-p35b"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Copyright © 2024 HawkHacks<tr><td class="esd-block-menu"style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'esd-tmp-divider="1|solid|#cccccc"esd-tmp-menu-color="#999999"esd-tmp-menu-padding="5|5"><table cellpadding="0"cellspacing="0"width="100%"class="es-menu"><tr><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px"><a target="_blank"href="https://hawkhacks.ca/"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Visit Us</a><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px;border-left:1px solid #ccc"><a target="_blank"href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Code of Conduct</a></table></tr></table></table></table></table></table></div>
`,
    });
}

async function sendRSVPConfirmedEmail(name: string, email: string) {
    if (!email) {
        throw new Error("No email provided");
    }

    functions.logger.info("Sending new available spot email...", { email });
    await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: email,
        subject: "[HawkHacks] RSVP CONFIRMED!",
        html: `<!DOCTYPE html><html dir="ltr"xmlns="http://www.w3.org/1999/xhtml"xmlns:o="urn:schemas-microsoft-com:office:office"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><meta name="x-apple-disable-message-reformatting"><meta content="IE=edge"http-equiv="X-UA-Compatible"><meta content="telephone=no"name="format-detection"><title></title><!--[if (mso 16)
    ]><style>
      a {
        text-decoration: none;
      }
    </style><!
  [endif]--><!--[if gte mso 9
    ]><style>
      sup {
        font-size: 100% !important;
      }
    </style><!
  [endif]--><!--[if gte mso 9
    ]><xml
      ><o:officedocumentsettings
        ><o:allowpng></o:allowpng
        ><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings
      ></xml
    ><!
  [endif]--><!--[if mso]>
    <style type="text/css">
        ul {
     margin: 0 !important;
     }
     ol {
     margin: 0 !important;
     }
     li {
     margin-left: 47px !important;
     }
   
    </style><![endif]
   --><body class="body"><div class="es-wrapper-color"dir="ltr"><!--[if gte mso 9
        ]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"width="100%"class="es-wrapper"><tr><td class="esd-email-paddings"valign="top"><table cellpadding="0"cellspacing="0"class="es-content"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="600"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td class="es-p10b es-p20l es-p20r es-p30t esd-structure"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="es-p20b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"width="560"></a><tr><td class="es-p30b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"width="330"></a><tr><td class="esd-block-text es-m-txt-c es-p15b es-text-6134"align="center"><h1 style="font-size:36px;line-height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Hi ${name}, you have RSVP'd!</h1><tr><td class="esd-block-text es-m-p0l es-m-p0r es-p40l es-p40r es-p5b es-p5t es-text-5004"align="center"><p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',so t Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:20px;line-height:150%">See you soon at HawkHacks!</table></table><tr><td class="es-p20l es-p20r esd-structure es-p30b"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"style="border-radius:5px;border-collapse:separate"><tr><td class="es-p10t es-p30b esd-block-button"align="center"><span class="es-button-border"style="border-radius:6px;background:#2b6469"><a target="_blank"href="${config.fe.url}"style="padding:10px 30px 10px 30px;text-align:center;font-style:normal;width:auto;line-height:24px;text-decoration:none!important;font-size:20px;color:#fff;border-radius:6px;background:#2b6469;mso-border-alt:10px solid #2b6469;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="640"class="es-footer-body"align="center"style="background-color:transparent"><tr><td class="es-p20l es-p20r esd-structure es-p20b es-p20t"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="left"width="600"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-block-text es-p35b"align="center"><p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Copyright © 2024 HawkHacks<tr><td class="esd-block-menu"style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"esd-tmp-divider="1|solid|#cccccc"esd-tmp-menu-color="#999999"esd-tmp-menu-padding="5|5"><table cellpadding="0"cellspacing="0"width="100%"class="es-menu"><tr><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px"><a target="_blank"href="https://hawkhacks.ca/"style="color:#999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Visit Us</a><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px;border-left:1px solid #ccc"><a target="_blank"href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style="color:#999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Code of Conduct</a></table></tr></table></table></table></table></table></div>
`,
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
            await sendSpotAvailableEmail(
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
                .orderBy("expiresAt", "desc")
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
                functions.logger.info("Spot removed.", { func: "verifyRSVP" });
                return {
                    status: 400,
                    verified: false,
                    message:
                        "Your chance to RSVP has expired. You can try again by entering the waitlist.",
                };
            } else {
                functions.logger.info("Verifying RSVP...");
                const app = (
                    await admin
                        .firestore()
                        .collection("applications")
                        .where("applicantId", "==", user.uid)
                        .get()
                ).docs[0]?.data();
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
                await sendRSVPConfirmedEmail(
                    app?.firstName ?? user.displayName ?? "",
                    user.email ?? ""
                ).catch((error) =>
                    functions.logger.error(
                        "Failed to send rsvp confirmed email.",
                        { error }
                    )
                );
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
        if (!user.customClaims)
            return response(HttpStatus.BAD_REQUEST, {
                message: "Missing claims",
            });

        if (user.customClaims.rsvpVerified) {
            return response(HttpStatus.BAD_REQUEST, { message: "User RSVP'd" });
        }

        if (user.customClaims.hasJoinedWaitlist) {
            return response(HttpStatus.BAD_REQUEST, {
                message:
                    "It seems like you previously waitlisted and didn't secure your spot in time, sorry!",
            });
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
        const app = (
            await admin
                .firestore()
                .collection("applications")
                .where("applicantId", "==", user.uid)
                .get()
        ).docs[0]?.data();
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
            await sendSpotAvailableEmail(
                app?.firstName ?? user.displayName ?? "",
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
            await sendJoinedWaitlistEmail(
                app?.firstName ?? user.displayName ?? "",
                user.email ?? ""
            ).catch((error) =>
                functions.logger.error(
                    "Failed to send joined waitlist email.",
                    { error }
                )
            );
        }
        await admin.auth().setCustomUserClaims(user.uid, {
            ...user.customClaims,
            hasJoinedWaitlist: true,
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

// export const expiredSpotCleanup = functions.pubsub
//     .schedule("every 1 minutes")
//     .onRun(async () => {
//         functions.logger.info("Start expired spot clean up");
//         const batch = admin.firestore().batch();
//         const snap = await admin
//             .firestore()
//             .collection(SPOTS_COLLECTION)
//             .where("expiresAt", "<", Timestamp.now())
//             .get();
//         const count = snap.size;
//         snap.forEach((doc) => {
//             batch.delete(doc.ref);
//         });
//         const spots = (await admin.firestore().collection(SPOTS_COLLECTION).doc(SPOTS_COUNTER_DOCUMENT).get()).data()?.count ?? 0;
//         batch.update(admin.firestore().collection(SPOTS_COLLECTION).doc(SPOTS_COUNTER_DOCUMENT), { count: spots + count });
//         await batch.commit();
//     });
//
// export const moveToSpots = functions.pubsub.schedule("every 1 minutes").onRun(async () => {
//     const spots = (await admin.firestore().collection(SPOTS_COLLECTION).doc(SPOTS_COUNTER_DOCUMENT).get()).data()?.count ?? 0;
//     const  snap = await admin
//         .firestore()
//         .collection(WAITLIST_COLLECTION)
//         .orderBy("joinAt", "asc")
//         .limit(spots)
//         .get();
//     const batch = admin.firestore().batch();
//     // 24 hours in milliseconds
//     const oneDayInMs = 86400000;
//     snap.forEach((doc) => {
//         const expires = Timestamp.now().toDate();
//         expires.setTime(expires.getTime() + oneDayInMs);
//         const expiresAt = Timestamp.fromDate(expires);
//         batch.create(
//             admin.firestore().collection(SPOTS_COLLECTION).doc(doc.id),
//             { ...doc.data(), expiresAt }
//         );
//         batch.delete(doc.ref);
//     });
//     batch.update(admin.firestore().collection(SPOTS_COLLECTION).doc(SPOTS_COUNTER_DOCUMENT), { count: 0 });
//     await batch.commit();
// });
