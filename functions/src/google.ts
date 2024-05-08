import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AxiosError } from "axios";

const config = functions.config();

const credentials = config.googlewallet;

const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

//Google wallet class
export const createPassClass = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        return {
            status: 401,
            message: "Unauthorized",
        };
    }

    const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";
    const issuerid = config.googlewallet.issuerid;

    // const classesRef = admin.firestore().collection("passClasses");
    // const classDoc = await classesRef.doc(issuerid).get();
    // let classId;
    // if (classDoc.exists && classDoc.data()?.classId) {
    //     classId = classDoc.data()?.classId;
    // } else {
    //     classId = `${issuerid}.hawkhacks-ticket`; //dont put uuidv4 in the classId for pass class it breaks it
    //     await classesRef.doc(issuerid).set(
    //         {
    //             classId: classId,
    //             timestamp: new Date(),
    //         },
    //         { merge: true }
    //     );
    // }

    const classId = `${issuerid}.hawkhacks-ticket`; //dont put uuidv4 in the classId for pass class it breaks it

    const updatedClass = {
        id: classId,
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
                                                "object.textModulesData['NAME']",
                                        },
                                    ],
                                },
                            },
                            endItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['EMAIL']",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        threeItems: {
                            startItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['TYPE']",
                                        },
                                    ],
                                },
                            },
                            middleItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['FROM']",
                                        },
                                    ],
                                },
                            },
                            endItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['TO']",
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

            return {
                result: "Class created",
                details: createResponse.data,
            };
        } else {
            functions.logger.info(error);
            throw new functions.https.HttpsError(
                "unknown",
                "Failed to handle request",
                error
            );
        }
    }
});

export const createPassObject = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "permission-denied",
                "Not authenticated"
            );
        }
        const func = "createPassObject";
        const userId = context.auth.uid;

        const app = (
            await admin
                .firestore()
                .collection("applications")
                .where("applicantId", "==", userId)
                .get()
        ).docs[0]?.data();

        if (!app) {
            throw new functions.https.HttpsError(
                "internal",
                "Object update failed (app)"
            );
        }

        const firstName = app.firstName;
        const lastName = app.lastName;
        const fullName = `${firstName} ${lastName}`;

        let ticketId = "";
        const ticketsRef = admin.firestore().collection("tickets");
        const ticketDoc = (await ticketsRef.where("userId", "==", userId).get())
            .docs[0];
        if (!ticketDoc) {
            ticketId = uuidv4();
            await ticketsRef.doc(ticketId).set({
                userId: userId,
                ticketId,
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

        const userEmail = context.auth.token.email || data.email;

        // const userName = context.auth.token.name || "No Name Provided";

        const objectSuffix = userEmail.replace(/[^\w.-]/g, "_");
        const objectId = `${config.googlewallet.issuerid}.${objectSuffix}`;
        const classId = `${config.googlewallet.issuerid}.hawkhacks-ticket`;
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
                    value: "Wilfrid Laurier University",
                },
            },
            header: {
                defaultValue: {
                    language: "en-US",
                    value: "HawkHacks 2024",
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
                    id: "NAME",
                    header: "Name",
                    body: `${firstName} ${lastName}`,
                },
                {
                    id: "TYPE",
                    header: "Type",
                    body: "Hacker",
                },
                {
                    id: "EMAIL",
                    header: "Email",
                    body: `${userEmail}`,
                },
                {
                    id: "FROM",
                    header: "From",
                    body: "May 17th",
                },
                {
                    id: "TO",
                    header: "To",
                    body: "May 19th",
                },
            ],
            barcode: {
                type: "QR_CODE",
                value: `${config.fe.url}/ticket/${ticketId}`,
            },

            hexBackgroundColor: "#27393F",
            heroImage: {
                sourceUri: {
                    uri: "https://storage.googleapis.com/hawkhacks-dashboard.appspot.com/uploads%2Fwallet-banner.png",
                },
                contentDescription: {
                    defaultValue: {
                        language: "en-US",
                        value: "HERO_IMAGE_DESCRIPTION",
                    },
                },
            },
        };

        functions.logger.info("Pass object being sent:", updatedGenericObject);
        functions.logger.info("user name:", firstName, lastName);
        functions.logger.info("full name:", fullName);

        //FOR POSTING NEW OBJECTS
        // try {
        //     const response = await httpClient.request({
        //         url: `${baseUrl}/genericObject`,
        //         method: "POST",
        //         data: updatedGenericObject,
        //     });
        //     functions.logger.info("Pass created successfully", response.data);
        // } catch (error) {
        //     functions.logger.error("Failed to create pass object", error);
        // }

        //FOR UPDATING OBJECTS
        // try {
        //     const response = await httpClient.request({
        //         url: `${baseUrl}/genericObject/${objectId}`,
        //         method: "PATCH",
        //         data: updatedGenericObject,
        //     });

        //     functions.logger.info("Pass updated successfully", response.data);
        // } catch (error) {
        //     functions.logger.error("Failed to update object", {
        //         error,
        //         func,
        //     });
        //     throw new functions.https.HttpsError(
        //         "internal",
        //         "Object update failed"
        //     );
        // }

        try {
            // Try to fetch the existing object
            const existingObjectResponse = await httpClient.request({
                url: `${baseUrl}/genericObject/${objectId}`,
                method: "GET",
            });

            if (existingObjectResponse.data) {
                // Object exists, update it
                const updateResponse = await httpClient.request({
                    url: `${baseUrl}/genericObject/${objectId}`,
                    method: "PATCH",
                    data: updatedGenericObject,
                });
                functions.logger.info(
                    "Pass updated successfully",
                    updateResponse.data,
                    func
                );
            }
        } catch (error) {
            // Object does not exist, create it
            if (error instanceof AxiosError) {
                if (error.response && error.response.status === 404) {
                    try {
                        const createResponse = await httpClient.request({
                            url: `${baseUrl}/genericObject`,
                            method: "POST",
                            data: updatedGenericObject,
                        });
                        functions.logger.info(
                            "Pass created successfully",
                            createResponse.data,
                            func
                        );
                    } catch (creationError) {
                        if (creationError instanceof AxiosError) {
                            functions.logger.error(
                                "Failed to create pass object",
                                creationError.message,
                                func
                            );
                        } else {
                            functions.logger.error(
                                "Failed to create pass object",
                                creationError,
                                func
                            );
                        }
                    }
                } else {
                    functions.logger.error(
                        "Error fetching pass object",
                        error.message,
                        func
                    );
                }
            } else {
                functions.logger.error(
                    "An unexpected error occurred",
                    error,
                    func
                );
            }
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

        return { url: saveUrl };
    }
);
