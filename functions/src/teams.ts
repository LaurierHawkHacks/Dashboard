import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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
