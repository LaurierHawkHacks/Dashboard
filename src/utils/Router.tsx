import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Placeholder, LoginPage, AdminPage } from "@pages";
import { ProtectedRoutes } from "@utils"; // maybe need to fix the path

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Placeholder />} />
            <Route path="/admin" element={<ProtectedRoutes />}>
                <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="/admin/login" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
);

export { Router };
