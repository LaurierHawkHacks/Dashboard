import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "@/pages/admin/LoginPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { RequireAuth } from "./RequiredAuth";

const routerConfig = createBrowserRouter([
    {
        path: "/admin/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        element: (
            <RequireAuth>
                <AdminPage />
            </RequireAuth>
        ),
    },
]);

const Router = () => {
    return <RouterProvider router={routerConfig} />;
};

export default Router;
