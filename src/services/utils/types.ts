export interface UserTicketData {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface MemberData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface TeamData {
    teamId: string;
    members: MemberData[]; // the uid of all the members
    teamName: string;
}

export interface CloudFunctionResponse<T> {
    status: number;
    message: string;
    data: T;
}
