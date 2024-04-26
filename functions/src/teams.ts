import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { Resend } from "resend";

const config = functions.config();

const RESEND_API_KEY = config.resend.key;
const NOREPLY_EMAIL = config.email.noreply;

const resend = new Resend(RESEND_API_KEY);

type InvitationStatus = "pending" | "sent" | "opened" | "accepted";

interface Invitation {
    uid: string;
    email: string;
    timestamp: Timestamp;
    status: InvitationStatus;
    teamId: string;
}

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
interface Member extends MemberData {
    id: string; // store the id for easy access for us when someone edits a team; but not exposed to client
}

// private schema for internal use
interface Team {
    teamName: string;
    members: Member[];
    owner: string;
    memberIDs: string[];
    createdAt: Timestamp;
}

const COLLECTION = "teams";
const PENDING_COLLECTION = "pending-invitations";

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
        const { teamName, members, owner } = snap.docs[0].data() as Team;
        const id = snap.docs[0].id;
        const teamData: TeamData = {
            id,
            teamName,
            members: members.map((m) => ({
                firstName: m.firstName,
                lastName: m.lastName,
                email: m.email,
            })),
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

/**
 * Creates a new team using the given team name from data and assigns
 * the requesting user as a member and owner of the team.
 */
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
                .where("accepted", "==", true)
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
                    id: context.auth.uid,
                },
            ],
            owner: context.auth.uid,
            createdAt: Timestamp.now(),
        };
        functions.logger.info("Saving team in firestore - createTeam");
        const docRef = await teamsRef.add(doc);
        functions.logger.info("Team saved - createTeam");
        const team: TeamData = {
            id: docRef.id,
            teamName: doc.teamName,
            members: doc.members,
            isOwner: doc.owner === context.auth.uid,
        };
        // return newly created team data
        return {
            status: 201,
            message: "Team created",
            data: team,
        };
    } catch (e) {
        functions.logger.error("Code 1207 - Failed to save team in firestore", {
            error: e,
        });
        return {
            status: 500,
            message: "Service down 1207.",
        };
    }
});

/**
 * Send invitation emails
 */
export const inviteMembers = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        functions.logger.warn("Unauthorized call to inviteMembers");
        return {
            status: 401,
            message: "Unauthorized",
        };
    }

    if (!z.string().email().array().nonempty().safeParse(data.emails).success) {
        return {
            status: 400,
            message: "Invalid payload",
        };
    }

    let team: Team | null = null;
    let teamId = "";
    try {
        // try to find if user has a team or not
        const snap = await admin
            .firestore()
            .collection(COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        if (snap.size < 1) {
            functions.logger.warn(
                "User requested invitations when not belonging to any team"
            );
            return {
                status: 400,
                message: "Requesting user does not belong to any team",
            };
        }
        team = snap.docs[0].data() as Team;
        teamId = snap.docs[0].id;
    } catch (e) {
        functions.logger.error(
            "Code 1208 - Failed to get the team requesting user belongs to.",
            { error: e }
        );
        throw new functions.https.HttpsError("internal", "Service down 1208");
    }

    if (!team) {
        return {
            status: 404,
            message: "Team not found",
        };
    }

    // setup document entries to track users when they accept the invitation
    // get invited user information
    functions.logger.info(
        "Verifying all invitations are for existing and accepted users..."
    );
    const invitationsRef = admin.firestore().collection(PENDING_COLLECTION);
    await Promise.allSettled(
        data.emails.map(async (email: string) => {
            try {
                const userRecord = await admin.auth().getUserByEmail(email);
                // we gotta make sure the user has been accepted to the hackathon
                const appSnap = await admin
                    .firestore()
                    .collection("applications")
                    .where("applicantId", "==", userRecord.uid)
                    .where("accepted", "==", true)
                    .get();
                if (appSnap.size < 1) {
                    functions.logger.info(
                        "User not accepted was invited to join a team. Skipping..."
                    );
                    return;
                }

                // add to invitation list
                const invitation: Invitation = {
                    uid: userRecord.uid,
                    email: email,
                    timestamp: Timestamp.now(),
                    status: "pending",
                    teamId: teamId,
                };

                let invitationId = "";
                try {
                    functions.logger.info(
                        "Storing invitation in firestore...",
                        email
                    );
                    const docRef = await invitationsRef.add(invitation);
                    invitationId = docRef.id;
                    functions.logger.info("Invitation stored.", email);
                } catch (e) {
                    functions.logger.error(
                        "Failed to store invitation in firestore.",
                        email,
                        { error: e }
                    );
                }

                if (invitationId) {
                    try {
                        functions.logger.info(
                            "Sending invitation email",
                            email
                        );

                        // send invitation
                        const res = await resend.emails.send({
                            from: NOREPLY_EMAIL as string,
                            to: email,
                            subject: `[HawkHacks] Team invitation to join ${team?.teamName}`,
                            html: `<a href="https://us-central1-hawkhacks-dashboard.cloudfunctions.net/joinTeam?invitation=${invitationId}">Join ${team?.teamName}</a>`,
                        });

                        if (res.error) {
                            functions.logger.error(
                                "Failed to send invitation email to",
                                email,
                                { error: res.error }
                            );
                        } else {
                            functions.logger.info(
                                "Invitation email sent to",
                                email
                            );
                        }
                    } catch (e) {
                        functions.logger.error(
                            "Failed to send invitation email",
                            email,
                            { error: e }
                        );
                    }
                }
            } catch (e) {
                functions.logger.error(
                    "Attempt to send invitation to a non registered user.",
                    email,
                    { error: e }
                );
            }
        })
    );

    return {
        status: 200,
        message: "Processed",
    };
});

