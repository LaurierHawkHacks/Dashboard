//@ts-nocheck
import { formatISO, addMonths } from "date-fns";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { notionToFirestore } from "./notionToFirestore";
import { firestoreToNotion } from "./firestoreToNotion";
import { Client } from "@notionhq/client";

const config = functions.config();

const notion = new Client({
    auth: config.notion.apikey,
});

const bucket = admin.storage().bucket();

// const firestoreCollection = "applications";
const notionDatabaseId = config.notion.databaseid;

// async function updateDatabaseProperties() {
//     // add properties
//     const properties = {};
//     for (const key in firestoreToNotion) {
//         const name = firestoreToNotion[key].name;
//         properties[name] = {
//             ...firestoreToNotion[key],
//         };
//     }
//     await notion.databases.update({
//         database_id: notionDatabaseId,
//         properties,
//     });
// }

// async function getApps(limit = 0) {
//     if (limit !== 0) {
//         const snap = await admin
//             .firestore()
//             .collection("applications")
//             .orderBy("timestamp")
//             .limit(limit)
//             .get();
//         const apps = [];
//         const refs = [];
//         snap.forEach((doc) => {
//             const app = doc.data();
//             app.docId = doc.id;
//             apps.push(app);
//             refs.push(doc.ref);
//         });
//         return [apps, refs];
//     } else {
//         const snap = await admin
//             .firestore()
//             .collection("applications")
//             .orderBy("timestamp")
//             .get();
//         const apps = [];
//         const refs = [];
//         snap.forEach((doc) => {
//             const app = doc.data();
//             app.docId = doc.id;
//             apps.push(app);
//             refs.push(doc.ref);
//         });
//         return [apps, refs];
//     }
// }

function splitTextIntoSegments(text, maxSegmentLength = 2000) {
    const segments = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + maxSegmentLength, text.length);
        segments.push(text.substring(start, end));
        start = end;
    }

    return segments;
}

// async function updateApps(getData, validate) {
//     // update the emails
//     const [apps, refs] = await getApps();
//     const tobeupdated = [];
//     const refIndexes = [];
//     apps.forEach((app, idx) => {
//         if (typeof validate === "function") {
//             if (validate(app)) {
//                 tobeupdated.push(getData(app));
//                 refIndexes.push(idx);
//             }
//         } else {
//             tobeupdated.push(getData(app));
//             refIndexes.push(idx);
//         }
//     });
//
//     const batch = admin.firestore().batch();
//     for (let i = 0; i < tobeupdated.length; i++) {
//         try {
//             const app = tobeupdated[i];
//             console.log("Updating:", app.applicantId);
//             console.log("Data:", app);
//             batch.update(refs[refIndexes[i]], app);
//         } catch (e) {
//             console.error(e);
//         }
//     }
//     await batch.commit();
// }

async function getProperties(app) {
    const properties = {};

    for (const key in app) {
        const fields = firestoreToNotion[key];
        if (!fields) continue;

        if (fields.type === "rich_text") {
            const segments = splitTextIntoSegments(app[key]);
            properties[fields.name] = {
                rich_text: segments.map((seg) => ({ text: { content: seg } })),
            };
        } else if (fields.type === "email") {
            properties[fields.name] = { email: app[key] };
        } else if (fields.type === "url") {
            if (app[key].length) {
                let url = app[key];
                if (key === "generalResumeRef" || key === "mentorResumeRef") {
                    if (app[key].startsWith("gs://")) {
                        // gotta get a shareable url first
                        const ref = app[key].replace(
                            "gs://hawkhacks-dashboard.appspot.com/",
                            ""
                        );
                        const fileRef = bucket.file(ref);
                        const [signedUrl] = await fileRef.getSignedUrl({
                            action: "read",
                            expires: addMonths(new Date(), 1),
                        });
                        url = signedUrl;
                    } else {
                        url = app[key];
                    }
                }
                properties[fields.name] = { url: url };
            }
        } else if (fields.type === "checkbox") {
            properties[fields.name] = { checkbox: app[key] };
        } else if (fields.type === "select") {
            properties[fields.name] = {
                select: { name: app[key].replaceAll(",", "_") },
            };
        } else if (fields.type === "multi_select") {
            properties[fields.name] = {
                multi_select: app[key].map((s) => ({
                    name: s.replaceAll(",", "_"),
                })),
            };
        } else if (fields.type === "date") {
            properties[fields.name] = {
                date: {
                    start: formatISO(app[key].toDate()),
                },
            };
        } else if (fields.type === "phone_number") {
            properties[fields.name] = {
                phone_number: app[key],
            };
        }
    }

    return properties;
}

// async function main() {
//     const [apps, refs] = await getApps();
//     const batch = admin.firestore().batch();
//     for (let i = 0; i < apps.length; i++) {
//         const app = apps[i];
//         const properties = await getProperties(app);
//         const res = await notion.pages.create({
//             parent: {
//                 type: "database_id",
//                 database_id: notionDatabaseId,
//             },
//             properties: {
//                 Name: {
//                     title: [
//                         {
//                             text: {
//                                 content: `${app.firstName} ${app.lastName}`,
//                             },
//                         },
//                     ],
//                 },
//                 ...properties,
//             },
//         });
//         // update application with notion page id
//         batch.update(refs[i], { pageId: res.id });
//     }
//
//     await batch.commit();
// }

async function addToNotion(snap: functions.firestore.QueryDocumentSnapshot) {
    const app = snap.data();
    app.docId = snap.id;
    app.accepted = false;
    const properties = await getProperties(app);
    const res = await notion.pages.create({
        parent: {
            type: "database_id",
            database_id: notionDatabaseId,
        },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: `${app.firstName} ${app.lastName}`,
                        },
                    },
                ],
            },
            ...properties,
        },
    });
    await snap.ref.update({ pageId: res.id });
}

async function updateToNotion(snap: functions.firestore.QueryDocumentSnapshot) {
    const app = snap.data();
    const pageId = app.pageId;
    if (!pageId) {
        await addToNotion(snap);
    } else {
        const properties = await getProperties(app);
        await notion.pages.update({
            page_id: pageId,
            properties,
        });
    }
}

async function deleteToNotion(snap: functions.firestore.QueryDocumentSnapshot) {
    const app = snap.data();
    const pageId = app.pageId;
    if (pageId) {
        await notion.pages.update({
            page_id: pageId,
            in_trash: true,
        });
    }
}

export const syncWithNotion = functions.firestore
    .document("applications/{applicationId}")
    .onCreate(async (snap) => {
        const func = "syncWithNotion";

        // update notion with new document
        try {
            await addToNotion(snap);
        } catch (e) {
            functions.logger.error("Failed to add document to notion", {
                error: e,
                func,
            });
        }
    });

export const updateWithNotion = functions.firestore
    .document("applications/{applicationId}")
    .onUpdate(async (snap) => {
        try {
            await updateToNotion(snap);
        } catch (e) {
            functions.logger.error("Failed to update document to notion", {
                error: e,
                func: "updateWithNotion",
            });
        }
    });

export const deleteWithNotion = functions.firestore
    .document("applications/{applicationId}")
    .onDelete(async (snap) => {
        try {
            await deleteToNotion(snap);
        } catch (e) {
            functions.logger.error("Failed to delete document on Notion", {
                error: e,
                func: "deleteWithNotion",
            });
        }
    });
