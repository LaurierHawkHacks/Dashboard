import {
    addDoc,
    collection,
    getDocs,
    limit,
    query,
    where,
    Timestamp,
    doc,
    setDoc,
    orderBy,
} from "firebase/firestore";
import { firestore, functions, storage } from "@/services/firebase";
import type {
    CloudFunctionResponse,
    UserTicketData,
    Socials,
    EventItem,
} from "@/services/utils/types";
import { ApplicationData } from "@/components/forms/types";
import { httpsCallable } from "firebase/functions";
import { getBlob, getMetadata, ref, uploadBytes } from "firebase/storage";

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

export async function handleError(e: Error, event: string) {
    await logEvent("error", {
        event,
        message: (e as Error).message,
        name: (e as Error).name,
    });
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
        applicationStatus: "In Review",
    };

    const appsRef = collection(firestore, APPLICATIONS_COLLECTION);
    let appId = "";
    try {
        const q = query(appsRef, where("applicantId", "==", uid), limit(1));
        const snap = await getDocs(q);
        appId = snap.docs[0]?.id ?? "";
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
        if (appId) {
            // replace
            const docRef = doc(firestore, "applications", appId);
            await setDoc(docRef, payload);
        } else {
            await addDoc(appsRef, payload);
        }
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

export async function getResume(gs: string) {
    const gsRef = ref(storage, gs);
    try {
        const metadata = await getMetadata(gsRef);
        const blob = await getBlob(gsRef);
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = metadata.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        logEvent("error", {
            event: "get_resume_error",
        });
    }
}

export async function getResumeURL(gs: string) {
    const gsRef = ref(storage, gs);
    try {
        const blob = await getBlob(gsRef);
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    } catch (e) {
        logEvent("error", {
            event: "get_resume_error",
        });
    }
}

export async function verifyRSVP() {
    const verifyFn = httpsCallable(functions, "verifyRSVP");
    try {
        const res = await verifyFn();
        const data = res.data as {
            status: number;
            verified: boolean;
            message?: string;
        };
        return data;
    } catch (e) {
        logEvent("error", {
            event: "verify_rsvp",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        return {
            status: 500,
            verified: false,
            message: "Internal server error",
        };
    }
}
export async function getSocials() {
    const fn = httpsCallable<unknown, CloudFunctionResponse<Socials>>(
        functions,
        "requestSocials"
    );
    try {
        const res = await fn();
        const data = res.data;
        return data;
    } catch (e) {
        handleError(e as Error, "error_get_socials");
        throw e;
    }
}

export async function updateSocials(socials: Socials) {
    const fn = httpsCallable<unknown, CloudFunctionResponse<Socials>>(
        functions,
        "updateSocials"
    );
    try {
        const res = await fn(socials);
        const data = res.data;
        return data;
    } catch (e) {
        handleError(e as Error, "error_update_socials");
        throw e;
    }
}

export async function getRedeemableItems() {
    try {
        const eventsQ = query(
            collection(firestore, "events"),
            orderBy("startTime", "asc")
        );
        const eventSnap = await getDocs(eventsQ);
        const events: EventItem[] = [];
        eventSnap.forEach((doc) => events.push(doc.data() as EventItem));

        return events;
    } catch (e) {
        handleError(e as Error, "error_getting_redeemable_items");
        throw e;
    }
}

export async function redeemItem(
    ticketId: string,
    itemId: string,
    type: "event" | "food"
) {
    const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
        functions,
        "redeemItem"
    );
    try {
        const res = await fn({ ticketId, itemId, type });
        const data = res.data;
        return data;
    } catch (e) {
        handleError(e as Error, "error_update_socials");
        throw e;
    }
}

export async function withdrawRSVP() {
    const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
        functions,
        "withdrawRSVP"
    );
    try {
        const res = await fn();
        const data = res.data;
        return data;
    } catch (error) {
        handleError(error as Error, "error_dismissing_rsvp");
        throw error;
    }
}

export async function joinWaitlist() {
    const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
        functions,
        "joinWaitlist"
    );
    try {
        const res = await fn();
        const data = res.data;
        return data;
    } catch (error) {
        handleError(error as Error, "error_joining_waitlist");
        throw error;
    }
}
