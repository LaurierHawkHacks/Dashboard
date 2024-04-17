import {
    addDoc,
    collection,
    getDocs,
    limit,
    query,
    where,
    Timestamp,
    orderBy,
} from "firebase/firestore";
import { firestore, functions, storage } from "@/services/firebase";
import type { UserTicketData } from "@/services/utils/types";
import { ApplicationData } from "@/components/forms/types";
import { httpsCallable } from "firebase/functions";
import { ref, uploadBytes } from "firebase/storage";

export const TICKETS_COLLECTION = import.meta.env.VITE_TICKETS_COLLECTION;
export const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION;
export const APPLICATIONS_COLLECTION = import.meta.env
    .VITE_APPLICATIONS_COLLECTION;
export const RSVP_COLLECTION = import.meta.env.VITE_RSVP_COLLECTION;

async function logEvent(
    type: "error" | "info" | "log",
    data: Record<string, unknown>
) {
    try {
        const logFn = httpsCallable(functions, "logEvent");
        await logFn({ type, data });
    } catch (e) {
        console.error(e);
        console.warn("Failed to log in cloud.");
    }
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
 * Submits an application to firebase
 */
export async function submitApplication(data: ApplicationData, uid: string) {
    const payload = {
        ...data,
        applicantId: uid,
        timestamp: Timestamp.now(),
    };

    const appsRef = collection(firestore, APPLICATIONS_COLLECTION);
    try {
        const q = query(appsRef, where("applicantId", "==", uid), limit(1));
        const snap = await getDocs(q);
        if (snap.size > 0) {
            // log how many people tried to resubmit, this should not be possible, so this must be 0 or people trying to hack
            logEvent("log", {
                event: "app_duplicate_found",
                count: snap.size,
            });
        }
    } catch (e) {
        logEvent("error", {
            event: "app_failed_query",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
    }

    try {
        await addDoc(appsRef, payload);
    } catch (e) {
        logEvent("error", {
            event: "app_submit_error",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        // pass this along so that the application page handles the error
        throw e;
    }
}

/**
 * Gets all the applications from a given user
 */
export async function getUserApplications(uid: string) {
    try {
        const colRef = collection(firestore, APPLICATIONS_COLLECTION);
        const q = query(colRef, where("applicantId", "==", uid));
        const snap = await getDocs(q);
        const apps: ApplicationData[] = [];
        snap.forEach((doc) => apps.push(doc.data() as ApplicationData));
        return apps;
    } catch (e) {
        logEvent("error", {
            event: "search_user_applications_error",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
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
    try {
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
    } catch (e) {
        logEvent("error", {
            event: "upload_mentor_resume_error",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        throw e;
    }
}

export async function uploadGeneralResume(file: File, uid: string) {
    try {
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
    } catch (e) {
        logEvent("error", {
            event: "upload_general_resume_error",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        throw e;
    }
}

export async function verifyRSVP() {
    const verifyFn = httpsCallable(functions, "verifyRSVP");
    try {
        const res = await verifyFn();
        const data = res.data as { verified: boolean };
        return data.verified;
    } catch (e) {
        logEvent("error", {
            event: "verify_rsvp",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        return false;
    }
}

export async function checkRSVP(uid: string) {
    try {
        const rsvpRef = collection(firestore, RSVP_COLLECTION);
        const q = query(
            rsvpRef,
            where("uid", "==", uid),
            orderBy("timestamp", "desc"),
            limit(1)
        );
        const snap = await getDocs(q);
        if (snap.size < 1) {
            return false;
        }
        return snap.docs[0].data().verified;
    } catch (e) {
        console.log(e);
        logEvent("error", {
            event: "check_rsvp",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
    }
    return false;
}
