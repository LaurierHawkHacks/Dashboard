import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Placeholder,
    AdminPage,
    AdminLoginPage,
    UserPage,
    UserLoginPage,
} from "@pages";
import { ProtectedRoutes } from "@utils";

const routes = {
    landing: "/",
    admin: "/admin",
    adminLogin: "/admin/login",
    notFound: "/not-found",
    login: "/login",
    portal: "/portal",
    profile: "/portal/me",
};

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path={routes.landing} element={<Placeholder />} />
            <Route path={routes.login} element={<UserLoginPage />} />

            {/* User Routes */}
            <Route path={routes.portal} element={<ProtectedRoutes />}>
                <Route path={routes.profile} element={<UserPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path={routes.admin} element={<ProtectedRoutes adminOnly />}>
                <Route path="" element={<AdminPage />} />
                <Route path={routes.adminLogin} element={<AdminLoginPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export { Router, routes };
