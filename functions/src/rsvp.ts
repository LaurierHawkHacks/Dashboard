import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import { error as logError, info as logInfo } from "firebase-functions/logger";
import { HttpsError } from "firebase-functions/v2/https";
import { Resend } from "resend";
import { v4 as uuid } from "uuid";
import { onCallCustom } from "./utils";

const WAITLIST_COLLECTION = "waitlist";
const SPOTS_COLLECTION = "spots";
const SPOTS_COUNTER_DOCUMENT = "available-spots";

function getEmailConfiguration() {
	const RESEND_KEY = process.env.RESEND_KEY;
	if (!RESEND_KEY) {
		throw new Error("RESEND_KEY is not set, please check your .env");
	}
	const EMAIL_NOREPLY = process.env.EMAIL_NOREPLY;
	if (!EMAIL_NOREPLY) {
		throw new Error("EMAIL_NOREPLY is not set, please check your .env");
	}
	const resend = new Resend(RESEND_KEY);
	return {
		resend,
		fromEmail: EMAIL_NOREPLY,
	};
}

async function sendSpotAvailableEmail(name: string, email: string | undefined) {
	const { resend, fromEmail } = getEmailConfiguration();
	if (!email) {
		throw new Error("No email provided");
	}

	logInfo("Sending new available spot email...", { email });
	await resend.emails.send({
		from: fromEmail,
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
                ]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"width="100%"class="es-wrapper"><tr><td class="esd-email-paddings"valign="top"><table cellpadding="0"cellspacing="0"class="es-content"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="600"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td class="es-p10b es-p20l es-p20r es-p30t esd-structure"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="es-p20b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"width="560"></a><tr><td class="es-p30b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"width="330"></a><tr><td class="esd-block-text es-m-txt-c es-p15b es-text-6134"align="center"><h1 style='font-size:36px;line-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Hi ${name}, it's time to RSVP!</h1><tr><td class="esd-block-text es-m-p0l es-m-p0r es-p40l es-p40r es-p5b es-p5t es-text-5004"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:20px;line-height:150%'>The wait is finally over - you’re next in line!<br><br>This is your <strong>last chance</strong> to attend HawkHacks! Make sure to <strong>RSVP within the next 24 hours</strong> to secure your spot. After this period, <strong>you will not be given another opportunity!</strong><br><br>Good luck, and hope to see you soon!</table></table><tr><td class="es-p20l es-p20r esd-structure es-p30b"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"style="border-radius:5px;border-collapse:separate"><tr><td class="es-p10t es-p30b esd-block-button"align="center"><span class="es-button-border"style="border-radius:6px;background:#2b6469"><a target="_blank"href="${process.env.FE_URL}"style='padding:10px 30px 10px 30px;color:#fff;font-size:20px;border-radius:6px;background:#2b6469;mso-border-alt:10px solid #2b6469;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="640"class="es-footer-body"align="center"style="background-color:transparent"><tr><td class="es-p20l es-p20r esd-structure es-p20b es-p20t"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="left"width="600"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-block-text es-p35b"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Copyright © 2024 HawkHacks<tr><td class="esd-block-menu"style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'esd-tmp-divider="1|solid|#cccccc"esd-tmp-menu-color="#999999"esd-tmp-menu-padding="5|5"><table cellpadding="0"cellspacing="0"width="100%"class="es-menu"><tr><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px"><a target="_blank"href="https://hawkhacks.ca/"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Visit Us</a><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px;border-left:1px solid #ccc"><a target="_blank"href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Code of Conduct</a></table></tr></table></table></table></table></table></div>
`,
	});
}

async function sendJoinedWaitlistEmail(name: string, email: string) {
	const { resend, fromEmail } = getEmailConfiguration();
	if (!email) {
		throw new Error("No email provided");
	}

	logInfo("Sending new available spot email...", { email });
	await resend.emails.send({
		from: fromEmail,
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
                ]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"width="100%"class="es-wrapper"><tr><td class="esd-email-paddings"valign="top"><table cellpadding="0"cellspacing="0"class="es-content"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="600"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td class="es-p10b es-p20l es-p20r es-p30t esd-structure"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="es-p20b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"width="560"></a><tr><td class="es-p30b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"width="330"></a><tr><td class="esd-block-text es-m-txt-c es-p15b es-text-6134"align="center"><h1 style='font-size:36px;line-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Hi ${name}, you're on the waitlist!</h1><tr><td class="esd-block-text es-m-p0l es-m-p0r es-p40l es-p40r es-p5b es-p5t es-text-5004"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",so t Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:20px;line-height:150%'>You will get another email from us if there is a spot for you.<br>Make sure to check your email everyday and/or open the dashboard.</table></table><tr><td class="es-p20l es-p20r esd-structure es-p30b"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"style="border-radius:5px;border-collapse:separate"><tr><td class="es-p10t es-p30b esd-block-button"align="center"><span class="es-button-border"style="border-radius:6px;background:#2b6469"><a target="_blank"href="${process.env.FE_URL}"style='padding:10px 30px 10px 30px;font-size:20px;text-decoration:none;color:#fff;border-radius:6px;background:#2b6469;mso-border-alt:10px solid #2b6469;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="640"class="es-footer-body"align="center"style="background-color:transparent"><tr><td class="es-p20l es-p20r esd-structure es-p20b es-p20t"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="left"width="600"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-block-text es-p35b"align="center"><p style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Copyright © 2024 HawkHacks<tr><td class="esd-block-menu"style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'esd-tmp-divider="1|solid|#cccccc"esd-tmp-menu-color="#999999"esd-tmp-menu-padding="5|5"><table cellpadding="0"cellspacing="0"width="100%"class="es-menu"><tr><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px"><a target="_blank"href="https://hawkhacks.ca/"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Visit Us</a><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px;border-left:1px solid #ccc"><a target="_blank"href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style='color:#999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'>Code of Conduct</a></table></tr></table></table></table></table></table></div>
`,
	});
}

