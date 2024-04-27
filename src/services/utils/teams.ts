import { functions } from "@/services/firebase";
import { handleError } from "@/services/utils";
import { httpsCallable } from "firebase/functions";
import type { CloudFunctionResponse, TeamData } from "./types";

/**
 * Get the team the authenticated user belongs to.
 */
export async function getTeamByUser() {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<TeamData>>(
            functions,
            "getTeamByUser"
        );
        const { data } = await fn();
        return data;
    } catch (e) {
        await handleError(e as Error, "get_team_error");
        throw e;
    }
}

/**
 * Searches if a team with given name exists or not
 */
export async function isTeamNameAvailable(name: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<boolean>>(
            functions,
            "isTeamNameAvailable"
        );
        const { data } = await fn({ name });
        if (data.status === 200) {
            return data.data;
        }
    } catch (e) {
        await handleError(e as Error, "available_team_name_error");
        throw e;
    }

    return false;
}

/**
 * Calls the cloud function to create new team
 */
export async function createTeam(name: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<TeamData>>(
            functions,
            "createTeam"
        );
        const { data } = await fn({ name });
        return data;
    } catch (e) {
        await handleError(e as Error, "create_team_error");
        throw e;
    }
}

// The following functions are team owners only. Regular members calling this will result in failure/rejection

/**
 * Calls the cloud function that sends emails to the given members.
 */
export async function inviteMember(email: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
            functions,
            "inviteMember"
        );
        const { data } = await fn({ email });
        return data;
    } catch (e) {
        await handleError(e as Error, "invite_members_error");
        throw e;
    }
}

/**
 * Calls the cloud function 'updateTeamName' that updates the given team
 */
export async function updateTeamName(name: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
            functions,
            "updateTeamName"
        );
        const { data } = await fn({ name });
        return data;
    } catch (e) {
        await handleError(e as Error, "update_team_name_error");
        throw e;
    }
}

/**
 * Calls the cloud function 'removeMembers' that removes memebrs from a given team
 * @param emails - the emails of the members to remove from the team.
 */
export async function removeMembers(emails: string[]) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
            functions,
            "removeMembers"
        );
        const { data } = await fn({ emails });
        return data;
    } catch (e) {
        await handleError(e as Error, "remove_members_error");
        throw e;
    }
}

/**
 * Calls the cloud function 'deleteTeam' that deletes the given team the requesting user owns
 */
export async function deleteTeam() {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
            functions,
            "deleteTeam"
        );
        const { data } = await fn();
        return data;
    } catch (e) {
        await handleError(e as Error, "delete_team_error");
        throw e;
    }
}

/**
 * Calls the cloud function 'validateTeamInvitation' that validates the invitation code.
 * If it is a valid code and meant to be for the authenticated user, then it will add
 * the user to the team.
 */
export async function validateTeamInvitation(code: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
            functions,
            "validateTeamInvitation"
        );
        const { data } = await fn({ code });
        return data;
    } catch (e) {
        await handleError(e as Error, "validate_team_invitation_error");
        throw e;
    }
}
