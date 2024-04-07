import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { firestore, functions, storage } from "@/services/firebase";
import type { UserTicketData } from "@/services/utils/types";
import { ApplicationData } from "@/components/forms/types";
import { httpsCallable } from "firebase/functions";
import { ref, uploadBytes } from "firebase/storage";

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
 * Submits an application to firebase
 */
export async function submitApplication(data: ApplicationData, uid: string) {
    // const cloudFn = httpsCallable(functions, "submitApplication");
    // await cloudFn(data);
    const payload = {
        ...data,
        applicantId: uid,
    };

    const appsRef = collection(firestore, "applications");
    try {
        const q = query(appsRef, where("applicantId", "==", uid), limit(1));
        const snap = await getDocs(q);
        if (snap.size > 0) return;
    } catch (e) {
        console.error(e);
        console.log("Could not query app");
    }

        await addDoc(appsRef, payload);
        console.log("app submitted!");
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

export async function uploadMentorResume(file: File, uid: string) {
    const resumeRef = ref(
        storage,
        `/resumes/${uid}-mentor-resume${file.name.substring(
            file.name.lastIndexOf(".")
        )}`
    );
    const snap = await uploadBytes(resumeRef, file, {
        customMetadata: { owner: uid },
    });
    return snap.ref.toString();
}

export async function uploadGeneralResume(file: File, uid: string) {
    const resumeRef = ref(
        storage,
        `/resumes/${uid}-general-resume${file.name.substring(
            file.name.lastIndexOf(".")
        )}`
    );
    const snap = await uploadBytes(resumeRef, file, {
        customMetadata: { owner: uid },
    });
    return snap.ref.toString();
}
