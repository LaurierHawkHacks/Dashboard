import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import LoginPage from "@/pages/LoginPage";

const routerConfig = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace={true} />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        // Todo: user cannot directly go to this admin page
        element: <h1>Welcome to admin page!!!</h1>,
    },
    {
        path: "*",
        element: <Navigate to="/" />,
    },
]);

const Router = () => {
    return <RouterProvider router={routerConfig} />;
};

export default Router;
