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
    AdminPage,
    ApplicationPage,
    LoginPage,
    NotFoundPage,
    UserPage,
    VerifyEmailPage,
} from "@/pages";
import { type RouteObject } from "react-router-dom";
import { useAuth } from "./auth.provider";
import { ProtectedRoutes } from "@/navigation";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";

interface PathObject {
    admin: string;
    notFound: string;
    login: string;
    portal: string;
    verifyEmail: string;
    schedule: string;
    networking: string;
    ticket: string;
    application: string;
    submitted: string;
    verifyRSVP: string;
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
    admin: "/admin",
    notFound: "*",
    login: "/login",
    portal: "/",
    verifyEmail: "/verify-email",
    schedule: "/schedule",
    networking: "/networking",
    ticket: "/ticket",
    application: "/application",
    submitted: "/submitted",
    verifyRSVP: "/verify-rsvp",
};

const titles: Record<string, Title> = {
    [paths.portal]: {
        main: "Home",
        sub: "The dashboard for all your needs.",
    },
    [paths.schedule]: {
        main: "Schedule",
        sub: "View the schedule for the weekend!",
    },
    [paths.networking]: {
        main: "Networking",
        sub: "A quick way to connect with new people at HawkHacks!",
    },
    [paths.application]: {
        main: "Application",
        sub: "Apply to participate in the hackathon now!",
    },
    [paths.verifyEmail]: {
        main: "Verify Your Email",
        sub: "Please check your email inbox.",
    },
    [paths.verifyRSVP]: {
        main: "Verify Your RSVP",
        sub: "All checkboxes are required.",
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
 * Routes provider that controls what routes are availbale and should be rendered by the React Router Dom and the Navbar
 */
export const RoutesProvider: FC<ComponentProps> = ({ children }) => {
    // all routes the router needs to render
    const [routes, setRoutes] = useState<RouteObject[]>([]);
    // all routes that navbar needs to render
    const [userRoutes, setUserRoutes] = useState<RouteObject[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const timeoutRef = useRef<number | null>(null);
    const { currentUser, userApp } = useAuth();

    useEffect(() => {
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
                {
                    path: paths.application,
                    element: <ApplicationPage />,
                },
                {
                    path: paths.verifyEmail,
                    element: <VerifyEmailPage />,
                },
                {
                    path: paths.submitted,
                    element: <PostSubmissionPage />,
                },
            ],
        };

        const availableRoutes: RouteObject[] = [
            {
                path: paths.login,
                element: <LoginPage />,
            },
            {
                path: paths.notFound,
                element: <NotFoundPage />,
            },
            userRoutes,
        ];
        if (!currentUser) {
            setUserRoutes(userRoutes.children);
            setRoutes(availableRoutes);
            return cleanUp;
        }

        if (currentUser.hawkAdmin) {
            // add admin route
            availableRoutes.push({
                path: paths.admin,
                element: <ProtectedRoutes adminOnly />,
                children: [
                    {
                        path: paths.admin,
                        element: <AdminPage />,
                    },
                ],
            });
            // enable all routes
            userRoutes.children.push(
                {
                    path: paths.networking,
                    element: <div>networking</div>,
                },
                { path: paths.schedule, element: <div>schedule</div> },
                { path: paths.ticket, element: <div>ticket</div> }
            );
            setUserRoutes(userRoutes.children);
            setRoutes(availableRoutes);
            return cleanUp;
        }

        if (userApp && userApp.accepted && !currentUser.rsvpVerified) {
            userRoutes.children = [
                {
                    path: paths.verifyRSVP,
                    element: <VerifyRSVP />,
                },
            ];
            setUserRoutes(userRoutes.children);
            setRoutes(availableRoutes);
            return cleanUp;
        }

        if (userApp && userApp.accepted && currentUser.rsvpVerified) {
            // enable all routes
            userRoutes.children = [
                {
                    index: true,
                    path: paths.portal,
                    element: <UserPage />,
                },
                {
                    path: paths.networking,
                    element: <div>networking</div>,
                },
                { path: paths.schedule, element: <div>schedule</div> },
                { path: paths.ticket, element: <div>ticket</div> },
            ];
            setUserRoutes(userRoutes.children);
            setRoutes(availableRoutes);
            return cleanUp;
        }

        // only default routes
        setUserRoutes(userRoutes.children);
        setRoutes(availableRoutes);

        return cleanUp;
    }, [refresh, currentUser, userApp]);

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
