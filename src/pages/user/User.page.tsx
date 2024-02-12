import { Button } from "@components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@providers";

const UserPage = () => {
    const authProvider = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        authProvider.logout();
        navigate("/user/login", { replace: true });
    };

    return (
        <div>
            <h1>Welcome to user page!!!</h1>
            <Button onClick={handleLogout}>Sign out</Button>
        </div>
    );
};

export { UserPage };
