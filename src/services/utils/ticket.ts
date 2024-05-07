import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";
import { CloudFunctionResponse, ExtendedTicketData, TicketData } from "./types";
import { handleError } from ".";

export async function getTicketData(id: string) {
    try {
        const fn = httpsCallable<unknown, CloudFunctionResponse<TicketData>>(
            functions,
            "getTicketData"
        );
        const { data } = await fn({ id });
        return data;
    } catch (e) {
        await handleError(e as Error, "get_ticket_data_error");
        throw e;
    }
}

// admin view of the ticket
// includes information about the food/events the hacker has been to
export async function getExtendedTicketData(id: string) {
    try {
        const fn = httpsCallable<
            unknown,
            CloudFunctionResponse<ExtendedTicketData>
        >(functions, "getExtendedTicketData");
        const { data } = await fn({ id });
        return data;
    } catch (e) {
        await handleError(e as Error, "get_extended_ticket_data_error");
        throw e;
    }
}
