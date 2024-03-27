import { Button } from "@components";
import { useAuth } from "@providers";
import { Navbar } from "@components";

const UserPage = () => {
    const { logout } = useAuth();

    return (
        <>
            <Navbar />
            <div>
                <h1>Welcome to user page!!!</h1>
                <Button onClick={logout}>Sign out</Button>
            </div>
        </>
    );
};

export { UserPage };
