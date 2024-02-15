import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Placeholder, LoginPage, AdminPage } from "@pages";
import { ProtectedRoutes } from "@utils";

const routes = {
    landing: "/",
    admin: "/admin",
    adminLogn: "/admin/login",
    notFound: "/not-found",
    login: "/login",
};

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path={routes.landing} element={<Placeholder />} />
            <Route path={routes.admin} element={<ProtectedRoutes adminOnly />}>
                <Route path="" element={<AdminPage />} />
            </Route>
            <Route path={routes.login} element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
);

export { Router, routes };
