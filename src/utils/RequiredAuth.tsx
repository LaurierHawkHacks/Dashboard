import { useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
    const auth = useAuth();

    if (!auth.currentUser) {
        return <Navigate to="/admin/login" />;
    }

    return children;
};
