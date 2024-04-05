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

export async function sendVerificationCode(phoneNumber: string) {
    const sendSmsFn = httpsCallable(functions, "sendVerificationSms");
    await sendSmsFn({ phoneNumber });
}

export async function verifyCode(phoneNumber: string, code: string) {
    const verifySmsFn = httpsCallable(functions, "verifySmsCode");
    const result = await verifySmsFn({ phoneNumber, code });
    return result.data === 'approved';
}