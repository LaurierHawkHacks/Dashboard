import { render, screen } from "@testing-library/react";
import { Placeholder } from "@pages";

vi.mock("firebase/app");
vi.mock("firebase/firestore");
vi.mock("firebase/analytics");
vi.mock("firebase/auth");

describe("App Component", () => {
    it("should render Hawk Hacks Logo", () => {
        render(<Placeholder />);

        expect(
            screen.getByRole("img", { name: "Hawk Hacks Logo" })
        ).toBeInTheDocument();
    });
});
