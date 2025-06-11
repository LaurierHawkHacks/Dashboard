import axios from "axios";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { error as logError, info as logInfo } from "firebase-functions/logger";
import { HttpsError } from "firebase-functions/v2/https";
import { PKPass } from "passkit-generator";
import { v4 as uuidv4 } from "uuid";
import { onCallCustom } from "./utils";

const signerCert = process.env.APPLE_WALLET_CERTS_SIGNER_CERT;
const signerKey = process.env.APPLE_WALLET_CERTS_SIGNER_KEY;
const wwdr = process.env.APPLE_WALLET_CERTS_WWDR_CERT;
const signerKeyPassphrase =
	process.env.APPLE_WALLET_CERTS_SIGNER_KEY_PASSPHRASE;
const teamIdentifier = process.env.APPLE_WALLET_CERTS_TEAM_ID;

// apple wallet ticket
export const createTicket = onCallCustom(async (req) => {
	if (!req.auth) {
		throw new HttpsError("permission-denied", "Not authenticated");
	}

	try {
		const userId = req.auth.uid;

		const user = await getAuth().getUser(userId);
		const app = (
			await getFirestore()
				.collection("applications")
				.where("applicantId", "==", userId)
				.get()
		).docs[0]?.data();

		let firstName = app?.firstName;
		let lastName = app?.lastName;
		if (!app) {
			logInfo(
				"No application found for user. Will try to get name from user record.",
			);
			const [f, l] = user?.displayName?.split(" ") ?? [
				user.customClaims?.type ?? "N/A",
				"N/A",
			];
			firstName = f;
			lastName = l;
		}

		const ticketsRef = getFirestore().collection("tickets");
		const ticketDoc = (await ticketsRef.where("userId", "==", userId).get())
			.docs[0];
		let ticketId = "";
		if (!ticketDoc) {
			ticketId = uuidv4();
			await ticketsRef.doc(ticketId).set({
				userId: userId,
				ticketId: ticketId,
				firstName: firstName,
				lastName: lastName,
				timestamp: new Date(),
			});
		} else {
			ticketId = ticketDoc.id;
			await ticketsRef.doc(ticketId).update({
				userId: userId,
				ticketId: ticketId,
				firstName: firstName,
				lastName: lastName,
				timestamp: new Date(),
			});
		}

		const passJsonBuffer = Buffer.from(
			JSON.stringify({
				passTypeIdentifier: "pass.com.dashboard.hawkhacks",
				formatVersion: 1,
				teamIdentifier: teamIdentifier,
				organizationName: "HawkHacks",
				serialNumber: ticketId,
				description: "Access to HawkHacks 2024",
				foregroundColor: "rgb(255, 255, 255)",
				backgroundColor: "rgb(12, 105, 117)",
				labelColor: "rgb(255, 255, 255)",
				logoText: "HawkHacks",
				barcodes: [
					{
						message: `${process.env.FE_URL}/ticket/${ticketId}`,
						format: "PKBarcodeFormatQR",
						messageEncoding: "iso-8859-1",
					},
				],
				locations: [
					{
						latitude: 51.50506,
						longitude: -0.0196,
						relevantText: "Event Entrance",
					},
				],
				generic: {
					headerFields: [
						{
							key: "eventHeader",
							label: "Event Date",
							value: "May 17, 2024",
						},
					],
					primaryFields: [
						{
							key: "eventName",
							label: "Participant",
							value: `${firstName} ${lastName}`,
						},
						{
							key: "teamName",
							label: "Team",
							value: "Team Here",
						},
					],
					auxiliaryFields: [
						{
							key: "location",
							label: "Location",
							value: "Wilfrid Laurier University",
						},
						{
							key: "startTime",
							label: "Start Time",
							value: "6:00 PM",
						},
					],
					backFields: [
						{
							key: "moreInfo",
							label: "More Info",
							value:
								"For more details, visit our website at hawkhacks.ca or contact support@hawkhacks.ca",
						},
						{
							key: "emergencyContact",
							label: "Emergency Contact",
							value: "911",
						},
					],
				},
				images: {
					logo: {
						filename: "logo.png",
					},
					"logo@2x": {
						filename: "logo@2x.png",
					},
				},
			}),
		);

		const iconResponse = await axios.get("https://hawkhacks.ca/icon.png", {
			responseType: "arraybuffer",
		});
		const icon2xResponse = await axios.get("https://hawkhacks.ca/icon.png", {
			responseType: "arraybuffer",
		});
		const iconBuffer = iconResponse.data;
		const icon2xBuffer = icon2xResponse.data;

		const ipadHawkResponse = await axios.get(
			"https://portal.hawkhacks.ca/thumbnail@3x.png",
			{ responseType: "arraybuffer" },
		);
		const ipadHawk = ipadHawkResponse.data;

		if (!signerCert || !signerKey || !wwdr) {
			logError("Missing required Apple certificates", {
				signerCert: !!signerCert,
				signerKey: !!signerKey,
				wwdr: !!wwdr,
			});
			throw new HttpsError(
				"internal",
				"Server Configuration Error: Missing required certificates",
			);
		}

		const pass = new PKPass(
			{
				"pass.json": passJsonBuffer,
				"icon.png": iconBuffer,
				"icon@2x.png": icon2xBuffer,
				"logo.png": iconBuffer,
				"logo@2x.png": icon2xBuffer,
				"thumbnail@3x.png": ipadHawk,
			},
			{
				signerCert: signerCert,
				signerKey: signerKey,
				wwdr: wwdr,
				signerKeyPassphrase: signerKeyPassphrase,
			},
		);

		const buffer = pass.getAsBuffer();

		const storageRef = getStorage().bucket();
		const fileRef = storageRef.file(`passes/${userId}/pass.pkpass`);
		await fileRef.save(buffer, {
			metadata: {
				contentType: "application/vnd.apple.pkpass",
			},
		});

		await fileRef.makePublic();
		const passUrl = fileRef.publicUrl();

		return { url: passUrl };
	} catch (error) {
		logError("Error creating ticket:", { error });
		throw new HttpsError(
			"internal",
			"Failed to create ticket",
			error instanceof Error ? error.message : "Unknown error",
		);
	}
});
