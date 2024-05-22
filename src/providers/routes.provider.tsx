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
    // AdminPage,
    // LoginPage,
    // NetworkingPage,
    NotFoundPage,
    // TicketPage,
    // HomePage,
    // VerifyEmailPage,
    UserPage,
    // SchedulePage,
    // PerksPage,
} from "@/pages";
import { type RouteObject } from "react-router-dom";
import { useAuth } from "./auth.provider";
import { ProtectedRoutes } from "@/navigation";
// import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
// import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";
// import { MyTeamPage } from "@/pages/MyTeam.page";
// import { ViewTicketPage } from "@/pages/miscellaneous/ViewTicket.page";
// import { JoinTeamPage } from "@/pages/JoinTeam.page";
// import { AdminViewTicketPage } from "@/pages/admin/ViewTicket.page";
// import { AdminManageEventsPage } from "@/pages/admin/ManageEvents.page";

interface PathObject {
    // admin: string;
    // adminViewTicket: string;
    // adminManageEvents: string;
    notFound: string;
    // login: string;
    portal: string;
    // verifyEmail: string;
    // schedule: string;
    // networking: string;
    // myTicket: string;
    // application: string;
    // submitted: string;
    // verifyRSVP: string;
    // myTeam: string;
    // joinTeam: string;
    // myApp: string;
    // ticket: string;
    // perks: string;
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
    // admin: "/admin",
    // adminViewTicket: "/admin/ticket/:ticketId",
    // adminManageEvents: "/admin/manage",
    notFound: "*",
    // login: "/login",
    portal: "/",
    // verifyEmail: "/verify-email",
    // schedule: "/schedule",
    // networking: "/networking",
    // myTicket: "/my-ticket",
    // application: "/application",
    // submitted: "/submitted",
    // verifyRSVP: "/verify-rsvp",
    // myTeam: "/my-team",
    // joinTeam: "/join-team",
    // myApp: "/my-application",
    // ticket: "/ticket/:ticketId",
    // perks: "/perks",
};

const titles: Record<string, Title> = {
    [paths.portal]: {
        main: "User",
        sub: "Welcome to your user dashboard.",
    },
    // [paths.schedule]: {
    //     main: "Schedule",
    //     sub: "View the schedule for the weekend!",
    // },
    // [paths.networking]: {
    //     main: "Networking",
    //     sub: "A quick way to connect with new people at HawkHacks!",
    // },
    // [paths.application]: {
    //     main: "Application",
    //     sub: "Apply to participate in the hackathon now!",
    // },
    // [paths.verifyEmail]: {
    //     main: "Verify Your Email",
    //     sub: "Please check your email inbox.",
    // },
    // [paths.verifyRSVP]: {
    //     main: "Verify Your RSVP",
    //     sub: "All checkboxes are required.",
    // },
    // [paths.myTicket]: {
    //     main: "Ticket",
    //     sub: "This ticket is required for registration at our HawkHacks sign-in desk.\nKeep this ticket safe - download or add it to your wallet for convenience!",
    // },
    // [paths.myTeam]: {
    //     main: "My Team",
    //     sub: "Create your dream team! Add, manage, and view your teammates.",
    // },
    // [paths.joinTeam]: {
    //     main: "Join Team",
    //     sub: "Awesome, it looks like you have found teammates!",
    // },
    // [paths.ticket]: {
    //     main: "View Ticket",
    //     sub: "Some good thing here",
    // },
    // [paths.perks]: {
    //     main: "Perks",
    //     sub: "Explore the amazing perks available at HawkHacks!",
    // },
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
