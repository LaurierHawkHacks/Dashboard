import { useAuth } from "@providers";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoutes = () => {
    const auth = useAuth();

    if (!auth.currentUser) {
        return <Navigate to="/admin/login" />;
    }

    return <Outlet />;
};
