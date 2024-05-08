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
    LoginPage,
    NetworkingPage,
    NotFoundPage,
    TicketPage,
    HomePage,
    VerifyEmailPage,
    UserPage,
} from "@/pages";
import { type RouteObject } from "react-router-dom";
import { useAuth } from "./auth.provider";
import { ProtectedRoutes } from "@/navigation";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";
import { MyTeamPage } from "@/pages/MyTeam.page";
import { ViewTicketPage } from "@/pages/miscellaneous/ViewTicket.page";
import { JoinTeamPage } from "@/pages/JoinTeam.page";
import { AdminViewTicketPage } from "@/pages/admin/ViewTicket.page";
import { AdminManageEventsPage } from "@/pages/admin/ManageEvents.page";

interface PathObject {
    admin: string;
    adminViewTicket: string;
    adminManageEvents: string;
    notFound: string;
    login: string;
    portal: string;
    verifyEmail: string;
    schedule: string;
    networking: string;
    myTicket: string;
    application: string;
    submitted: string;
    verifyRSVP: string;
    myTeam: string;
    joinTeam: string;
    myApp: string;
    ticket: string;
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
    adminViewTicket: "/admin/ticket/:ticketId",
    adminManageEvents: "/admin/manage",
    notFound: "*",
    login: "/login",
    portal: "/",
    verifyEmail: "/verify-email",
    schedule: "/schedule",
    networking: "/networking",
    myTicket: "/my-ticket",
    application: "/application",
    submitted: "/submitted",
    verifyRSVP: "/verify-rsvp",
    myTeam: "/my-team",
    joinTeam: "/join-team",
    myApp: "/my-application",
    ticket: "/ticket/:ticketId",
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
    [paths.myTicket]: {
        main: "Ticket",
        sub: "This ticket is required for registration at our HawkHacks sign-in desk.\nKeep this ticket safe - download or add it to your wallet for convenience!",
    },
    [paths.myTeam]: {
        main: "My Team",
        sub: "Create your dream team! Add, manage, and view your teammates.",
    },
    [paths.joinTeam]: {
        main: "Join Team",
        sub: "Awesome, it looks like you have found teammates!",
    },
    [paths.ticket]: {
        main: "View Ticket",
        sub: "Some good thing here",
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
                    element: <HomePage />,
                },
                {
                    path: paths.verifyEmail,
                    element: <VerifyEmailPage />,
                },
                {
                    path: paths.submitted,
                    element: <PostSubmissionPage />,
                },
                {
                    path: `${paths.joinTeam}/:invitationId`,
                    element: <JoinTeamPage />, // dummy placeholder
                },
            ],
        };

        const availableRoutes: RouteObject[] = [
            {
                path: paths.login,
                element: <LoginPage />,
            },
            {
                path: paths.ticket,
                element: <ViewTicketPage />,
            },
            {
                path: paths.notFound,
                element: <NotFoundPage />,
            },
            userRoutes,
        ];

        if (!currentUser || !currentUser.emailVerified) {
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
                    {
                        path: paths.adminViewTicket,
                        element: <AdminViewTicketPage />,
                    },
                    {
                        path: paths.adminManageEvents,
                        element: <AdminManageEventsPage />,
                    },
                ],
            });
            // enable all routes
            userRoutes.children.push(
                { path: paths.schedule, element: <div>schedule</div> },
                {
                    path: paths.networking,
                    element: <NetworkingPage />,
                },
                { path: paths.myTicket, element: <TicketPage /> },
                { path: paths.myTeam, element: <MyTeamPage /> }
            );

            setUserRoutes(userRoutes.children);
            setRoutes(availableRoutes);
            return cleanUp;
        }

        // type based
        if (currentUser.type === "hacker") {
            if (userApp && !userApp.accepted) {
                userRoutes.children = [
                    {
                        index: true,
                        path: paths.portal,
                        element: <UserPage />,
                    },
                ];
            }

            if (userApp && userApp.accepted && !currentUser.rsvpVerified) {
                userRoutes.children = [
                    {
                        path: paths.verifyRSVP,
                        element: <VerifyRSVP />,
                    },
                ];
            }

            if (userApp && userApp.accepted && currentUser.rsvpVerified) {
                userRoutes.children = [
                    {
                        index: true,
                        path: paths.portal,
                        element: <HomePage />,
                    },
                    { path: paths.schedule, element: <div>schedule</div> },
                    {
                        path: paths.networking,
                        element: <NetworkingPage />,
                    },
                    { path: paths.myTicket, element: <TicketPage /> },
                    { path: paths.myTeam, element: <MyTeamPage /> },
                    {
                        path: `${paths.joinTeam}/:invitationId`,
                        element: <JoinTeamPage />, // dummy placeholder
                    },
                ];
            }
        }

        if (
            currentUser.type === "speaker" ||
            currentUser.type === "sponsor" ||
            (currentUser.type === "mentor" && userApp && userApp.accepted) ||
            (currentUser.type === "volunteer" && userApp && userApp.accepted)
        ) {
            userRoutes.children = [
                {
                    index: true,
                    path: paths.portal,
                    element: <HomePage />,
                },
                { path: paths.schedule, element: <div>schedule</div> },
                {
                    path: paths.networking,
                    element: <NetworkingPage />,
                },
                { path: paths.myTicket, element: <TicketPage /> },
            ];
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
