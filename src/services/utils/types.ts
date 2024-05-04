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
    owner: string; // the name of the owner
    teamName: string;
}
