import { Button } from "@components";
import { useAuth } from "@providers";

export const AdminPage = () => {
    const session = useAuth();

    return (
        <div>
            <h1>Welcome to admin page!!!</h1>
            <Button onClick={session.logout}>Sign out</Button>
        </div>
    );
};
