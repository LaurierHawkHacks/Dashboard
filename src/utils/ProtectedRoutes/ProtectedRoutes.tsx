import { useAuth } from "@providers";
import { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export const ProtectedRoutes = () => {
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        console.log(location);
    }, []);

    if (auth.currentUser) return <Outlet />;

    if (location.pathname === "/admin") {
        return <Navigate to="/admin/login" />;
    } else if (location.pathname === "/user") {
        return <Navigate to="/user/login" />;
    }
};