async function sendRSVPConfirmedEmail(name: string, email: string) {
	const { resend, fromEmail } = getEmailConfiguration();
	if (!email) {
		throw new Error("No email provided");
	}

	logInfo("Sending new available spot email...", { email });
	await resend.emails.send({
		from: fromEmail,
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
        ]><v:background xmlns:v="urn:schemas-microsoft-com:vml"fill="t"><v:fill type="tile"color="#fafafa"></v:fill></v:background><![endif]--><table cellpadding="0"cellspacing="0"width="100%"class="es-wrapper"><tr><td class="esd-email-paddings"valign="top"><table cellpadding="0"cellspacing="0"class="es-content"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="600"class="es-content-body"align="center"bgcolor="#ffffff"><tr><td class="es-p10b es-p20l es-p20r es-p30t esd-structure"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="es-p20b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/notion_cover_photo_x1.png"width="560"></a><tr><td class="es-p30b esd-block-image"align="center"style="font-size:0"><a target="_blank"><img alt=""class="adapt-img"src="https://fiosjiz.stripocdn.email/content/guids/CABINET_2b3ab27a82ebdae6b0731536d79baa811c1088fe7692e7c8256cd90b442af18e/images/center_default.png"width="330"></a><tr><td class="esd-block-text es-m-txt-c es-p15b es-text-6134"align="center"><h1 style="font-size:36px;line-height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Hi ${name}, you have RSVP'd!</h1><tr><td class="esd-block-text es-m-p0l es-m-p0r es-p40l es-p40r es-p5b es-p5t es-text-5004"align="center"><p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',so t Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:20px;line-height:150%">See you soon at HawkHacks!</table></table><tr><td class="es-p20l es-p20r esd-structure es-p30b"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="center"width="560"valign="top"><table cellpadding="0"cellspacing="0"width="100%"style="border-radius:5px;border-collapse:separate"><tr><td class="es-p10t es-p30b esd-block-button"align="center"><span class="es-button-border"style="border-radius:6px;background:#2b6469"><a target="_blank"href="${process.env.FE_URL}"style="padding:10px 30px 10px 30px;text-align:center;font-style:normal;width:auto;line-height:24px;text-decoration:none!important;font-size:20px;color:#fff;border-radius:6px;background:#2b6469;mso-border-alt:10px solid #2b6469;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"class="es-button">GO TO DASHBOARD</a></span></table></table></table></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"><tr><td class="esd-stripe"align="center"><table cellpadding="0"cellspacing="0"width="640"class="es-footer-body"align="center"style="background-color:transparent"><tr><td class="es-p20l es-p20r esd-structure es-p20b es-p20t"align="left"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-container-frame"align="left"width="600"><table cellpadding="0"cellspacing="0"width="100%"><tr><td class="esd-block-text es-p35b"align="center"><p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Copyright © 2024 HawkHacks<tr><td class="esd-block-menu"style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"esd-tmp-divider="1|solid|#cccccc"esd-tmp-menu-color="#999999"esd-tmp-menu-padding="5|5"><table cellpadding="0"cellspacing="0"width="100%"class="es-menu"><tr><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px"><a target="_blank"href="https://hawkhacks.ca/"style="color:#999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Visit Us</a><td class="es-p10b es-p10t es-p5l es-p5r"align="center"width="50.00%"valign="top"style="padding-top:5px;padding-bottom:5px;border-left:1px solid #ccc"><a target="_blank"href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"style="color:#999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">Code of Conduct</a></table></tr></table></table></table></table></table></div>
`,
	});
}

export const withdrawRSVP = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "unauthorized");
	}

	try {
		logInfo("Looking for user...", { uid: req.auth.uid });
		const user = await getAuth().getUser(req.auth.uid);
		logInfo("Dismissing RSVP...", { email: user.email });
		await getAuth().setCustomUserClaims(user.uid, {
			...user.customClaims,
			rsvpVerified: false,
		});
		logInfo("RSVP dismissed.", { email: user.email });
		// logout user / prevent old claims to exists in client's device
		// which will allow it to browse all the pages
		await getAuth().revokeRefreshTokens(user.uid);

		// move next in waitlist to spots
		// const snap = await admin
		//     .firestore()
		//     .collection(WAITLIST_COLLECTION)
		//     .orderBy("joinAt", "asc")
		//     .limit(1)
		//     .get();
		// if (snap.size) {
		//     logInfo("Next user in waitlist found");
		//     const doc = snap.docs[0];
		//     const user = await admin.auth().getUser(doc.data().uid);
		//     await admin.firestore().runTransaction(async (tx) => {
		//         const expires = Timestamp.now().toDate();
		//         // 24 hours in milliseconds
		//         const oneDayInMs = 86400000;
		//         expires.setTime(expires.getTime() + oneDayInMs);
		//         const expiresAt = Timestamp.fromDate(expires);
		//         tx.create(
		//             admin.firestore().collection(SPOTS_COLLECTION).doc(doc.id),
		//             {
		//                 ...doc.data(),
		//                 expiresAt,
		//             }
		//         );
		//         tx.delete(
		//             admin
		//                 .firestore()
		//                 .collection(WAITLIST_COLLECTION)
		//                 .doc(doc.id)
		//         );
		//     });
		//     const app = (
		//         await admin
		//             .firestore()
		//             .collection("applications")
		//             .where("applicantId", "==", user.uid)
		//             .get()
		//     ).docs[0]?.data();
		//     await sendSpotAvailableEmail(
		//         app?.firstName ?? user.displayName ?? "",
		//         user.email
		//     ).catch((error) =>
		//         logError(
		//             "Failed to send notification email about new available spot.",
		//             { error }
		//         )
		//     );
		// } else {
		//     logInfo(
		//         "No user in waitlist, adding empty spot to counter"
		//     );
		//     // record the number of spots that are available when no one is in the waitlist
		//     const counterDoc = await admin
		//         .firestore()
		//         .collection(SPOTS_COLLECTION)
		//         .doc(SPOTS_COUNTER_DOCUMENT)
		//         .get();
		//     const counterData = counterDoc.data();
		//     if (counterDoc.exists && counterData) {
		//         logInfo("Spot counter found");
		//         await admin
		//             .firestore()
		//             .collection(SPOTS_COLLECTION)
		//             .doc(SPOTS_COUNTER_DOCUMENT)
		//             .update({
		//                 count: counterData.count + 1,
		//             });
		//     } else {
		//         logInfo("Spot counter not found, creating...");
		//         await admin
		//             .firestore()
		//             .collection(SPOTS_COLLECTION)
		//             .doc(SPOTS_COUNTER_DOCUMENT)
		//             .set({ count: 1 });
		//     }
		// }
	} catch (error) {
		logError("Failed to withdraw rsvp", { error });
		throw new HttpsError("internal", "Failed to withdraw rsvp");
	}

	// move next in waitlist to rsvp
	return {};
});

export const verifyRSVP = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "Not authenticated");
	}

	logInfo("Verify RSVP called.", { uid: req.auth.uid });

	// only verify once
	const user = await getAuth().getUser(req.auth.uid);
	if (user.customClaims?.rsvpVerified) {
		return {
			status: 200,
			verified: true,
			message: "RSVP already verified.",
		};
	}
	try {
		logInfo("Checking user in spots...", {
			email: user.email,
		});
		const spotSnap = await getFirestore()
			.collection(SPOTS_COLLECTION)
			.where("uid", "==", user.uid)
			.orderBy("expiresAt", "desc")
			.get();
		if (!spotSnap.size) {
			logInfo("User not in waitlist or no empty spots. Rejecting...");
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
			logInfo("User verying with an expired spot. Rejecting...");
			await getFirestore().runTransaction(async (tx) => {
				const waitListDoc = await tx.get(
					getFirestore()
						.collection(WAITLIST_COLLECTION)
						.where("uid", "==", user.uid),
				);
				tx.delete(getFirestore().collection(SPOTS_COLLECTION).doc(spotId));
				const waitlist = waitListDoc.docs[0];
				if (waitlist) {
					tx.delete(waitlist.ref);
				}
			});
			logInfo("Spot removed.", { func: "verifyRSVP" });
			return {
				status: 400,
				verified: false,
				message:
					"Your chance to RSVP has expired. You can try again by entering the waitlist.",
			};
		}
		logInfo("Verifying RSVP...");
		const app = (
			await getFirestore()
				.collection("applications")
				.where("applicantId", "==", user.uid)
				.get()
		).docs[0]?.data();
		await getAuth().setCustomUserClaims(user.uid, {
			...user.customClaims,
			rsvpVerified: true,
		});
		await getFirestore().runTransaction(async (tx) => {
			const waitListDoc = await tx.get(
				getFirestore()
					.collection(WAITLIST_COLLECTION)
					.where("uid", "==", user.uid),
			);
			const waitlist = waitListDoc.docs[0];
			tx.delete(getFirestore().collection(SPOTS_COLLECTION).doc(spotId));
			if (waitlist) {
				tx.delete(waitlist.ref);
			}
		});
		await sendRSVPConfirmedEmail(
			app?.firstName ?? user.displayName ?? "",
			user.email ?? "",
		).catch((error) =>
			logError("Failed to send rsvp confirmed email.", { error }),
		);
	} catch (e) {
		logError("Error verifying RSVP.", {
			uid: req.auth.uid,
			error: (e as Error).message,
		});
		throw new HttpsError("internal", "RSVP service down");
	}

	return {
		status: 200,
		verified: true,
	};
});

export const joinWaitlist = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "unauthorized");
	}
	const func = "joinWaitlist";

	try {
		const user = await getAuth().getUser(req.auth.uid);
		if (!user.customClaims) {
			throw new HttpsError("permission-denied", "Missing claims");
		}

		if (user.customClaims.rsvpVerified) {
			throw new HttpsError("permission-denied", "User RSVP'd");
		}

		if (user.customClaims.hasJoinedWaitlist) {
			throw new HttpsError(
				"permission-denied",
				"It seems like you previously waitlisted and didn't secure your spot in time, sorry!",
			);
		}

		const snap = await getFirestore()
			.collection(WAITLIST_COLLECTION)
			.where("uid", "==", user.uid)
			.get();
		if (snap.size > 0) {
			throw new HttpsError("permission-denied", "User in waitlist already");
		}

		// this only occurs if no one was in the waitlist and there are spots
		logInfo("Checking if there are spots available");
		const app = (
			await getFirestore()
				.collection("applications")
				.where("applicantId", "==", user.uid)
				.get()
		).docs[0]?.data();
		const spotCounterSnap = await getFirestore()
			.collection(SPOTS_COLLECTION)
			.doc(SPOTS_COUNTER_DOCUMENT)
			.get();
		const spotCounterData = spotCounterSnap.data();
		if (spotCounterData && spotCounterData.count > 0) {
			logInfo("Empty spot found");
			await getFirestore().runTransaction(async (tx) => {
				tx.update(spotCounterSnap.ref, {
					count: spotCounterData.count - 1,
				});
				const expires = Timestamp.now().toDate();
				// 24 hours in milliseconds
				const oneDayInMs = 86400000;
				expires.setTime(expires.getTime() + oneDayInMs);
				const expiresAt = Timestamp.fromDate(expires);
				tx.create(getFirestore().collection(SPOTS_COLLECTION).doc(uuid()), {
					uid: user.uid,
					expiresAt,
				});
			});
			await sendSpotAvailableEmail(
				app?.firstName ?? user.displayName ?? "",
				user.email,
			).catch((error) =>
				logError("Failed to send notification email for rsvp", {
					error,
					func,
				}),
			);
		} else {
			logInfo("No empty spot found, adding to waitlist");
			await getFirestore().collection(WAITLIST_COLLECTION).add({
				uid: user.uid,
				joinAt: Timestamp.now(),
			});
			await sendJoinedWaitlistEmail(
				app?.firstName ?? user.displayName ?? "",
				user.email ?? "",
			).catch((error) =>
				logError("Failed to send joined waitlist email.", { error }),
			);
		}
		await getAuth().setCustomUserClaims(user.uid, {
			...user.customClaims,
			hasJoinedWaitlist: true,
		});
	} catch (error) {
		logError("Error joining waitlist.", { error, func });
		throw new HttpsError("internal", "Waitlist service down.");
	}

	return {};
});

// export const expiredSpotCleanup = functions.pubsub
//     .schedule("every 2 minutes")
//     .onRun(async () => {
//         logInfo("Start expired spot clean up");
//         const snap = await admin
//             .firestore()
//             .collection(SPOTS_COLLECTION)
//             .where("expiresAt", "<", Timestamp.now())
//             .get();
//         logInfo(`Found ${snap.size} expired spots.`);
//         if (snap.size) {
//             for (let i = 0; i < snap.size; i++) {
//                 const expiredSpotDoc = snap.docs[i];
//                 const data = expiredSpotDoc.data();
//                 const user = await admin.auth().getUser(data.uid);
//                 await admin.firestore().runTransaction(async (tx) => {
//                     const counterDoc = await tx.get(
//                         admin
//                             .firestore()
//                             .collection(SPOTS_COLLECTION)
//                             .doc(SPOTS_COUNTER_DOCUMENT)
//                     );
//                     const waitlistSnap = await tx.get(
//                         admin
//                             .firestore()
//                             .collection(WAITLIST_COLLECTION)
//                             .orderBy("joinAt", "asc")
//                             .limit(1)
//                     );
//                     const waitlistDoc = waitlistSnap.docs[i];
//                     if (waitlistDoc) {
//                         const expires = Timestamp.now().toDate();
//                         // 24 hours in milliseconds
//                         const oneDayInMs = 86400000;
//                         expires.setTime(expires.getTime() + oneDayInMs);
//                         const expiresAt = Timestamp.fromDate(expires);
//                         // create new spot
//                         tx.create(
//                             admin
//                                 .firestore()
//                                 .collection(SPOTS_COLLECTION)
//                                 .doc(waitlistDoc.id),
//                             {
//                                 ...waitlistDoc.data(),
//                                 expiresAt,
//                             }
//                         );
//                         // delete expired spot
//                         tx.delete(expiredSpotDoc.ref);
//                         // delete waitlist
//                         tx.delete(
//                             admin
//                                 .firestore()
//                                 .collection(WAITLIST_COLLECTION)
//                                 .doc(waitlistDoc.id)
//                         );
//                     } else {
//                         tx.update(
//                             admin
//                                 .firestore()
//                                 .collection(SPOTS_COLLECTION)
//                                 .doc(SPOTS_COUNTER_DOCUMENT),
//                             {
//                                 count:
//                                     (counterDoc.data() ?? { count: 0 }).count +
//                                     1,
//                             }
//                         );
//                     }
//                 });
//                 const app = (
//                     await admin
//                         .firestore()
//                         .collection("applications")
//                         .where("applicantId", "==", user.uid)
//                         .get()
//                 ).docs[0]?.data();
//                 await sendSpotAvailableEmail(
//                     app?.firstName ?? user.displayName ?? "",
//                     user.email
//                 ).catch((error) =>
//                     logError(
//                         "Failed to send notification email about new available spot.",
//                         { error }
//                     )
//                 );
//             }
//         } else {
//             logInfo("No expired spots found.");
//         }
//     });

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
