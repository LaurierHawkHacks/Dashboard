import { render, screen } from "@testing-library/react";
import { ErrorAlert } from "@components";

describe("ErrorAlert Component", () => {
    it("should render a list of errors", () => {
        render(<ErrorAlert errors={["error 1", "error 2"]} />);
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByText("error 1")).toBeInTheDocument();
        expect(screen.getByText("error 2")).toBeInTheDocument();
    });

    it("should a heading with error count", () => {
        render(<ErrorAlert errors={["error 1", "error 2"]} />);
        expect(
            screen.getByRole("heading", {
                level: 3,
                name: "There were 2 errors with your submission",
            })
        ).toBeInTheDocument();
    });

    it("should change heading wording if is single error", () => {
        render(<ErrorAlert errors={["error"]} />);
        expect(
            screen.getByRole("heading", {
                level: 3,
                name: "There was 1 error with your submission",
            })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", {
                level: 3,
                name: "There were 2 errors with your submission",
            })
        ).not.toBeInTheDocument();
    });
});
