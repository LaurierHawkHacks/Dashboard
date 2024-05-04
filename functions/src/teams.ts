import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { HttpStatus, response } from "./utils";

type InvitationStatus = "pending" | "rejected" | "accepted";

// return schema to client
interface MemberData {
    firstName: string;
    lastName: string;
    email: string;
    status: InvitationStatus;
}

// return schema to client
interface TeamData {
    id: string;
    teamName: string;
    members: MemberData[];
    isOwner: boolean;
}

// private schema for internal use
interface Team {
    id: string;
    name: string;
    owner: string;
    createdAt: Timestamp;
}

interface Invitation {
    invitationId: string;
    status: InvitationStatus;
    userId: string;
    teamId: string;
    invitationSentAt: Timestamp;
    resendEmailId: string; // this is for checking the email that was sent in resend.com
    firstName: string;
    lastName: string;
    email: string;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    teamId: string;
    uid: string;
}

const config = functions.config();

const RESEND_API_KEY = config.resend.key;
const NOREPLY_EMAIL = config.email.noreply;
const FE_URL = config.fe.url;
const APP_ENV = config.app.env;
const TEAMS_COLLECTION = "teams";
const USER_PROFILES_COLLECTION = "user-profiles";
const INVITATIONS_COLLECTION = "invitations";

async function internalSearchTeam(name: string): Promise<Team | undefined> {
    const snap = await admin
        .firestore()
        .collection(TEAMS_COLLECTION)
        .where("name", "==", name)
        .get();
    return snap.docs[0]?.data() as Team;
}

async function internalGetTeamByUser(uid: string): Promise<Team | undefined> {
    // get the user profile
    const profileSnap = await admin
        .firestore()
        .collection(USER_PROFILES_COLLECTION)
        .where("uid", "==", uid)
        .where("teamId", "!=", "")
        .get();
    const profile = profileSnap.docs[0]?.data() as UserProfile | undefined;
    if (!profile || !profile.teamId) {
        return;
    }

    // have to get the team first
    const snap = await admin
        .firestore()
        .collection(TEAMS_COLLECTION)
        .doc(profile.teamId)
        .get();

    if (!snap.exists) {
        return;
    }

    return snap.data() as Team | undefined;
}

async function internalGetMembersByTeam(teamId: string): Promise<MemberData[]> {
    const snap = await admin
        .firestore()
        .collection(USER_PROFILES_COLLECTION)
        .where("teamId", "==", teamId)
        .get();
    const members: MemberData[] = [];
    snap.forEach((doc) => {
        const data = doc.data() as UserProfile;
        // to get the status, we need to
        members.push({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            status: "accepted", // everyone who is in the team already must have accepted the team invitation
        });
    });
    return members;
}

/**
 * This functions differs from `internalGetMembersByTeam` because it gets the potential team members
 * based on invitations sent to join the given team.
 */
