import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";

const routerConfig = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
]);

const Router = () => {
    return <RouterProvider router={routerConfig} />;
};

export default Router;
