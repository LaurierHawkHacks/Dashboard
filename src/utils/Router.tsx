import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import App from "@/App";

const routerConfig = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        element: <h1>Welcome to admin page!!!</h1>,
    },
]);

const Router = () => {
    return <RouterProvider router={routerConfig} />;
};

export default Router;
