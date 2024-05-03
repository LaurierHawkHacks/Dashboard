import { Button } from "@/components";
import { getButtonStyles } from "@/components/Button/Button.styles";
import { routes } from "@/navigation/constants";
import { useAuth } from "@/providers/auth.provider";
import { Link } from "react-router-dom";
import { isAfter } from "date-fns";
import { useEffect, useState } from "react";
import { InfoCallout } from "@/components/InfoCallout/InfoCallout";
import { appCloseDate } from "@/data/appCloseDate";

const UserPage = () => {
    const [showInfo, setShowInfo] = useState(false);
    const { userApp } = useAuth();

    useEffect(() => {
        const today = new Date();
        setShowInfo(isAfter(today, new Date(appCloseDate)));
    }, []);

    return (
        <>
            {showInfo && (
                <div className="w-fit mb-4">
                    <InfoCallout text="Applications have now closed for HawkHacks 2024." />
                </div>
            )}
            <h3 className="text-md md:text-2xl font-bold">My Application</h3>
            <div className="mt-4">
                {userApp || showInfo ? (
                    <Button disabled={!!userApp || showInfo}>
                        {showInfo ? "Applications Closed" : "Submitted"}
                    </Button>
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