async function internalGetInvitedMembersByTeam(
    teamId: string
): Promise<MemberData[]> {
    const snap = await admin
        .firestore()
        .collection(INVITATIONS_COLLECTION)
        .where("teamId", "==", teamId)
        .where("status", "==", "pending")
        .get();
    const members: MemberData[] = [];
    snap.forEach((doc) => {
        const data = doc.data() as Invitation;
        members.push({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            status: data.status,
        });
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
        await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .doc(teamId)
            .set({
                id: teamId,
                name: data.name,
                owner: context.auth.uid,
                createdAt: Timestamp.now(),
            } as Team);
    } catch (e) {
        functions.logger.error("Failed to create a team", { error: e, func });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service dwon 1203",
        });
    }

    functions.logger.info("New team created.", { name: data.name, func });
    // find user profile or create one
    try {
        functions.logger.info("Looking for user profile", { func });
        const snap = await admin
            .firestore()
            .collection(USER_PROFILES_COLLECTION)
            .where("uid", "==", context.auth.uid)
            .where("teamId", "==", "")
            .get();
        const doc = snap.docs[0];
        if (!doc) {
            functions.logger.info("User profile not found, creating one...", {
                func,
            });
            await admin
                .firestore()
                .collection(USER_PROFILES_COLLECTION)
                .add({
                    firstName,
                    lastName,
                    email,
                    teamId,
                    uid: context.auth.uid,
                } as UserProfile);
            functions.logger.info("User profile created.", { func });
        } else {
            functions.logger.info("User profile found, updating...", { func });
            await admin
                .firestore()
                .collection(USER_PROFILES_COLLECTION)
                .doc(doc.id)
                .update({ teamId });
        }
    } catch (error) {
        functions.logger.error("Failed to check user profile", { error, func });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Failed to create team. (3)",
        });
    }

    // now we need to add the user as part of the team
    try {
        // return the team data for the FE to render
        const teamData: TeamData = {
            teamName: data.name,
            id: teamId,
            isOwner: true,
            members: [],
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
        const invitedMembers = await internalGetInvitedMembersByTeam(team.id);
        const totalMembers = [...members, ...invitedMembers];

        // create team data
        const teamData: TeamData = {
            id: team.id,
            teamName: team.name,
            isOwner: team.owner === context.auth.uid,
            members: totalMembers
                // do not include themselves as members
                .filter((m) => m.email !== context.auth?.token.email),
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

/**
 * Sends an email invitation
 */
export const inviteMember = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    if (!z.string().min(1).email().safeParse(data.email).success) {
        return response(HttpStatus.BAD_REQUEST, { message: "Invalid payload" });
    }

    const func = "inviteMember";

    // try to find requesting user team
    let team: Team | undefined;
    try {
        functions.logger.info("Getting requesting user's team...", { func });
        team = await internalGetTeamByUser(context.auth.uid);
        if (!team) {
            functions.logger.info(
                "Team not found for requesting user. Cannot proceed with invitation",
                { func }
            );
            return response(HttpStatus.BAD_REQUEST, {
                message: "No team found",
            });
        }
    } catch (error) {
        functions.logger.error("Failed to get requesting user's team", {
            error,
            func,
        });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service down 1207",
        });
    }

    // check if user is owner
    if (team.owner !== context.auth.uid) {
        functions.logger.info("Invitation attempt by non-owner user", { func });
        return response(HttpStatus.BAD_REQUEST, {
            message: "You must be the owner of the team to invite others.",
        });
    }

    // check if invitee is a real user in the app
    let userRecord: admin.auth.UserRecord | undefined;
    try {
        userRecord = await admin.auth().getUserByEmail(data.email);
    } catch (error) {
        functions.logger.error(
            "Failed to find user record with email",
            data.email,
            { error, func }
        );
        return response(HttpStatus.NOT_FOUND, {
            message: "Could not send invitation.",
        });
    }

    if (!userRecord.customClaims?.rsvpVerified) {
        return response(HttpStatus.NOT_FOUND, {
            message: "Could not send invitation.",
        });
    }

    // only send invitation if invitee has been accepted
    let app: { firstName: string; lastName: string; accepted: boolean };
    try {
        functions.logger.info(
            "Checking if invitee has been accepted to HawkHacks...",
            { func }
        );
        const snap = await admin
            .firestore()
            .collection("applications")
            .where("applicantId", "==", userRecord.uid)
            .get();
        app = snap.docs[0]?.data() as {
            firstName: string;
            lastName: string;
            accepted: boolean;
        };
        if (app && !app.accepted) {
            functions.logger.info(
                "Invitee was not accepted to HawkHacks. Skip sending invitation email.",
                { func }
            );
            return response(HttpStatus.BAD_REQUEST, {
                message: "Invalid request",
            });
        } else if (!app) {
            functions.logger.info("Invitee did not apply to HawkHacks", {
                func,
            });
            return response(HttpStatus.BAD_REQUEST, {
                message: "Invalid request",
            });
        }
    } catch (error) {
        functions.logger.error(
            "Failed to check if inviteee has been accpeted to HawkHacks.",
            { func }
        );
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service down 1208",
        });
    }

    const invitationId = uuidv4();
    // add invitee to the team members collection
    try {
        functions.logger.info("Adding invitee to team members collection", {
            func,
        });
        await admin
            .firestore()
            .collection(INVITATIONS_COLLECTION)
            .doc(invitationId)
            .set({
                userId: userRecord.uid,
                email: userRecord.email || data.email,
                firstName: app.firstName,
                lastName: app.lastName,
                teamId: team.id,
                status: "pending",
                resendEmailId: "", // email not sent yet
                invitationId,
                invitationSentAt: Timestamp.now(),
            } as Invitation);
    } catch (error) {
        functions.logger.error(
            "Failed to add invitee to team members collection.",
            { func, error }
        );
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Failed to invite member to join team.",
        });
    }

    // send invitation
    if (APP_ENV === "production") {
        try {
            functions.logger.info("Sending invitation email", {
                to: data.email,
                func,
            });
            const resend = new Resend(RESEND_API_KEY);
            const sent = await resend.emails.send({
                from: NOREPLY_EMAIL,
                to: data.email,
                subject: "[HawkHacks] Team Invitation",
                html: `<a href="https://${FE_URL}/join-team/${invitationId}">link</a>`,
            });
            functions.logger.info("Invitation email sent!", {
                to: data.email,
                func,
            });
            functions.logger.info("Updating invitation with resend email id.", {
                func,
            });
            await admin
                .firestore()
                .collection(INVITATIONS_COLLECTION)
                .doc(invitationId)
                .update({ resendEmailId: sent.data?.id ?? "" })
                .catch((e) =>
                    functions.logger.error(
                        "Failed to update invitation with resend email id",
                        { func, error: e }
                    )
                );
        } catch (error) {
            functions.logger.error("Failed to invite member to join team.", {
                error,
                func,
                email: data.email,
            });
            return response(HttpStatus.INTERNAL_SERVER_ERROR, {
                message: "Service down 1201",
            });
        }
    }

    return response(HttpStatus.CREATED, {
        message: "Email sent!",
        data: {
            email: userRecord.email,
            firstName: app.firstName,
            lastName: app.lastName,
            status: "pending",
        } as MemberData,
    });
});

