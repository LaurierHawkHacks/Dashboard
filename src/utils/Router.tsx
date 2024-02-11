import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Placeholder,
    AdminPage,
    AdminLoginPage,
    UserPage,
    UserLoginPage,
} from "@pages";
import { ProtectedRoutes } from "@utils";

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Placeholder />} />

            <Route path="/admin" element={<ProtectedRoutes />}>
                <Route path="" element={<AdminPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route path="/user" element={<ProtectedRoutes />}>
                <Route path="" element={<UserPage />} />
            </Route>
            <Route path="/user/login" element={<UserLoginPage />} />
        </Routes>
    </BrowserRouter>
);

export { Router };
