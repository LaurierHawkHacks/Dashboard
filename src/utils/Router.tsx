import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Placeholder, LoginPage, AdminPage } from "@pages";
import { ProtectedRoutes } from "@utils";

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Placeholder />} />
            <Route path="/admin" element={<ProtectedRoutes />}>
                <Route path="" element={<AdminPage />} />
            </Route>
            <Route path="/admin/login" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
);

export { Router };
