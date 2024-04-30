import { BrowserRouter, useRoutes } from "react-router-dom";
import { LoadingAnimation } from "@/components";
import { useAvailableRoutes } from "@/providers/routes.provider";

const InnerRouter = () => {
    const { routes } = useAvailableRoutes();
    const availableRoutes = useRoutes(routes);
    return availableRoutes;
};

export const Router = () => {
    const { loadingRoutes } = useAvailableRoutes();

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
