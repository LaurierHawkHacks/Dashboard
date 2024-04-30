import { Button } from "@/components";
import { getButtonStyles } from "@/components/Button/Button.styles";
import { useAuth } from "@/providers/auth.provider";
import { useAvailableRoutes } from "@/providers/routes.provider";
import { Link } from "react-router-dom";

const UserPage = () => {
    const { userApp } = useAuth();
    const { paths: routes } = useAvailableRoutes();

    return (
        <>
            <h3 className="text-md md:text-2xl font-bold">My Application</h3>
            <div className="mt-4">
                {userApp ? (
                    <Button disabled={!!userApp}>Submitted</Button>
                ) : (
                    <Link
                        to={routes.application}
                        className={getButtonStyles({ intent: "primary" })}
                    >
                        Apply To HawkHacks!
                    </Link>
                )}
            </div>
            {userApp && (
                <p className="mt-4">
                    Had issues with your application?{" "}
                    <Link
                        to={routes.application}
                        className="font-medium text-sky-600 underline"
                    >
                        Resubmit one here.
                    </Link>
                </p>
            )}
        </>
    );
};

export { UserPage };
