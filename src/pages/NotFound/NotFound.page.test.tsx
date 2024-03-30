import { render, screen } from "@testing-library/react";
import { NotFoundPage } from "./NotFound.page";
import { BrowserRouter } from "react-router-dom";

describe("NotFoundPage", () => {
    // Wrap NotFoundPage in BrowserRouter to ensure the necessary router context for Link
    const renderNotFoundPage = () =>
        render(
            <BrowserRouter>
                <NotFoundPage />
            </BrowserRouter>
        );

    it("should display the 404 error message", () => {
        renderNotFoundPage();
        expect(screen.getByRole("heading", { name: /404 - Page Not Found/i })).toBeInTheDocument();
    });

    it("should display a suggestion to go back to the home page", () => {
        renderNotFoundPage();
        expect(screen.getByText(/The page you're looking for doesn't seem to exist./i)).toBeInTheDocument();
    });

    it("should have a link that navigates back to the home page", () => {
        renderNotFoundPage();
        const goHomeLink = screen.getByRole("link", { name: /go home/i });
        expect(goHomeLink).toBeInTheDocument();
        expect(goHomeLink.getAttribute("href")).toBe("/");
    });
});
