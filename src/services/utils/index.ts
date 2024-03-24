import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "@services";

const TICKETS_COLLECTION = "tickets";

export interface UserTicketData {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    phone: string;
    school: string;
    levelOfStudy: string;
    countryOfResidence: string;
}

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
