import { Button } from "@/components";
import { getButtonStyles } from "@/components/Button/Button.styles";
import { routes } from "@/navigation/constants";
import { useAuth } from "@/providers/auth.provider";
import { Link } from "react-router-dom";

const UserPage = () => {
    const { userApp } = useAuth();

    return (
        <>
            <div>
                {userApp ? (
                    <Button disabled={!!userApp}>Apply to HawkHacks!</Button>
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
