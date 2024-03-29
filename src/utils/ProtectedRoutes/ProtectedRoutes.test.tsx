import { screen } from "@testing-library/react";
import { Routes, Route, Link } from "react-router-dom";
import { ProtectedRoutes, renderWithRouter, routes } from "@utils";
import { mockUseAuth } from "@mocks/providers";

vi.mock("@providers");

describe("ProctectedRoutes Component", () => {
    it("should render if user is authenticated, authorized and has a profile", () => {
        mockUseAuth.mockReturnValueOnce({
            currentUser: { emailVerified: true },
            userProfile: {},
        });
        renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route path="" element={<div data-testid="in-doc"></div>} />
                </Route>
                <Route
                    path={routes.login}
                    element={<div data-testid="login"></div>}
                />
            </Routes>
        );

        expect(screen.queryByTestId("login")).not.toBeInTheDocument();
        expect(screen.getByTestId("in-doc")).toBeInTheDocument();
    });

    it("should redirect to login page if user is not authenticated", () => {
        mockUseAuth.mockReturnValueOnce({ currentUser: null });
        renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route
                        path=""
                        element={<div data-testid="not-in-doc"></div>}
                    />
                </Route>
                <Route
                    path={routes.login}
                    element={<div data-testid="login"></div>}
                />
            </Routes>
        );

        expect(screen.getByTestId("login")).toBeInTheDocument();
        expect(screen.queryByTestId("not-in-doc")).not.toBeInTheDocument();
    });

    it("should redirect to not found page if user is not authenticated and authorized", () => {
        mockUseAuth.mockReturnValueOnce({ currentUser: null });
        renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes adminOnly />}>
                    <Route
                        path=""
                        element={<div data-testid="not-in-doc"></div>}
                    />
                </Route>
                <Route
                    path={routes.notFound}
                    element={<div data-testid="not-found"></div>}
                />
            </Routes>
        );

        expect(screen.getByTestId("not-found")).toBeInTheDocument();
        expect(screen.queryByTestId("not-in-doc")).not.toBeInTheDocument();
    });

    it("should redirect to not found page if not authorized to view", async () => {
        mockUseAuth.mockReturnValue({
            currentUser: { isAdmin: false, emailVerified: true },
            userProfile: {},
        });
        const { user } = renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route
                        path=""
                        element={
                            <Link
                                to={routes.admin}
                                data-testid="regular-access-level"
                            >
                                test
                            </Link>
                        }
                    />
                </Route>
                <Route
                    path={routes.admin}
                    element={<ProtectedRoutes adminOnly />}
                >
                    <Route
                        path=""
                        element={<div data-testid="admin-access-level"></div>}
                    />
                </Route>
                <Route
                    path={routes.notFound}
                    element={<div data-testid="not-found"></div>}
                />
            </Routes>
        );

        expect(screen.getByTestId("regular-access-level")).toBeInTheDocument();

        await user.click(screen.getByRole("link", { name: "test" }));

        expect(
            screen.queryByTestId("regular-access-level")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("admin-access-level")
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId("not-found")).toBeInTheDocument();

        mockUseAuth.mockClear();
    });

    it("should redirect user to verify email page if email is not verified", () => {
        mockUseAuth.mockReturnValueOnce({
            currentUser: { emailVerified: false },
        });
        renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route path="" element={<div></div>} />
                </Route>
                <Route
                    path={routes.verifyEmail}
                    element={<div data-testid="verify-email"></div>}
                />
            </Routes>
        );

        expect(screen.getByTestId("verify-email")).toBeInTheDocument();
    });
});
