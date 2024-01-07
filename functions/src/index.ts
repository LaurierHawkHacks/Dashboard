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
import * as Notion from "@notionhq/client"; 
import { Parser } from "json2csv";

admin.initializeApp();

const notionApiKey = functions.config().notion.apikey;
const notionDatabaseId = functions.config().notion.databaseid;

const notionClient = new Notion.Client({
    auth: notionApiKey,
});

interface Application {
    applicantId: string;
    applicationDate: admin.firestore.Timestamp;
    hackathonTerm: string;
    notifyByEmail: boolean;
    notifyBySMS: boolean;
    inAcceptedList: boolean;
    finalDecision: string;
    type: string;
}


// Default on-sign-up Claims function
export const addDefaultClaims = functions.auth.user().onCreate(async (user) => {
    const { uid } = user;
    try {
        await admin.auth().setCustomUserClaims(uid, {
            // Default Claims
            admin: false, // Example: set to true for admin users
        });
        console.log(`Custom claims added for user: ${uid}`);
    } catch (error) {
        console.error("Error adding custom claims:", error);
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



export const exportData = functions.https.onRequest(async (request, response) => {
    try {
        const startDate = request.query.startDate ? new Date(request.query.startDate as string) : null;
        const endDate = request.query.endDate ? new Date(request.query.endDate as string) : null;

        const db = admin.firestore();
        const applicationsRef = db.collection('applications');

        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = applicationsRef;

        if (startDate && endDate) {
            query = query.where('applicationDate', '>=', startDate)
                         .where('applicationDate', '<=', endDate);
        }

        const snapshot = await query.get();
        const applications = snapshot.docs.map(doc => doc.data() as Application);

        const route = request.query.route as string;

        if (route === 'notion') {
            await createNotionPage(applications);
            response.send('Data exported to Notion successfully.');
        } else if (route === 'csv') {
            const csv = convertToCSV(applications);
            response.setHeader('Content-disposition', 'attachment; filename=applications.csv');
            response.set('Content-Type', 'text/csv');
            response.status(200).send(csv);
        } else {
            response.status(400).send('Invalid route specified.');
        }
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send('Internal Server Error');
    }
});

async function createNotionPage(applications: Application[]): Promise<void> {
    const existingPages = await notionClient.databases.query({
        database_id: notionDatabaseId,
    });

    for (const page of existingPages.results) {
        await notionClient.pages.update({
            page_id: page.id,
            archived: true,
        });
    }

    for (const application of applications) {
        await notionClient.pages.create({
            parent: { database_id: notionDatabaseId },
            properties: {
                'Applicant ID': {
                    'title': [{ 'text': { 'content': application.applicantId }}]
                },
                'Application Date': {
                    'date': {
                        'start': new Date(application.applicationDate.seconds * 1000).toISOString()
                    }
                },'Hackathon Term': {
                    'select': { 'name': application.hackathonTerm }
                },
                'Notify by Email': {
                    'checkbox': application.notifyByEmail
                },
                'Notify by SMS': {
                    'checkbox': application.notifyBySMS
                },
                'In Accepted List': {
                    'checkbox': application.inAcceptedList
                },
                'Final Decision': {
                    'select': { 'name': application.finalDecision }
                },
                'Type': {
                    'select': { 'name': application.type }
                }
            }
        });
    }
}
function convertToCSV(applications: Application[]): string {
    const fields = ['applicantId', 'applicationDate', 'hackathonTerm', 'notifyByEmail', 'notifyBySMS', 'inAcceptedList', 'finalDecision', 'type'];
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(applications.map(app => ({
        ...app,
        applicationDate: new Date(app.applicationDate.seconds * 1000).toISOString()
    })));
}