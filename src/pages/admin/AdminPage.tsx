import { Button } from "@components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@providers";

export const AdminPage = () => {
    const authProvider = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        authProvider.logout();
        navigate("/admin/login", { replace: true });
    };

    return (
        <div>
            <h1>Welcome to admin page!!!</h1>
            <Button onClick={handleLogout}>Sign out</Button>
        </div>
    );
};
