import type { User } from "firebase/auth";

export type UserRole =
	| "hacker"
	| "mentor"
	| "volunteer"
	| "volunteer.t1"
	| "volunteer.t2"
	| "speaker"
	| "sponsor"
	| "guest"
	| "admin"
	| "vip";

export interface UserWithClaims extends User {
	hawkAdmin: boolean;
	phoneVerified: boolean;
	rsvpVerified: boolean;
	type: UserRole;
}

export type ProviderName = "github" | "google" | "apple";

export type AuthMethod = "none" | "credentials" | ProviderName;

export type AuthContextValue = {
	isLoading: boolean;
	currentUser: UserWithClaims | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	createAccount: (email: string, password: string) => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	loginWithProvider: (name: ProviderName) => Promise<void>;
	reloadUser: () => Promise<void>;
};
