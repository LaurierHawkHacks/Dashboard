import {
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import type { UserTicketData, UserProfile } from "@/services/utils/types";
import { ApplicationData } from "@/components/forms/types";

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
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }

    return null;
}

/**
 * Tries to create a new document in the users collection.
 * IMPORTANT: It will overwrite any document with the same id provided.
 *
 */
export async function createUserProfile(data: UserProfile) {
    const docRef = doc(firestore, USERS_COLLECTION, data.id);
    await setDoc(docRef, data);
}

/**
 * Submits an application to firebase
 */
export async function submitApplication(data: ApplicationData) {
    const docRef = await addDoc(
        collection(firestore, APPLICATIONS_COLLECTION),
        { ...data, applicationStatus: "pending", timestamp: Timestamp.now() }
    );
    return docRef.id;
}

/**
 * Gets all the applications from a given user
 */
export async function getUserApplications(uid: string) {
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
}
