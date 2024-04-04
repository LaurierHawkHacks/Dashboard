import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

export function renderWithRouter(
    ui: React.ReactElement,
    route = "/",
    pageName = "Test page"
) {
    window.history.pushState({}, pageName, route);

    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: BrowserRouter }),
    };
}