export const deleteTeam = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        return {
            status: 401,
            message: "",
        };
    }

    // first, get the team the requesting user owns
    let teamDocRef:
        | admin.firestore.QueryDocumentSnapshot<
              admin.firestore.DocumentData,
              admin.firestore.DocumentData
          >
        | undefined = undefined;
    try {
        const snap = await admin
            .firestore()
            .collection(COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        teamDocRef = snap.docs[0];
    } catch (e) {
        functions.logger.error(
            "Failed to get team for requesting user - deleteTeam",
            { error: e }
        );
        throw new functions.https.HttpsError("internal", "Service down 1209");
    }

    if (teamDocRef) {
        // try to delete team
        try {
            functions.logger.info("Deleting team", { team: teamDocRef.data() });
            const res = await admin
                .firestore()
                .collection(COLLECTION)
                .doc(teamDocRef.id)
                .delete();
            functions.logger.info("Team deleted", {
                team: teamDocRef.data(),
                deleteTime: res.writeTime,
            });

            return {
                status: 200,
                message: "Team deleted.",
            };
        } catch (e) {
            functions.logger.error("Failed to delete team", {
                team: teamDocRef.data(),
            });
            throw new functions.https.HttpsError(
                "internal",
                "Service down 1210"
            );
        }
    }

    return {
        status: 404,
        message: "Team not found",
    };
});

export const updateTeamName = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return {
            status: 401,
            message: "unauthorize",
        };
    }

    if (!z.string().min(1).safeParse(data.name).success) {
        return {
            status: 400,
            message: "Invalid payload",
        };
    }

    try {
        const snap = await admin
            .firestore()
            .collection(COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        const doc = snap.docs[0];
        if (doc) {
            // update team name
            await admin
                .firestore()
                .collection(COLLECTION)
                .doc(doc.id)
                .update({ teamName: data.name });
            return {
                status: 200,
                message: "team name updated",
            };
        } else {
            return {
                status: 404,
                message: "team not found - updateTeamName",
            };
        }
    } catch (e) {
        functions.logger.error("Failed to update team name", { error: e });
        throw new functions.https.HttpsError("internal", "Service down 1211");
    }
});

export const removeMembers = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        functions.logger.warn("Unauthorized call to 'removeMembers'");
        return {
            status: 401,
            message: "unauthorize",
        };
    }

    if (!z.string().min(1).email().array().safeParse(data.emails).success) {
        return {
            status: 400,
            message: "Invalid payload",
        };
    }

    try {
        // we need to get the team that the requesting user owns
        // we'll use the information from the team document
        // to match the given emails of the members that are going
        // to be removed from the team
        const snap = await admin
            .firestore()
            .collection(COLLECTION)
            .where("owner", "==", context.auth.uid)
            .get();
        const docData = snap.docs[0]?.data() as Team;

        if (!docData) {
            functions.logger.warn(
                "Requesting user trying to remove team members when not owning any team.",
                {
                    uid: context.auth.uid,
                    emails: data.emails,
                }
            );
            return {
                status: 400,
                message: "Requesting user does not own any team.",
            };
        }

        // remove any team member with matching email
        functions.logger.info(
            "Removing members by filtering the members list..."
        );
        docData.members = docData.members.filter(
            (m) => !data.emails.includes(m.email)
        );
        functions.logger.info("Members filtered", { members: docData.members });

        return {
            status: 200,
            message: "Successfully removed members.",
        };
    } catch (e) {
        functions.logger.error("Failed to remove team members.", {
            error: e,
            owner: context.auth.uid,
            emails: data.emails,
        });
        throw new functions.https.HttpsError("internal", "Service down 1212");
    }
});
