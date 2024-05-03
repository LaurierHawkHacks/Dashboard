import { Button } from "@/components";
import { getButtonStyles } from "@/components/Button/Button.styles";
import { routes } from "@/navigation/constants";
import { useAuth } from "@/providers/auth.provider";
import { Link } from "react-router-dom";
import { isAfter } from "date-fns";
import { useEffect, useState } from "react";
import { InfoCallout } from "@/components/InfoCallout/InfoCallout";
import { appCloseDate } from "@/data/appCloseDate";
import { Application } from "@/components/Application";

const UserPage = () => {
    const [showInfo, setShowInfo] = useState(false);
    const { userApp } = useAuth();

    useEffect(() => {
        const today = new Date();
        setShowInfo(isAfter(today, new Date(appCloseDate)));
    }, []);

    return (
        <>
            <div className="items-center gap-8 space-y-4 mb-4">
                <h3 className="text-md md:text-2xl font-bold">
                    My Application
                </h3>
                {!userApp && !showInfo && (
                    <div className="w-fit">
                        <InfoCallout text="It seems like you haven't submitted an application yet." />
                    </div>
                )}
                {showInfo && (
                    <div className="w-fit mb-4">
                        <InfoCallout text="Applications have now closed for HawkHacks 2024." />
                    </div>
                )}
                <div className="flex gap-4">
                    {userApp || showInfo ? (
                        <Button disabled={!!userApp || showInfo}>
                            {showInfo ? "Applications Closed" : "Submitted"}
                        </Button>
                    ) : (
                        <Link
                            to={routes.application}
                            className={getButtonStyles({
                                intent: "primary",
                                className: "block w-fit",
                            })}
                        >
                            Apply To HawkHacks!
                        </Link>
                    )}
                    {userApp && !showInfo && (
                        <Link
                            to={routes.application}
                            className={getButtonStyles({
                                intent: "primary",
                                className: "block w-fit",
                            })}
                        >
                            Edit/View Submission
                        </Link>
                    )}
                </div>
            </div>
            {userApp && !showInfo && (
                <p className="my-4">
                    {"Didn't like your submission? "}
                    <Link
                        to={`${routes.application}?restart=true`}
                        className="font-medium text-sky-600 underline"
                    >
                        Start a new application here.
                    </Link>
                </p>
            )}
            {userApp && <Application app={userApp} />}
        </>
    );
};

export { UserPage };
