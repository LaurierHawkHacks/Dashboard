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

const routes = {
    admin: "/admin",
    notFound: "/not-found",
    login: "/login",
    portal: "/",
    profile: "/profile",
    verifyEmail: "/verify-email",
    completeProfile: "/complete-profile",
};

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path={routes.login} element={<LoginPage />} />

            {/* User Routes */}
            <Route path={routes.portal} element={<ProtectedRoutes />}>
                <Route path={routes.profile} element={<UserPage />} />
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

export { Router, routes };
