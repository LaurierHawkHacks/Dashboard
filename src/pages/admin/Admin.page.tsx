import { useAvailableRoutes } from "@/providers/routes.provider";
import { Link } from "react-router-dom";

export const AdminPage = () => {
    const { paths } = useAvailableRoutes();
    return (
        <div>
            <h1>Welcome to admin page!!!</h1>

            <ul>
                <li>
                    <Link
                        to={paths.adminManageEvents}
                        className="text-sky-500 underline"
                    >
                        Manage Events/Foods
                    </Link>
                </li>
            </ul>
        </div>
    );
};
