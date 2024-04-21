import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

interface Member {
    firstName: string;
    lastName: string;
    email: string;
}

interface TeamData {
    id: string;
    teamName: string;
    members: Member[];
    isOwner: boolean;
}

interface Team {
    teamName: string;
    members: Member[];
    owner: string;
    memberIDs: string[];
    createdAt: Timestamp;
}

const COLLECTION = "teams";

/**
 * get team information the requesting user is part of
 */
export const getTeamByUser = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        functions.logger.warn(
            "Unauthenticated requesst to getlTeamByUser attempted."
        );
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Unauthenticated"
        );
    }

    try {
        functions.logger.info("Getting team for user", context.auth.uid);
        const teamsRef = admin.firestore().collection(COLLECTION);
        // the document has another field with all the member ids
        // which is not selected to avoid exposing all the ids...
        const query = teamsRef
            .where("memberIDs", "array-contains", context.auth.uid)
            .limit(1);
        const snap = await query.get();

        // user does not belong to any team yet.
        if (snap.size < 1) {
            functions.logger.info("No team found for user", context.auth.uid);
            return { status: 404, message: "No team found." };
        }

        // only returning the nessesary information.
        const { teamName, members, owner } = snap.docs[0].data();
        const id = snap.docs[0].id;
        const teamData: TeamData = {
            id,
            teamName,
            members,
            isOwner: owner === context.auth.uid,
        };

        return {
            status: 200,
            message: "OK",
            data: teamData,
        };
    } catch (e) {
        functions.logger.error(
            "Code 1201 - Failed to get team for user:",
            context.auth.uid,
            { error: e }
        );
        throw new functions.https.HttpsError("internal", "Service down 1201.");
    }
});

/**
 * searches if the given team name has been occupied or not
 */
export const isTeamNameAvailable = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            functions.logger.warn(
                "Unauthorized call attempt - isTeamNameAvailable"
            );
            return {
                status: 401,
                message: "unauthorized",
            };
        }

        if (!data.name) {
            functions.logger.warn("Invalid payload - isTeamNameAvailable");
            return {
                status: 400,
                message: "Invalid payload",
            };
        }

        try {
            const teamsRef = admin.firestore().collection(COLLECTION);
            const snap = await teamsRef
                .where("teamName", "==", data.name)
                .get();
            return {
                status: 200,
                data: snap.size == 0,
            };
        } catch (e) {
            functions.logger.error("Code 1202 - Failed to search team name.", {
                error: e,
            });
            return {
                status: 500,
                message: "Service down 1202.",
            };
        }
    }
);

export const createTeam = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        functions.logger.warn("Unauthorized call attempt - createTeam");
        return {
            status: 401,
            message: "unauthorized",
        };
    }

    if (!data.teamName) {
        functions.logger.warn("Invalid payload - createTeam");
        return {
            status: 400,
            message: "Invalid payload",
        };
    }

    functions.logger.info("Validating payload...", data);
    const res = await z.string().min(1).safeParseAsync(data.teamName);
    if (!res.success) {
        functions.logger.warn("Invalid payload - createTeam");
        return {
            status: 400,
            message: "Invalid payload",
        };
    }

    // defined outside since it will be reused
    const teamsRef = admin.firestore().collection(COLLECTION);

    // check if there is a team with the same name, reject if there is
    try {
        functions.logger.info(
            "Checking for duplicate team - createTeam",
            data.teamName
        );
        const snap = await teamsRef
            .where("teamName", "==", data.teamName)
            .get();
        if (snap.size > 0) {
            functions.logger.warn(
                "Code 1204 - Attempt to create a team with duplicated team name."
            );
            return {
                status: 400,
                message: "Service Error 1204.",
            };
        }
    } catch (e) {
        functions.logger.error(
            "Code 1203 - Failed to check for duplicate team",
            { error: e }
        );
        return {
            status: 500,
            message: "Service down 1203.",
        };
    }

    // check if user belongs to a team already, reject team creation from someone who belongs to a team
    try {
        functions.logger.info(
            "Checking if requesting user belongs to a team already - createTeam"
        );
        const snap = await teamsRef
            .where("memberIDs", "array-contains", context.auth.uid)
            .get();
        if (snap.size > 0) {
            functions.logger.warn(
                "Code 1205 - Attempt to create a team when user already belongs to an existing team."
            );
            return {
                status: 400,
                message: "Service Error 1205.",
            };
        }
    } catch (e) {
        functions.logger.error(
            "Code 1206 - Failed to check if user belongs to a team",
            { error: e }
        );
        return {
            status: 500,
            message: "Service down 1206.",
        };
    }

    // create team
    try {
        functions.logger.info(
            "Getting requesting user application - createTeam"
        );
        // we get the application to get their first and last names
        const app = (
            await admin
                .firestore()
                .collection("applications")
                .where("applicantId", "==", context.auth.uid)
                .select("firstName", "lastName")
                .get()
        ).docs[0].data();
        const doc: Team = {
            teamName: data.teamName,
            memberIDs: [context.auth.uid],
            members: [
                {
                    firstName: app.firstName,
                    lastName: app.lastName,
                    email: context.auth.token.email as string,
                },
            ],
            owner: context.auth.uid,
            createdAt: Timestamp.now(),
        };
        functions.logger.info("Saving team in firestore - createTeam");
        await teamsRef.add(doc);
        functions.logger.info("Team saved - createTeam");
    } catch (e) {
        functions.logger.error("Code 1207 - Failed to save team in firestore", {
            error: e,
        });
        return {
            status: 500,
            message: "Service down 1207.",
        };
    }

    return {
        status: 201,
        message: "Team created!",
    };
});
