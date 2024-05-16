import { Timestamp } from "firebase/firestore";

export interface UserTicketData {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface MemberData {
    firstName: string;
    lastName: string;
    email: string;
    status: "pending" | "rejected" | "accepted";
}

export interface TeamData {
    id: string;
    members: MemberData[]; // the uid of all the members
    teamName: string;
    isOwner: boolean;
}

export interface CloudFunctionResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface Invitation {
    id: string; // invitation id
    owner: string; // the name of the owner
    teamName: string;
}

export type ResumeVisibility = "Public" | "Private" | "Sponsors Only";

export interface Socials {
    instagram: string;
    github: string;
    linkedin: string;
    discord: string;
    resumeRef: string;
    docId: string;
    uid: string;
    resumeVisibility?: ResumeVisibility;
}

export interface TicketData {
    firstName: string;
    lastName: string;
    pronouns: string;
    instagram: string;
    linkedin: string;
    github: string;
    discord: string;
    resumeRef: string; // gs:// format ref
    resumeVisibility?: ResumeVisibility;
}

export interface ExtendedTicketData extends TicketData {
    events: string[]; // id of the event items
    allergies: string[]; // list of allergies
}

export interface EventItem {
    id: string;
    title: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    location: string;
    description: string;
    type: string;
}

export interface WaitlistDoc {
    uid: string;
    joinAt: Timestamp;
}

export interface SpotDoc extends WaitlistDoc {
    expiresAt: Timestamp;
}
