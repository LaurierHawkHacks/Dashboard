import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import {
	log,
	error as logError,
	info as logInfo,
} from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { Octokit } from "octokit";
import * as QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { onCallCustom } from "./utils";

initializeApp();

export const fetchOrGenerateTicket = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError(
			"permission-denied",
			"User must be authenticated to initiate this operation.",
		);
	}

	const userId = req.auth.uid;
	const ticketsRef = getFirestore().collection("tickets");
	const ticketQuery = await ticketsRef
		.where("userId", "==", userId)
		.limit(1)
		.get();

	if (ticketQuery.empty) {
		let ticketId = "";
		let createTicket = false;
		const snap = await getFirestore()
			.collection("tickets")
			.where("userId", "==", req.auth.uid)
			.get();
		const data = snap.docs[0]?.data();
		if (!data) {
			ticketId = uuidv4();
			createTicket = true;
		} else {
			ticketId = data.ticketId;
		}
		const qrCodeValue = `${process.env.FE_URL}/ticket/${ticketId}`;

		try {
			const qrCodeDataURL = await QRCode.toDataURL(qrCodeValue, {
				width: 256,
			});

			const base64Data = qrCodeDataURL.split(",")[1];
			const buffer = Buffer.from(base64Data, "base64");

			const storageRef = getStorage().bucket();
			const fileRef = storageRef.file(`qrCodes/${userId}/${ticketId}.png`);
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
				await getFirestore().collection("tickets").doc(ticketId).update({
					qrCodeUrl: qrCodeUrl,
					timestamp: new Date(),
				});
			}

			return { qrCodeUrl };
		} catch (error) {
			logError("Error generating or uploading QR code:", error);
			throw new HttpsError(
				"internal",
				"Failed to generate or upload QR code",
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	} else {
		const ticketData = ticketQuery.docs[0].data();
		return { qrCodeUrl: ticketData.qrCodeUrl as string };
	}
});

// Default on-sign-up Claims function
export const addDefaultClaims = functions.auth.user().onCreate(async (user) => {
	const { uid } = user;
	try {
		await getAuth().setCustomUserClaims(uid, {
			// Default Claims
			admin: false, // Example: set to true for admin users
			phoneVerified: false,
			rsvpVerified: false,
			type: "hacker",
		});
		logInfo(`Custom claims added for user: ${uid}`);
	} catch (error) {
		logError("Error adding custom claims:", error);
	}
});

export const addAdminRole = onCallCustom((req) => {
	// If user is not an Admin, decline request
	if (req.auth?.token?.admin !== true) {
		return { error: "Only admins can add other admins" };
	}
	const data = z.object({ email: z.string() }).parse(req.data);

	// Get USER and ADD custom claim (admin) based on Email
	return getAuth()
		.getUserByEmail(data.email)
		.then((user) => {
			return getAuth().setCustomUserClaims(user.uid, {
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

export const requestSocials = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "Unauthorized");
	}

	const func = "requestSocials";

	logInfo("Getting socials...");
	let socials: Socials | undefined;
	try {
		const snap = await getFirestore()
			.collection("socials")
			.where("uid", "==", req.auth.uid)
			.get();
		socials = snap.docs[0]?.data() as Socials;
	} catch (e) {
		logError("Failed to get socials.", { error: e, func });
		throw new HttpsError("internal", "internal (get_socials)");
	}

	if (!socials) {
		// create a new socials document
		const app = (
			await getFirestore()
				.collection("applications")
				.where("applicantId", "==", req.auth.uid)
				.get()
		).docs[0]?.data();
		const docId = uuidv4();

		if (!app) {
			logInfo("Creating new socials with default values...");
			// create with default
			socials = {
				instagram: "",
				github: "",
				linkedin: "",
				discord: "",
				resumeRef: "",
				docId,
				uid: req.auth.uid,
				resumeVisibility: "Public",
			};
		} else {
			logInfo("Creating new socials with selected application values...");
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
				uid: req.auth.uid,
				resumeVisibility: "Public",
			};
		}
		await getFirestore().collection("socials").doc(docId).set(socials);
		logInfo("Socials saved.");
	}

	return {
		message: "ok",
		data: socials,
	};
});

export const updateSocials = onCallCustom(async (req) => {
	if (!req.auth) {
		logInfo("Authentication required.");
		throw new HttpsError("permission-denied", "Not authenticated");
	}

	const data = z
		.object({
			docId: z.string().uuid(),
			instagram: z.string().optional(),
			github: z.string().optional(),
			linkedin: z.string().optional(),
			discord: z.string().optional(),
			resumeRef: z.string().optional(),
			resumeVisibility: z
				.enum(["Public", "Private", "Sponsors Only"])
				.optional(),
		})
		.parse(req.data);

	logInfo("Updating socials:", data);
	logInfo("User ID in Func:", req.auth.uid);

	try {
		const doc = await getFirestore()
			.collection("socials")
			.doc(data.docId)
			.get();
		if (!doc.exists) {
			throw new HttpsError("not-found", "not found");
		}

		const socials = doc.data() as Socials;
		if (socials.uid !== req.auth.uid) {
			throw new HttpsError("permission-denied", "cannot update socials");
		}

		logInfo("Updating socials for application:", doc.id);
		logInfo("Data in ref:", doc);

		const db = getFirestore();
		db.settings({ ignoreUndefinedProperties: true });
		await db.collection("socials").doc(doc.id).update({
			instagram: data.instagram,
			linkedin: data.linkedin,
			github: data.github,
			discord: data.discord,
			resumeRef: data.resumeRef,
			resumeVisibility: data.resumeVisibility,
		});
		logInfo("Socials updated:", data);
		return { message: "ok" };
	} catch (error) {
		logError("Failed to update socials", { error });
		throw new HttpsError("internal", "Failed to update socials", error);
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
export const verifyGitHubEmail = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "Not authenticated");
	}

	const data = z
		.object({
			token: z.string(),
			email: z.string().email(),
		})
		.parse(req.data);

	const { token, email } = data;

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
			const payloadEmail = res.data.filter((data) => data.email === email)[0];
			if (!payloadEmail)
				throw new HttpsError("aborted", "Fail to match email in payload");

			// since we got the email data we need, we check if its verified
			getAuth().updateUser(req.auth.uid, {
				emailVerified: payloadEmail.verified,
			});
			return payloadEmail.verified;
		}
		throw new HttpsError("unavailable", "Service unavailable");
	} catch {
		throw new HttpsError("internal", "Failed to verify email");
	}
});