/*
 * Updates the name for the requesting user's team
 * The requesting user must be the owner
 */
export const updateTeamName = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    if (!z.string().min(1).safeParse(data.name)) {
        return response(HttpStatus.BAD_REQUEST, { message: "Invalid payload" });
    }

    const func = "updateTeamName";

    // find the team the requesting user owns and update name
    try {
        functions.logger.info("Getting team requesting user owns", { func });
        const snap = await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        const team = snap.docs[0]?.data() as Team | undefined;
        if (!team) {
            functions.logger.info("Requesting user's team not found", { func });
            return response(HttpStatus.NOT_FOUND, {
                message: "Failed to find team.",
            });
        }
        functions.logger.info("Found requesting user's team", { func });
        functions.logger.info("Updating team's name...", { func });
        await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .doc(team.id)
            .update({ name: data.name });
        functions.logger.info("Team name updated!", { func });
    } catch (error) {
        functions.logger.error("Failed to get team for requesting user.", {
            func,
            error,
        });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Failed to changed team name (1).",
        });
    }

    return response(HttpStatus.OK, { message: "Team name updated!" });
});

/**
 * Remove the members given in the payload as long as the requesting user is owner of
 * a team. It will just remove the members from the team the user owns to avoid others messing up
 * with other teams.
 */
export const removeMembers = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    if (!z.string().email().array().min(1).safeParse(data.emails).success) {
        return response(HttpStatus.BAD_REQUEST, { message: "Invalid payload" });
    }

    const func = "removeMembers";

    // find the team the requesting user owns and update members
    try {
        functions.logger.info("Getting team that requesting user owns", {
            func,
        });
        const snap = await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        const team = snap.docs[0]?.data() as Team | undefined;
        if (!team) {
            functions.logger.info("Team not found", { func });
            return response(HttpStatus.NOT_FOUND, {
                message: "Team not found.",
            });
        }
        functions.logger.info("Found team requesting user owns.", { func });

        // now we need to remove any document form team-members collection that are in the given team
        // and it matches any email in the payload
        const deleteSnap = await admin
            .firestore()
            .collection(USER_PROFILES_COLLECTION)
            .where("email", "in", data.emails)
            .where("teamId", "==", team.id)
            .get();
        const batch = admin.firestore().batch();
        deleteSnap.forEach((doc) => {
            batch.update(doc.ref, { teamId: "" });
        });

        // delete any invitation sent to the members
        const invitationSnap = await admin
            .firestore()
            .collection(INVITATIONS_COLLECTION)
            .where("email", "in", data.emails)
            .where("teamId", "==", team.id)
            .get();
        invitationSnap.forEach((doc) => {
            functions.logger.info("invitation:", doc.id);
            batch.delete(doc.ref);
        });

        await batch.commit();
    } catch (error) {
        functions.logger.error(
            "Failed to get team that requesting user owns.",
            { func }
        );
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Failed to remove members (1).",
        });
    }

    return response(HttpStatus.OK);
});

