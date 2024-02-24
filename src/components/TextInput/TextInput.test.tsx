import { render, screen } from "@testing-library/react";
import {
    getTextInputStyles,
    getTextInputDescriptionStyles,
    getTextInputLabelStyles,
} from "./TextInput.styles";
import { TextInput } from "@components";
import userEvent from "@testing-library/user-event";

vi.mock("./TextInput.styles", async (importOriginal) => {
    const mod = await importOriginal<typeof import("./TextInput.styles")>();
    return {
        ...mod,
        getTextInputLabelStyles: vi.fn(() => "classes"),
        getTextInputStyles: vi.fn(() => "classes"),
        getTextInputDescriptionStyles: vi.fn(() => "classes"),
    };
});

describe("TextInput Component", () => {
    it("should render an input of type text by default", () => {
        render(<TextInput label="test" id="test" />);
        expect(screen.getByLabelText("test")).toBeInTheDocument();
    });

    it("should render an input of given type", () => {
        render(<TextInput type="email" label="test" id="test" />);
        const input = screen.getByLabelText("test");
        expect(input.getAttribute("type")).toEqual("email");
    });

    it("should render screen reader only label", () => {
        render(<TextInput srLabel label="test" id="test" />);
        expect(getTextInputLabelStyles).toHaveBeenCalledWith({ srLabel: true });
    });

    it("should render a description for input", () => {
        render(<TextInput description="desc" label="test" id="test" />);
        expect(screen.getByText("desc")).toBeInTheDocument();
    });

    it("should render invalid visuals", () => {
        render(<TextInput invalid description="desc" label="test" id="test" />);
        expect(getTextInputDescriptionStyles).toHaveBeenCalledWith({
            invalid: true,
        });
        expect(getTextInputStyles).toHaveBeenCalledWith({ invalid: true });
    });

    it("should properly invoke onChange", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<TextInput label="test" id="test" onChange={mockOnChange} />);

        const input: HTMLInputElement = screen.getByLabelText("test");
        await user.type(input, "Test");

        expect(mockOnChange).toHaveBeenCalled();
    });
});
