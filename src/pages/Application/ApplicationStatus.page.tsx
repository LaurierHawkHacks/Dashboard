import { ApplicationData } from "@/components/forms/types";
import { routes } from "@/navigation/constants";
import { useAuth } from "@/providers/auth.provider";
import { getUserApplications } from "@/services/utils";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const ApplicationStatusPage = () => {
    const [apps, setApps] = useState<ApplicationData[]>([]);
    const { currentUser } = useAuth();

    if (!currentUser) return <Navigate to={routes.login} />;

    useEffect(() => {
        const getApps = async () => {
            setApps(await getUserApplications(currentUser.uid));
        };
        getApps();
    }, []);

    return <div>status</div>;
};
