import { useAuth } from "@providers";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { routes } from "@utils";

export interface ProtectedRoutesProps {
    /**
     * Controls the route group to be accessible for admin only
     * @default false
     */
    adminOnly?: boolean;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
    adminOnly = false,
}) => {
    const session = useAuth();
    const location = useLocation();

    if (!session.currentUser) {
        return <Navigate to={adminOnly ? routes.notFound : routes.login} />;
    }

    if (
        !session.currentUser.emailVerified &&
        location.pathname !== routes.verifyEmail
    ) {
        // redirect user to complete email verification
        // avoid spam users/bot or fake clients
        return <Navigate to={routes.verifyEmail} />;
    }

    if (adminOnly && !session.currentUser.hawkAdmin) {
        // redirect to not found page if user is not authorized to view
        return <Navigate to={routes.notFound} />;
    }

    return <Outlet />;
};
