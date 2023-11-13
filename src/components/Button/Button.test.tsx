import { render, screen } from "@testing-library/react";
import { Button } from "@components";

describe("Button Component", () => {
    it("should render a button", () => {
        render(<Button />);

        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});
