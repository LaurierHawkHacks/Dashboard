import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { PKPass } from "passkit-generator";
import axios from "axios";

const config = functions.config();

const signerCert = config.certs.signer_cert;
const signerKey = config.certs.signer_key;
const wwdr = config.certs.wwdr_cert;
const signerKeyPassphrase = config.certs.signer_key_passphrase;
const teamIdentifier = config.certs.team_id;

// apple wallet ticket
export const createTicket = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Not authenticated"
        );
    }

    try {
        const userId = context.auth.uid;

        const user = await admin.auth().getUser(userId);
        const app = (
            await admin
                .firestore()
                .collection("applications")
                .where("applicantId", "==", userId)
                .get()
        ).docs[0]?.data();

        let firstName = app?.firstName;
        let lastName = app?.lastName;
        if (!app) {
            functions.logger.info(
                "No application found for user. Will try to get name from user record."
            );
            const [f, l] = user?.displayName?.split(" ") ?? [
                user.customClaims?.type ?? "N/A",
                "N/A",
            ];
            firstName = f;
            lastName = l;
        }

        const ticketsRef = admin.firestore().collection("tickets");
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
                logoText: "Welcome to HawkHacks",
                barcodes: [
                    {
                        message: `${config.fe.url}/ticket/${ticketId}`,
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
                            value: "09:00 AM",
                        },
                    ],
                    backFields: [
                        {
                            key: "moreInfo",
                            label: "More Info",
                            value: "For more details, visit our website at hawkhacks.ca or contact support@hawkhacks.ca",
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
            })
        );

        const iconResponse = await axios.get("https://hawkhacks.ca/icon.png", {
            responseType: "arraybuffer",
        });
        const icon2xResponse = await axios.get(
            "https://hawkhacks.ca/icon.png",
            { responseType: "arraybuffer" }
        );
        const iconBuffer = iconResponse.data;
        const icon2xBuffer = icon2xResponse.data;

        const pass = new PKPass(
            {
                "pass.json": passJsonBuffer,
                "icon.png": iconBuffer,
                "icon@2x.png": icon2xBuffer,
            },
            {
                signerCert: signerCert,
                signerKey: signerKey,
                wwdr: wwdr,
                signerKeyPassphrase: signerKeyPassphrase,
            }
        );

        const buffer = await pass.getAsBuffer();

        const storageRef = admin.storage().bucket();
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
        functions.logger.error("Error creating ticket:", { error });
        throw new functions.https.HttpsError(
            "internal",
            "Failed to create ticket",
            error instanceof Error ? error.message : "Unknown error"
        );
    }
});
