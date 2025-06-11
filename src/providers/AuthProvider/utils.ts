import {
	type AuthProvider as FirebaseAuthProvider,
	GithubAuthProvider,
	GoogleAuthProvider,
	OAuthProvider,
	type User,
} from "firebase/auth";
import type { ProviderName, UserRole, UserWithClaims } from "./types";

/**
 * Validates given user for admin authorization.
 * Return object adds `hawkAdmin` boolean field.
 */
export async function validateUser(user: User): Promise<UserWithClaims> {
	const { claims } = await user.getIdTokenResult(true);
	return {
		...user,
		hawkAdmin: Boolean(claims.admin),
		phoneVerified: Boolean(claims.phoneVerified),
		rsvpVerified: Boolean(claims.rsvpVerified),
		type: (claims?.type as UserRole) ?? "hacker",
	};
}

export function getProvider(provider: ProviderName): FirebaseAuthProvider {
	switch (provider) {
		case "google":
			return new GoogleAuthProvider();
		case "github":
			return new GithubAuthProvider();
		case "apple":
			return new OAuthProvider("apple.com");
		default:
			throw new Error("Unsupported provider");
	}
}

export function getNotificationByAuthErrCode(code: string) {
	switch (code) {
		case "auth/email-already-in-use":
			return {
				title: "Email In Use",
				description:
					"If you forgot your password, click on 'forgot password' to recover it!",
			};
		case "auth/invalid-login-credentials":
			return {
				title: "Invalid Credentials",
				description:
					"Please make sure you have the correct credentials and try again.",
			};
		case "auth/popup-blocked":
			return {
				title: "Login Blocked",
				description:
					"Popup windows are blocked. Please allow them in your browser settings to continue.",
			};
		default:
			return {
				title: "Oops! Something went wrong",
				description: "Please try again later.",
			};
	}
}

export function isMobile() {
	const regex =
		/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
	return regex.test(navigator.userAgent);
}
