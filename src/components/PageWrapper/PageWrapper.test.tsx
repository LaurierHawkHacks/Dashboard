import { render, screen } from "@testing-library/react";
import { PageWrapper } from "./PageWrapper";

describe("PageWrapper Component", () => {
    it("should render the given children", () => {
        render(
            <PageWrapper>
                <p>test</p>
            </PageWrapper>
        );
        expect(screen.getByText("test")).toBeInTheDocument();
    });
});
