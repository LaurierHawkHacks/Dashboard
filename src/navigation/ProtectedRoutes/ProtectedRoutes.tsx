import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/hooks";
import { PageWrapper } from "@components";
import { useAvailableRoutes } from "@/providers/routes.provider";

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
    const location = useLocation();
    const session = useAuth();
    const { paths: routes } = useAvailableRoutes();

    // console.log(available);

    if (!session.currentUser) {
        return (
            <Navigate
                to={
                    adminOnly
                        ? "/not-found"
                        : routes.login + `?from=${location.pathname}`
                }
            />
        );
    }

    if (!session.currentUser.hawkAdmin && !session.currentUser.emailVerified) {
        if (location.pathname !== routes.verifyEmail) {
            // redirect user to complete email verification
            // avoid spam users/bot or fake clients
            return <Navigate to={routes.verifyEmail} />;
        } else {
            return (
                <PageWrapper>
                    <Outlet />
                </PageWrapper>
            );
        }
    }

    if (
        adminOnly &&
        ((location.pathname.startsWith("/admin/ticket") &&
            session.currentUser.type === "volunteer" &&
            session.currentUser.rsvpVerified) ||
            !session.currentUser.hawkAdmin)
    ) {
        // redirect to not found page if user is not authorized to view
        return <Navigate to={routes.notFound} />;
    }

    // don't want the page wrapper for this page
    if (location.pathname === routes.submitted) {
        return <Outlet />;
    }

    // redirect to verify their rsvp if not verified
    if (
        location.pathname !== routes.verifyRSVP &&
        !session.currentUser.hawkAdmin &&
        session.userApp?.accepted &&
        session.currentUser?.type === "hacker" &&
        !session.currentUser.rsvpVerified
    ) {
        return <Navigate to={routes.verifyRSVP} />;
    }

    if (location.pathname.startsWith("/join-team")) {
        return <Outlet />;
    }

    return (
        <PageWrapper>
            <Outlet />
        </PageWrapper>
    );
};
