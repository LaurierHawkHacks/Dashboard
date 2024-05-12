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

export interface Socials {
    instagram: string;
    github: string;
    linkedin: string;
    discord: string;
    resumeRef: string;
    docId: string;
    uid: string;
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
}

export interface ExtendedTicketData extends TicketData {
    foods: string[]; // id of the food items
    events: string[]; // id of the event items
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

export interface FoodItem {
    id: string;
    title: string;
    time: Timestamp;
    location: string;
}
