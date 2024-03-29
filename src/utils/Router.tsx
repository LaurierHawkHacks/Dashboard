import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    AdminPage,
    UserPage,
    LoginPage,
    NotFoundPage,
    VerifyEmailPage,
    CompleteProfilePage,
} from "@pages";
import { ProtectedRoutes } from "@utils";

export const routes = {
    admin: "/admin",
    notFound: "/not-found",
    login: "/login",
    portal: "/",
    profile: "/profile",
    verifyEmail: "/verify-email",
    completeProfile: "/complete-profile",
    schedule: "/schedule",
    networking: "/networking",
    ticket: "/ticket",
    application: "/application",
};

interface Title {
    main: string;
    sub: string;
}

export const titles: Record<string, Title> = {
    [routes.profile]: {
        main: "Home",
        sub: "The dashboard for all your needs.",
    },
    [routes.schedule]: {
        main: "Schedule",
        sub: "View the schedule for the weekend!",
    },
    [routes.networking]: {
        main: "Networking",
        sub: "A quick way to connect with new people at HawkHacks!",
    },
    [routes.application]: {
        main: "Application",
        sub: "Apply to participate in the hackathon now!",
    },
    [routes.completeProfile]: {
        main: "Complete Profile",
        sub: "Enter your profile information.",
    },
    [routes.verifyEmail]: {
        main: "Verify Your Email",
        sub: "Please check your email inbox.",
    },
};

export const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path={routes.login} element={<LoginPage />} />

            {/* User Routes */}
            <Route path={routes.portal} element={<ProtectedRoutes />}>
                <Route index path={routes.profile} element={<UserPage />} />
                <Route
                    path={routes.verifyEmail}
                    element={<VerifyEmailPage />}
                />
                <Route
                    path={routes.completeProfile}
                    element={<CompleteProfilePage />}
                />
            </Route>

            {/* Admin Routes */}
            <Route path={routes.admin} element={<ProtectedRoutes adminOnly />}>
                <Route path="" element={<AdminPage />} />
            </Route>

            {/* Catch-all route for 404 Page Not Found */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
);
