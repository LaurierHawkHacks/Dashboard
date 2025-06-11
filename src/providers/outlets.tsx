import { LoadingAnimation } from "@/components";
import { paths } from "@/data/paths";
import { useAuth } from "@/providers";
import { Navigate, Outlet } from "react-router-dom";

export function LoggedInUserOutlet() {
	const { isLoading, currentUser } = useAuth();

	if (isLoading) {
		return <LoadingAnimation />;
	}

	if (!currentUser) {
		return <Navigate to={paths.login} replace />;
	}

	if (!currentUser.emailVerified) {
		return <Navigate to={paths.verifyEmail} replace />;
	}

	return <Outlet />;
}