export const logEvent = onCallCustom((req) => {
	const uid = req.auth?.uid;

	const data = z
		.object({
			type: z.enum(["error", "info", "log"]),
			data: z.any(),
		})
		.parse(req.data);

	switch (data.type) {
		case "error":
			logError({ data: data.data, uid });
			break;
		case "info":
			logInfo({ data: data.data, uid });
			break;
		default:
			log({ data: data.data, uid });
			break;
	}
});

async function internalGetTicketData(id: string, extended = false) {
	logInfo("Checking for ticket data...");
	const ticketDoc = await getFirestore().collection("tickets").doc(id).get();
	if (!ticketDoc.exists) {
		throw new HttpsError("not-found", "not found");
	}

	const ticket = ticketDoc.data() as {
		userId: string;
		foods: string[];
		events: string[];
	};

	logInfo("Checking for application data...");
	const app = (
		await getFirestore()
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
		logInfo("No application data, taking name from user record.");
		const user = await getAuth().getUser(ticket.userId);
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
	logInfo("Checking for social data...");
	let socials = (
		await getFirestore()
			.collection("socials")
			.where("uid", "==", ticket.userId)
			.get()
	).docs[0]?.data();
	if (!socials) {
		logInfo("No socials found, using default data...");
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

export const getTicketData = onCallCustom(async (req) => {
	const data = z
		.object({
			id: z.string().uuid(),
		})
		.parse(req.data);

	try {
		const ticketData = await internalGetTicketData(data.id);
		return {
			message: "ok",
			data: ticketData,
		};
	} catch (e) {
		logError("Failed to get ticket data.", { error: e });
		throw new HttpsError("internal", "internal error");
	}
});

export const getExtendedTicketData = onCallCustom(async (req) => {
	const data = z
		.object({
			id: z.string().uuid(),
		})
		.parse(req.data);

	try {
		const ticketData = await internalGetTicketData(data.id, true);

		return {
			message: "ok",
			data: ticketData,
		};
	} catch (e) {
		logError("Failed to get extended ticket data.", {
			error: e,
		});
		throw new HttpsError("internal", "internal error");
	}
});

export const redeemItem = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "unauthorized");
	}

	const user = await getAuth().getUser(req.auth.uid);
	if (!user.customClaims?.admin) {
		throw new HttpsError("permission-denied", "unauthorized");
	}

	const data = z
		.object({
			ticketId: z.string(),
			itemId: z.string(),
			action: z.enum(["check", "uncheck"]),
		})
		.parse(req.data);

	const ticket = (
		await getFirestore().collection("tickets").doc(data.ticketId).get()
	).data();
	if (!ticket) {
		throw new HttpsError("not-found", "ticket not found");
	}

	let events = [];
	if (data.action === "check") {
		events = [...ticket.events, data.itemId];
		await getFirestore()
			.collection("tickets")
			.doc(data.ticketId)
			.update({ events });
	} else {
		events = ticket.events.filter((evt: string) => evt !== data.itemId);
		await getFirestore()
			.collection("tickets")
			.doc(data.ticketId)
			.update({ events });
	}

	return {
		data: events,
	};
});

export {
	checkInvitation, createTeam, deleteTeam, getTeamByUser, getUserInvitations, inviteMember, isTeamNameAvailable, rejectInvitation, removeMembers, updateTeamName, validateTeamInvitation
} from "./teams";

export { createTicket } from "./apple";

export { createPassClass, createPassObject } from "./google";

export {
	joinWaitlist, verifyRSVP,
	withdrawRSVP
} from "./rsvp";

