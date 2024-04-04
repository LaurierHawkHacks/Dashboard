import { getButtonStyles } from "@/components/Button/Button.styles";
import { routes } from "@/navigation/constants";
import { Link } from "react-router-dom";

const UserPage = () => {
    return (
        <>
            <div>
                <Link
                    to={routes.application}
                    className={getButtonStyles({ intent: "primary" })}
                >
                    Apply To Hackathon!
                </Link>
            </div>
        </>
    );
};

export { UserPage };
