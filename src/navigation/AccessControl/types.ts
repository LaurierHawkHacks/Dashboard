import type { ApplicationData } from "@/components/forms/types";
import type { UserWithClaims } from "@/providers";
import type { HackathonDates } from "@/services/firebase/hackathon";

/**
 * Context object provided to access control functions
 * Contains current user and their application data
 */
export interface AccessControlContext {
	user: UserWithClaims | null;
	applications: ApplicationData[];
	hackathonDates: HackathonDates | null;
}

/**
 * Function type for access control checks
 * Returns true if access should be granted, false if it should be denied
 */
export type AccessControlFn = (context: AccessControlContext) => boolean;

/**
 * Props for AccessControl component
 * @property redirectTo - Path to redirect to if access check fails
 * @property accessCheck - Single function or array of functions to determine if access should be granted
 */
export interface AccessControlProps {
	redirectTo?: string;
	accessCheck?: AccessControlFn | AccessControlFn[];
}
