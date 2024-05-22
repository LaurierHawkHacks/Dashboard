import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type FC,
} from "react";
import type { ComponentProps } from "@/components/types";
import {
    UserPage,
    NotFoundPage,
} from "@/pages";
import { type RouteObject } from "react-router-dom";
import { useAuth } from "./auth.provider";
import { ProtectedRoutes } from "@/navigation";

interface PathObject {
    notFound: string;
    portal: string;
}

interface Title {
    main: string;
    sub: string;
}

interface RoutesContextValue {
    routes: RouteObject[];
    userRoutes: RouteObject[];
    paths: PathObject;
    titles: Record<string, Title>;
    loadingRoutes: boolean;
    refreshRoutes: () => void;
}

// this path object provides a common place to define route pathnames
const paths: PathObject = {
    notFound: "*",
    portal: "/",
};

const titles: Record<string, Title> = {
    [paths.portal]: {
        main: "User",
        sub: "Welcome to your user dashboard.",
    },
};

const RoutesContext = createContext<RoutesContextValue>({
    routes: [],
    userRoutes: [],
    paths,
    titles,
    loadingRoutes: true, // defaults to true, avoids rapid ui change
    refreshRoutes: () => {},
});

export function useAvailableRoutes() {
    return useContext(RoutesContext);
}

/**
 * Routes provider that controls what routes are available and should be rendered by the React Router Dom and the Navbar
 */
export const RoutesProvider: FC<ComponentProps> = ({ children }) => {
    // all routes the router needs to render
    const [routes, setRoutes] = useState<RouteObject[]>([]);
    // all routes that navbar needs to render
    const [userRoutes, setUserRoutes] = useState<RouteObject[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const timeoutRef = useRef<number | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        setLoadingRoutes(true);
        const cleanUp = () => {
            if (timeoutRef.current !== null)
                window.clearTimeout(timeoutRef.current);
        };

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(
            () => setLoadingRoutes(false),
            1500
        );

        const userRoutes = {
            path: paths.portal,
            element: <ProtectedRoutes />,
            children: [
                {
                    index: true,
                    path: paths.portal,
                    element: <UserPage />,
                },
            ],
        };

        const availableRoutes: RouteObject[] = [
            {
                path: paths.notFound,
                element: <NotFoundPage />,
            },
            userRoutes,
        ];

        setUserRoutes(userRoutes.children);
        setRoutes(availableRoutes);

        return cleanUp;
    }, [refresh, currentUser]);

    const refreshRoutes = () => setRefresh((r) => !r);

    return (
        <RoutesContext.Provider
            value={{
                routes,
                userRoutes,
                paths,
                titles,
                loadingRoutes,
                refreshRoutes,
            }}
        >
            {children}
        </RoutesContext.Provider>
    );
};
