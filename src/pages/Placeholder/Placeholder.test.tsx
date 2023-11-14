import { render, screen } from "@testing-library/react";
import { Placeholder } from "@pages";

vi.mock("@services");

describe("App Component", () => {
    it("should render Hawk Hacks Logo", () => {
        render(<Placeholder />);

        expect(
            screen.getByRole("img", { name: "Hawk Hacks Logo" })
        ).toBeInTheDocument();
    });
});
