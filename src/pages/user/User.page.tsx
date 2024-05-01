import { getButtonStyles } from "@/components/Button/Button.styles";
import { useAvailableRoutes } from "@/providers/routes.provider";
import { Link } from "react-router-dom";

const UserPage = () => {
    const { paths: routes } = useAvailableRoutes();
    return (
        <>
            <div>
                <Link
                    to={routes.application}
                    className={getButtonStyles({ intent: "primary" })}
                >
                    Start your application To Hackathon!
                </Link>
            </div>
        </>
    );
};

export { UserPage };
