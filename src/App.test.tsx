import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App Component", () => {
    it("should render Hawk Hacks Logo", () => {
        render(<App />);

        expect(
            screen.getByRole("img", { name: "Hawk Hacks Logo" })
        ).toBeInTheDocument();
    });
});
