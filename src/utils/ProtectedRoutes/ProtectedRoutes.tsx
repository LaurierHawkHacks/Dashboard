import { useAuth } from "@providers";
import { Outlet, Navigate } from "react-router-dom";
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

    if (!session.currentUser) {
        return <Navigate to={adminOnly ? routes.notFound : routes.login} />;
    }

    if (adminOnly && !session.currentUser.hawkAdmin) {
        // redirect to not found page if user is not authorized to view
        return <Navigate to={routes.notFound} />;
    }

    return <Outlet />;
};
