import { functions } from "@/services/firebase";
import { handleError } from "@/services/utils";
import { httpsCallable } from "firebase/functions";
import { CloudFunctionResponse, TeamData } from "./types";

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
