import {
	type CallableRequest,
	type CallableResponse,
	HttpsError,
	onCall,
} from "firebase-functions/https";
import { ZodError } from "zod";

type Handler = (
	req: CallableRequest<unknown>,
	res: CallableResponse<unknown> | undefined,
) => void;

/**
 * Wrapper for Firebase's onCall function with safer typing
 * and custom error handling.
 */
export function onCallCustom(handler: Handler) {
	return onCall((req, res) => {
		try {
			return handler(req, res);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new HttpsError("invalid-argument", error.message, {
					issues: error.issues,
				});
			}
			throw error;
		}
	});
}
