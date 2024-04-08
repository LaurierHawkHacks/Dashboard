import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    AdminPage,
    UserPage,
    LoginPage,
    NotFoundPage,
    VerifyEmailPage,
    ApplicationPage,
} from "@pages";
import { ProtectedRoutes } from "@/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/auth.provider";
import { LoadingAnimation } from "@/components";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";

export const routes = {
    admin: "/admin",
    notFound: "/not-found",
    login: "/login",
    portal: "/",
    profile: "/profile",
    verifyEmail: "/verify-email",
    completeProfile: "/complete-profile",
    schedule: "/schedule",
    networking: "/networking",
    ticket: "/ticket",
    application: "/application",
    submitted: "/submitted",
    verifyRSVP: "/verify-rsvp",
};

interface Title {
    main: string;
    sub: string;
}

export const titles: Record<string, Title> = {
    [routes.portal]: {
        main: "Application", // TODO: change this when applications closes and we are ready to allow users to use all features
        sub: "The dashboard for all your needs.",
    },
    [routes.profile]: {
        main: "Application", // TODO: here too
        sub: "The dashboard for all your needs.",
    },
    [routes.schedule]: {
        main: "Schedule",
        sub: "View the schedule for the weekend!",
    },
    [routes.networking]: {
        main: "Networking",
        sub: "A quick way to connect with new people at HawkHacks!",
    },
    [routes.application]: {
        main: "Application",
        sub: "Apply to participate in the hackathon now!",
    },
    [routes.completeProfile]: {
        main: "Complete Profile",
        sub: "Enter your profile information.",
    },
    [routes.verifyEmail]: {
        main: "Verify Your Email",
        sub: "Please check your email inbox.",
    },
    [routes.ticket]: {
        main: "Ticket",
        sub: "This is your ticket for the event and will be needed to register (a.k.a., check in) at HawkHacks 2023. Please press \"View my ticket\" then use the buttons below to add this ticket to your mobile wallet or take a screenshot of the ticket page. Registration begins at 5:30 PM local time near the Main Tent in Wilfrid Laurier University's Laz Building.\n\n If you have any questions, please contact info@hawkhacks.ca.",
    },
};

export const Router = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [availableRoutes, setAvailableRoutes] = useState<
        { path: string; element: JSX.Element }[]
    >([
        { path: routes.application, element: <ApplicationPage /> },
        { path: routes.verifyEmail, element: <VerifyEmailPage /> },
        { path: routes.submitted, element: <PostSubmissionPage /> },
    ]);
    const { userApp, currentUser } = useAuth();

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 1500);
        if (userApp === undefined) return;

        if (userApp && userApp.applicationStatus === "accepted") {
            setAvailableRoutes([
                {
                    path: routes.networking,
                    element: <div>network</div>,
                },
                {
                    path: routes.schedule,
                    element: <div>schedule</div>,
                },
            ]);
        }
    }, [userApp]);

    useEffect(() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 1500);
        if (!currentUser) return;

        if (
            userApp?.applicationStatus === "accepted" &&
            !currentUser.rsvpVerified
        ) {
            setAvailableRoutes([
                {
                    path: routes.verifyRSVP,
                    element: <VerifyRSVP />,
                },
            ]);
        }
    }, [currentUser]);

    if (isLoading) return <LoadingAnimation />;

    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.login} element={<LoginPage />} />

                {/* User Routes */}
                <Route path={routes.portal} element={<ProtectedRoutes />}>
                    {currentUser && currentUser.rsvpVerified && (
                        <>
                            <Route
                                index
                                path={routes.portal}
                                element={<UserPage />}
                            />
                            <Route
                                index
                                path={routes.profile}
                                element={<UserPage />}
                            />
                        </>
                    )}
                    {availableRoutes.map((r) => (
                        <Route key={r.path} path={r.path} element={r.element} />
                    ))}

                    {/* Ticket Route here for now for dev purposes */}
                    <Route index path={routes.ticket} element={<UserPage />} />
                </Route>

                {/* Admin Routes */}
                <Route
                    path={routes.admin}
                    element={<ProtectedRoutes adminOnly />}
                >
                    <Route path="" element={<AdminPage />} />
                </Route>

                {/* Catch-all route for 404 Page Not Found */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};
