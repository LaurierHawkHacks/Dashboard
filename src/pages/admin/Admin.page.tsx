import { Button } from "@components";
import { useAuth } from "@providers";

export const AdminPage = () => {
    const { logout } = useAuth();

    return (
        <div>
            <h1>Welcome to admin page!!!</h1>
            <Button onClick={logout}>Sign out</Button>
        </div>
    );
};
