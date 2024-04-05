import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { firestore, functions } from "@/services/firebase";
import type { UserTicketData, UserProfile } from "@/services/utils/types";
import { ApplicationData } from "@/components/forms/types";
import { httpsCallable } from "firebase/functions";
import axios from 'axios';

export const TICKETS_COLLECTION = "tickets";
export const USERS_COLLECTION = "users";
export const APPLICATIONS_COLLECTION = "applications";

/**
 * Creates a new ticket entry in the collection 'tickets'.
 *
 * @returns {Promise<string>} the ticket id
 */
export async function createTicket(data: UserTicketData): Promise<string> {
    const docRef = await addDoc(
        collection(firestore, TICKETS_COLLECTION),
        data
    );
    return docRef.id;
}

/**
 * Get user profile stored in firestore.
 *
 * @returns {Promise<UserProfile | null>} if profile does not exists, returns null
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const colRef = collection(firestore, USERS_COLLECTION);
        const q = query(colRef, where("id", "==", uid), limit(1));
        const snap = await getDocs(q);
        if (snap.size < 1) return null;
        return snap.docs[0].data() as UserProfile;
    } catch (e) {
        console.error("Error: getUserProfile");
    }

    return null;
}

/**
 * Tries to create a new document in the users collection.
 * IMPORTANT: It will overwrite any document with the same id provided.
 *
 */
export async function createUserProfile(data: UserProfile) {
    const cloudFn = httpsCallable(functions, "createUserProfile");
    await cloudFn(data);
}

/**
 * Submits an application to firebase
 */
export async function submitApplication(data: ApplicationData) {
    const cloudFn = httpsCallable(functions, "submitApplication");
    await cloudFn(data);
}

/**
 * Gets all the applications from a given user
 */
export async function getUserApplications(uid: string) {
    try {
        const colRef = collection(firestore, APPLICATIONS_COLLECTION);
        const q = query(
            colRef,
            where("applicantId", "==", uid),
            orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        const apps: ApplicationData[] = [];
        snap.forEach((doc) => apps.push(doc.data() as ApplicationData));
        return apps;
    } catch (e) {
        console.error("Error: getUserApplications");
    }

    return [];
}

export async function verifyGitHubEmail(token: string, email: string) {
    const verifyFn = httpsCallable(functions, "verifyGitHubEmail");
    try {
        await verifyFn({ token, email });
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}


const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const serviceSid = import.meta.env.VITE_TWILIO_SERVICE_SID

const baseURL = 'https://verify.twilio.com/v2';

export async function sendVerificationCode(phoneNumber: string) {
    console.log(accountSid);
    if (!serviceSid) {
        throw new Error('Twilio service SID is not defined.');
    }
    phoneNumber = '+1' + phoneNumber;
    try {
        const response = await axios.post(
            `${baseURL}/Services/${serviceSid}/Verifications`,
            new URLSearchParams({
                To: phoneNumber,
                Channel: 'sms',
            }),
            {
                auth: {
                    username: accountSid,
                    password: authToken,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.sid;
    } catch (error) {
        console.error('Error sending verification code:', error);
        throw error;
    }
}

export async function verifyCode(phoneNumber: string, code: string) {
    phoneNumber = '+1' + phoneNumber;
    if (!serviceSid) {
        throw new Error('Twilio service SID is not defined.');
    }

    try {
        const response = await axios.post(
            `${baseURL}/Services/${serviceSid}/VerificationCheck`,
            new URLSearchParams({
                To: phoneNumber,
                Code: code,
            }),
            {
                auth: {
                    username: accountSid,
                    password: authToken,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        console.log(response.data.status === 'approved');
        return response.data.status === 'approved';
    } catch (error) {
        console.error('Error verifying code:', error);
        throw error;
    }
}