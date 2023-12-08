import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes, renderWithRouter } from "@utils";
import { mockUseAuth } from "@mocks/providers";

vi.mock("@providers");

describe("ProctectedRoutes Component", () => {
    it("should render if user is authorized", () => {
        mockUseAuth.mockReturnValueOnce({ currentUser: true });
        renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route
                        path="/"
                        element={<div data-testid="in-doc"></div>}
                    />
                </Route>
                <Route
                    path="/admin/login"
                    element={<div data-testid="login"></div>}
                />
            </Routes>
        );

        expect(screen.queryByTestId("login")).not.toBeInTheDocument();
        expect(screen.getByTestId("in-doc")).toBeInTheDocument();
    });

    it("should redirect to login if user is not authorized", () => {
        mockUseAuth.mockReturnValueOnce({ currentUser: null });
        renderWithRouter(
            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route
                        path="/"
                        element={<div data-testid="not-in-doc"></div>}
                    />
                </Route>
                <Route
                    path="/admin/login"
                    element={<div data-testid="login"></div>}
                />
            </Routes>
        );

        expect(screen.getByTestId("login")).toBeInTheDocument();
        expect(screen.queryByTestId("not-in-doc")).not.toBeInTheDocument();
    });
});
