import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "@components";
import { type Option } from "./Select";

describe("Select Component", () => {
    const options: Option[] = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
    ];

    it("should render a label for the select component", () => {
        render(<Select options={options} label="select" />);
        expect(screen.getByLabelText("select")).toBeInTheDocument();
        expect(screen.getByLabelText("select")).toBeEnabled();
    });

    it("should render options", async () => {
        const user = userEvent.setup();
        render(<Select options={options} label="select" />);
        const select = screen.getByLabelText("select");
        await user.click(select);

        expect(await screen.findAllByRole("option")).toHaveLength(3);
    });

    it("should should call onChange when an option is selected", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<Select options={options} label="select" onChange={onChange} />);
        const select = screen.getByLabelText("select");
        await user.click(select);
        const opts = await screen.findAllByRole("option");

        await user.click(opts[0]);
        expect(onChange).toHaveBeenLastCalledWith(opts[0]);

        await user.click(opts[1]);
        expect(onChange).toHaveBeenLastCalledWith(opts[1]);

        await user.click(opts[2]);
        expect(onChange).toHaveBeenLastCalledWith(opts[2]);
    });
});
