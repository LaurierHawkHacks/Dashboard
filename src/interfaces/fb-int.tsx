import { Timestamp } from "firebase/firestore";
interface hackerApplications {
    applicantId: string; // match user.uid
    applicationDate: Timestamp; // firestore timestamp
    hackathonTerm: string; // F23 or W24 etc...
    notifyByEmail: boolean;
    notifyBySMS: boolean;
    inAcceptedList: boolean; // for admin dashboard application tables.
    finalDecision: "pending" | "accepted" | "rejected";
    type: "hacker" | "mentor";

    // additional fields that are not essesntial to manage applications
}

export type { hackerApplications };
