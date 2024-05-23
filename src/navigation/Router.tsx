import { BrowserRouter, useRoutes } from "react-router-dom";
import { LoadingAnimation } from "@/components";
import { useAvailableRoutes } from "@/providers/routes.provider";
// import { useAuth } from "@/providers/auth.provider";
// import { useEffect } from "react";

const InnerRouter = () => {
    const { routes, loadingRoutes } = useAvailableRoutes();
    // const { currentUser, userApp } = useAuth();
    const availableRoutes = useRoutes(routes);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!currentUser) return;
    //
    //     if (
    //         currentUser.type === "hacker" &&
    //         userApp &&
    //         userApp.accepted &&
    //         !currentUser.rsvpVerified
    //     ) {
    //         navigate(paths.verifyRSVP);
    //     }
    // }, [currentUser, userApp]);

    if (loadingRoutes) return <LoadingAnimation />;

    return availableRoutes;
};

export const Router = () => {
    return (
        <BrowserRouter>
            <InnerRouter />
        </BrowserRouter>
    );
};
