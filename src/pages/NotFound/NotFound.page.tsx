import { Button } from "@components";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't seem to exist.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
    );
};