/**
 * Delete the team the requesting user owns.
 */
export const deleteTeam = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    const func = "deleteTeam";

    // delete team if requesting user owns one
    try {
        functions.logger.info("Deleting team...", { func });
        const snap = await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        const team = snap.docs[0]?.data() as Team | undefined;
        if (!team) {
            functions.logger.info("No team found to delete.", { func });
            return response(HttpStatus.NOT_FOUND, {
                message: "Team not found.",
            });
        }
        // make a batch write request to delete team and all team members in the given team
        const memberSnap = await admin
            .firestore()
            .collection(USER_PROFILES_COLLECTION)
            .where("teamId", "==", team.id)
            .get();
        const batch = admin.firestore().batch();
        memberSnap.forEach((m) => {
            // update the user profile to not have the team id
            batch.update(m.ref, { teamId: "" });
        });
        // delete team
        batch.delete(snap.docs[0].ref);
        // commit
        await batch.commit();
    } catch (error) {
        functions.logger.error("Failed to delete team.", { func, error });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Failed to delete team (1).",
        });
    }

    return response(HttpStatus.OK, { message: "Team deleted" });
});

/**
 * Validates the invitation and set the status in team-members collection for the given user to "accepted"
 */
export const validateTeamInvitation = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            return response(HttpStatus.UNAUTHORIZED, {
                message: "Unathorized",
            });
        }

        if (!z.string().uuid().safeParse(data.code).success) {
            return response(HttpStatus.BAD_REQUEST, {
                message: "Invalid payload",
            });
        }

        const func = "validateTeamInvitation";

        // check if invitation code is for the given user
        let invitation: Invitation | undefined;
        try {
            functions.logger.info(
                "Checking if invitation is for requesting user",
                { func }
            );
            const snap = await admin
                .firestore()
                .collection(INVITATIONS_COLLECTION)
                .where("invitationId", "==", data.code)
                .where("userId", "==", context.auth.uid)
                .where("status", "==", "pending")
                .get();
            invitation = snap.docs[0]?.data() as Invitation;
            if (!invitation) {
                functions.logger.info(
                    "Requesting user is not the user the invitation is meant for. Do not add user to team.",
                    { func }
                );
                return response(HttpStatus.BAD_REQUEST, {
                    message: "Invitation does not exists or expired.",
                });
            }
            // if we found a member, then it is for the requesting user
            // now we update the status of the member
            functions.logger.info("Updating invitation status", { func });
            await admin
                .firestore()
                .collection(INVITATIONS_COLLECTION)
                .doc(data.code)
                .update({ status: "accepted" });
            functions.logger.info("Invitation status updated.", { func });
        } catch (error) {
            functions.logger.error(
                "Failed to check if invitation is for requesting user",
                { func, error }
            );
            return response(HttpStatus.INTERNAL_SERVER_ERROR, {
                message: "Failed to join team. (2)",
            });
        }

        // update user profile
        try {
            functions.logger.info(
                "Checking if requesting user has a profile...",
                { func }
            );
            const snap = await admin
                .firestore()
                .collection(USER_PROFILES_COLLECTION)
                .where("uid", "==", context.auth.uid)
                .get();
            if (!snap.docs[0]) {
                functions.logger.info(
                    "Requesting user has no profile, creating...",
                    { func }
                );
                await admin
                    .firestore()
                    .collection(USER_PROFILES_COLLECTION)
                    .add({
                        firstName: invitation.firstName,
                        lastName: invitation.lastName,
                        email: invitation.email,
                        teamId: invitation.teamId,
                        uid: context.auth.uid,
                    } as UserProfile);
            } else {
                functions.logger.info(
                    "Found user profile, updating teamId...",
                    { func }
                );
                await admin
                    .firestore()
                    .collection(USER_PROFILES_COLLECTION)
                    .doc(snap.docs[0].id)
                    .update({ teamId: invitation.teamId });
            }
        } catch (error) {
            functions.logger.error("Failed to update user profile", {
                func,
                error,
            });
            return response(HttpStatus.INTERNAL_SERVER_ERROR, {
                message: "Failed to join team.",
            });
        }

        return response(HttpStatus.OK, { message: "Joined team." });
    }
);

