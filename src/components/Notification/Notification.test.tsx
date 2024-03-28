import { render, screen, fireEvent } from "@testing-library/react";
import { Notification } from "@components";

describe("Notification Component", () => {
    it("should render a title and a message", () => {
        render(
            <Notification
                id={1}
                title="test title"
                message="test message"
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText("test title")).toBeInTheDocument();
        expect(screen.getByText("test message")).toBeInTheDocument();
    });

    it("should render a close button", () => {
        render(
            <Notification
                id={1}
                title="test title"
                message="test message"
                onClose={vi.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "Close" })).toBeEnabled();
    });

    it("should call onClose when close button is clicked", () => {
        const onClose = vi.fn();
        render(
            <Notification
                id={1}
                title="test title"
                message="test message"
                onClose={onClose}
            />
        );

        const btn = screen.getByRole("button", { name: "Close" });
        fireEvent.click(btn);
        expect(onClose).toHaveBeenCalledWith(1);
    });
});
