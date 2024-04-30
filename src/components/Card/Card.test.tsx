import { render, screen } from "@testing-library/react";
import { Card } from "@components";

describe("Card Component", () => {
    it("should render a card article without content", () => {
        render(<Card title={"What is hawkhacks"}></Card>);

        expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("should render a card article with card content", () => {
        render(
            <Card title={"What is hawkhacks"}>
                <p>Hawkhacks is ...</p>
            </Card>
        );

        expect(screen.getByText("Hawkhacks is ...")).toBeInTheDocument();
    });
});
