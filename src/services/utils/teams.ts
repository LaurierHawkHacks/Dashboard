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
        if (data.status === 200) {
            return data.data;
        }
    } catch (e) {
        await handleError(e as Error, "get_team_error");
        throw e;
    }

    return null;
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
export async function createTeam(teamName: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<TeamData>>(
            functions,
            "createTeam"
        );
        const { data } = await fn({ teamName });
        return data;
    } catch (e) {
        await handleError(e as Error, "create_team_erro");
        throw e;
    }
}
