import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
// import { Resend } from "resend";
import { HttpStatus, response } from "./utils";

// type InvitationStatus = "pending" | "sent" | "opened" | "accepted";

// interface Invitation {
//     invitedUserId: string;
//     sentAt: Timestamp;
//     status: InvitationStatus;
//     teamId: string;
// }

// return schema to client
interface MemberData {
    firstName: string;
    lastName: string;
    email: string;
}

// return schema to client
interface TeamData {
    id: string;
    teamName: string;
    members: MemberData[];
    isOwner: boolean;
}

// private schema for internal
interface Member {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    teamId: string;
}

// private schema for internal use
interface Team {
    id: string;
    name: string;
    owner: string;
    createdAt: Timestamp;
}

// const config = functions.config();

// const RESEND_API_KEY = config.resend.key;
// const NOREPLY_EMAIL = config.email.noreply;
// const FE_URL = config.fe.url;
const TEAMS_COLLECTION = "teams";
const TEAM_MEMBERS_COLLECTION = "team-members";
// const resend = new Resend(RESEND_API_KEY);

async function internalSearchTeam(name: string): Promise<Team | undefined> {
    const snap = await admin
        .firestore()
        .collection(TEAMS_COLLECTION)
        .where("name", "==", name)
        .get();
    return snap.docs[0]?.data() as Team;
}

async function internalGetTeamByUser(uid: string): Promise<Team | undefined> {
    const snap = await admin
        .firestore()
        .collection(TEAM_MEMBERS_COLLECTION)
        .where("uid", "==", uid)
        .get();
    const memberData = snap.docs[0]?.data() as Member;
    if (memberData && memberData.teamId) {
        const snap = await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .doc(memberData.teamId)
            .get();
        return snap.data() as Team;
    }

    return undefined;
}

async function internalGetMembersByTeam(teamId: string): Promise<Member[]> {
    const snap = await admin
        .firestore()
        .collection(TEAM_MEMBERS_COLLECTION)
        .where("teamId", "==", teamId)
        .get();
    const members: Member[] = [];
    snap.forEach((doc) => {
        members.push(doc.data() as Member);
    });
    return members;
}

/**
 * Searches if team name is available or not
 */
export const isTeamNameAvailable = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            return response(HttpStatus.UNAUTHORIZED, {
                message: "Unauthorized",
            });
        }

        if (!z.string().min(1).safeParse(data.name).success) {
            return response(HttpStatus.BAD_REQUEST, {
                message: "Invalid payload.",
            });
        }

        const func = "isTeamNameAvailable";

        // search team
        try {
            functions.logger.info(
                "Searching for team with given name",
                data.name,
                { func }
            );
            const team = await internalSearchTeam(data.name);
            // team name is available if no team was found
            return response(HttpStatus.OK, { data: team === undefined });
        } catch (e) {
            functions.logger.error(
                "Failed to find if team name is available or not.",
                { error: e, func }
            );
            return response(HttpStatus.INTERNAL_SERVER_ERROR, {
                message: "Servide down 1201",
            });
        }
    }
);

/**
 * Creates a new team and adds the requesting user to the team doc
 */
