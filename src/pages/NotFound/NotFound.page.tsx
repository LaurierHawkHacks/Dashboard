import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>{"The page you're looking for doesn't seem to exist."}</p>
            <Link to="/" className="button">
                Go Home
            </Link>
        </div>
    );
};
