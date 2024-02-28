import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminPage, UserPage, LoginPage } from "@pages";
import { ProtectedRoutes } from "@utils";

const routes = {
    admin: "/admin",
    notFound: "/not-found",
    login: "/login",
    portal: "/",
    profile: "/me",
};

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path={routes.login} element={<LoginPage />} />

            {/* User Routes */}
            <Route path={routes.portal} element={<ProtectedRoutes />}>
                <Route path={routes.profile} element={<UserPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path={routes.admin} element={<ProtectedRoutes adminOnly />}>
                <Route path="" element={<AdminPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export { Router, routes };
