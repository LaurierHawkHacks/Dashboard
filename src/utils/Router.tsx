import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Placeholder, LoginPage, AdminPage } from "@pages";
import { RequireAuth } from "@utils"; // maybe need to fix the path

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Placeholder />} />
            <Route
                path="/admin"
                element={
                    <RequireAuth>
                        <AdminPage />
                    </RequireAuth>
                }
            />
            <Route path="/admin/login" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
);

export { Router };