/**
 * Reject an invitation if the invitation is for the requesting user
 */
export const rejectInvitation = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            return response(HttpStatus.UNAUTHORIZED, {
                message: "Unathorized",
            });
        }

        if (!z.string().uuid().safeParse(data.code).success) {
            return response(HttpStatus.BAD_REQUEST, {
                message: "Invalid payload",
            });
        }

        const func = "rejectInvitation";

        // check if invitation code is for the given user
        let invitation: Invitation | undefined;
        try {
            functions.logger.info(
                "Checking if invitation is for requesting user",
                { func }
            );
            const snap = await admin
                .firestore()
                .collection(INVITATIONS_COLLECTION)
                .where("invitationId", "==", data.code)
                .where("userId", "==", context.auth.uid)
                .where("status", "==", "pending")
                .get();
            invitation = snap.docs[0]?.data() as Invitation;
            if (!invitation) {
                functions.logger.info(
                    "Requesting user is not the user the invitation is meant for. Do not add user to team.",
                    { func }
                );
                return response(HttpStatus.BAD_REQUEST, {
                    message: "Invitation does not exists or expired.",
                });
            }
            // if we found a member, then it is for the requesting user
            // now we update the status of the member
            functions.logger.info("Updating invitation status", { func });
            await admin
                .firestore()
                .collection(INVITATIONS_COLLECTION)
                .doc(data.code)
                .update({ status: "rejected" });
            functions.logger.info("Invitation status updated.", { func });
        } catch (error) {
            functions.logger.error(
                "Failed to check if invitation is for requesting user",
                { func, error }
            );
            return response(HttpStatus.INTERNAL_SERVER_ERROR, {
                message: "Failed to reject invitation. (2)",
            });
        }

        return response(HttpStatus.OK, { message: "Invitation rejected." });
    }
);

export const checkInvitation = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return response(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
    }

    if (!z.string().uuid().safeParse(data.code).success) {
        return response(HttpStatus.BAD_REQUEST, { message: "Bad Request" });
    }

    try {
        const snap = await admin
            .firestore()
            .collection(INVITATIONS_COLLECTION)
            .where("invitationId", "==", data.code)
            .where("userId", "==", context.auth.uid)
            .get();
        const doc = snap.docs[0];
        if (!doc) {
            return response(HttpStatus.NOT_FOUND, { message: "Not Found" });
        }

        const teamDoc = await admin
            .firestore()
            .collection(TEAMS_COLLECTION)
            .doc(doc.data().teamId)
            .get();
        if (!teamDoc.exists) {
            return response(HttpStatus.NOT_FOUND, { message: "Not Found" });
        }

        const team = teamDoc.data() as Team;

        const ownerDetails = (
            await admin
                .firestore()
                .collection(USER_PROFILES_COLLECTION)
                .where("uid", "==", team.owner)
                .where("teamId", "==", team.id)
                .get()
        ).docs[0]?.data();
        if (!ownerDetails) {
            return response(HttpStatus.NOT_FOUND, { message: "Not Found" });
        }

        return response(HttpStatus.OK, {
            message: "ok",
            data: {
                teamName: team.name,
                owner: `${ownerDetails.firstName} ${ownerDetails.lastName}`,
            },
        });
    } catch (e) {
        functions.logger.error("Failed to check invitation.", {
            error: e,
            func: "checkInvitation",
        });
        return response(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Service Down (invitation) ",
        });
    }
});