export const createTeam = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    if (!z.string().min(1).safeParse(data.name).success) {
        return response(HttpStatus.BAD_REQUEST, {
            message: "Invalid payload.",
        });
    }

    const func = "createTeam";

    let firstName = "";
    let lastName = "";
    try {
        functions.logger.info("Checking if user has been accepted or not", {
            func,
        });
        const snap = await admin
            .firestore()
            .collection("applications")
            .where("applicantId", "==", context.auth.uid)
            .where("accepted", "==", true)
            .get();
        if (snap.size < 1) {
            // user either did not apply or not accepted
            functions.logger.info(
                "Requesting user either did not apply or not accepted",
                { func }
            );
            return response(HttpStatus.BAD_REQUEST, {
                message: "Not accepted into the hackathon.",
            });
        }

        const data = snap.docs[0].data();
        firstName = data.firstName;
        lastName = data.lastName;
    } catch (error) {
        functions.logger.error("Failed to check if user has been accepted", {
            error,
            func,
        });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service down 1205",
        });
    }

    // we need to get the user email so we are getting it from the firebase auth records
    let email = "";
    try {
        functions.logger.info("Getting user auth records for email access...", {
            func,
        });
        const userRecord = await admin.auth().getUser(context.auth.uid);
        email = userRecord.email ?? "";
    } catch (error) {
        functions.logger.error("Failed to get user records", { func, error });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Servicde down 1206",
        });
    }

    try {
        functions.logger.info(
            "Checking if requesting user owns/belongs to a team already",
            { func }
        );
        const team = await internalGetTeamByUser(context.auth.uid);
        if (team) {
            functions.logger.info(
                "Requesting user owns/belongs to a team already",
                {
                    func,
                    team,
                }
            );
            return response(HttpStatus.BAD_REQUEST, {
                message: "Requesting user owns/belongs to a team already",
            });
        }
    } catch (e) {
        functions.logger.error(
            "Failed to check if requesting user owns/belongs to a team already.",
            { func }
        );
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service down 1202",
        });
    }

    // create a team
    const teamId = uuidv4();
    try {
        functions.logger.info("Creating team for requesting user...", { func });
        await admin.firestore().collection(TEAMS_COLLECTION).doc(teamId).set({
            id: teamId,
            name: data.name,
            owner: context.auth.uid,
            createdAt: Timestamp.now(),
        });
    } catch (e) {
        functions.logger.error("Failed to create a team", { error: e, func });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service dwon 1203",
        });
    }

    functions.logger.info("New team created.", { name: data.name, func });
    // now we need to add the user as part of the team
    try {
        functions.logger.info(
            "Adding requesting user as a member of newly created team...",
            { func }
        );
        const memberRef = await admin
            .firestore()
            .collection(TEAM_MEMBERS_COLLECTION)
            .add({
                uid: context.auth.uid,
                firstName,
                lastName,
                email,
                teamId,
            });
        const memberId = memberRef.id;
        functions.logger.info("Successfully added a member to team.", {
            func,
            memberId,
            teamId,
        });

        // return the team data for the FE to render
        const teamData: TeamData = {
            teamName: data.name,
            id: teamId,
            isOwner: true,
            members: [
                {
                    firstName,
                    lastName,
                    email,
                },
            ],
        };

        return response<TeamData>(HttpStatus.CREATED, {
            message: "Team created.",
            data: teamData,
        });
    } catch (error) {
        functions.logger.error(
            "Failed to add requesting user as a member of newly created team...",
            { func, error }
        );
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service down 1204",
        });
    }
});

/**
 * Gets the team that the requesting user belongs to
 */
export const getTeamByUser = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    const func = "getTeamByUser";

    try {
        functions.logger.info("Getting team for requesting user...", { func });
        const team = await internalGetTeamByUser(context.auth.uid);
        if (!team)
            return response(HttpStatus.NOT_FOUND, {
                message: "No team found for requesting user.",
            });

        functions.logger.info("Getting team members...", { func });
        const members = await internalGetMembersByTeam(team.id);

        // create team data
        const teamData: TeamData = {
            id: team.id,
            teamName: team.name,
            isOwner: team.owner === context.auth.uid,
            members: members.map((m) => {
                // remove the uid from the general member data
                const member: MemberData = {
                    email: m.email,
                    firstName: m.firstName,
                    lastName: m.lastName,
                };
                return member;
            }),
        };

        functions.logger.info("data", { teamData });

        return response(HttpStatus.OK, { data: teamData });
    } catch (error) {
        functions.logger.error("Failed to get team for requesting user.", {
            error,
            func,
        });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service down 1201",
        });
    }
});
