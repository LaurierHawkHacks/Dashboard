import { addDoc, collection } from "firebase/firestore";
import { firestore } from "./firebase";

const TICKETS_COLLECTION = "tickets";

export interface UserTicketData {
    userId: string;
    firstName: string;
    lastName: string;
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
