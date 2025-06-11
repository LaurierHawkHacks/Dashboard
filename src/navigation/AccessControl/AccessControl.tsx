import { useApplications } from "@/hooks/use-applications";
import { useHackathonDates } from "@/hooks/use-hackathon-dates";
import { useUser } from "@/providers";
import { type FC, useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { AccessControlProps } from "./types";
/**
 * AccessControl component provides route protection based on user authentication and authorization.
 * It acts as a wrapper for routes that need access control, managing both authentication checks
 * and conditional page wrapping.
 *
 * @param accessCheck - Function or array of functions that determine if user has access to the route.
 *                      If an array is provided, all functions must return true for access to be granted.
 * @param redirectTo - Path to redirect to if access check fails
 * @param withPageWrapper - Whether to wrap the route content in a PageWrapper component
 */
export const AccessControl: FC<AccessControlProps> = ({
	accessCheck,
	redirectTo,
}) => {
	// Get current user and application data from context
	const { user } = useUser();
	const { applications } = useApplications();
	const { hackathonDates } = useHackathonDates();
	const canAccess = useMemo(() => {
		// If no access check is provided, allow access
		if (typeof accessCheck === "undefined") {
			return true;
		}

		// If a single function is provided, use it
		if (typeof accessCheck === "function") {
			return accessCheck({ user, applications,hackathonDates });
		}

		// If an array of functions is provided, all must pass
		return accessCheck.every((check) => check({ user, applications, hackathonDates }));
	}, [user, applications, accessCheck]);

	// Check if user meets access requirements, redirect if they don't
	if (!canAccess) {
		return <Navigate to={redirectTo ?? "/not-found"} />;
	}

	return <Outlet />;
};
