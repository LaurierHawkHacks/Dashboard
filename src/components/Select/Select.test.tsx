import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "@components";
import { type Option } from "./Select";

describe("Select Component", () => {
    const options: Option[] = [
        { value: "1", label: "first option" },
        { value: "2", label: "first next option" },
        { value: "3", label: "third option" },
    ];

    it("should render basic structure select component", () => {
        render(
            <Select
                initialValue={options[0]}
                options={options}
                label="select"
            />
        );
        // a button and the input
        expect(screen.getAllByLabelText("select")).toHaveLength(2);
        expect(screen.getByRole("combobox")).toBeEnabled();
        expect(screen.getByRole("button")).toBeEnabled();
    });

    it("should render options", async () => {
        const user = userEvent.setup();
        render(
            <Select
                initialValue={options[0]}
                options={options}
                label="select"
            />
        );
        const select = screen.getByRole("button");
        await user.click(select);

        expect(await screen.findAllByRole("option")).toHaveLength(3);
    });

    it("should should call onChange when an option is selected", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <Select
                initialValue={options[0]}
                options={options}
                label="select"
                onChange={onChange}
            />
        );
        const select = screen.getByRole("button");
        await user.click(select);
        const opt = screen.getByRole("option", { name: options[0].label });
        await user.click(opt);
        expect(onChange).toHaveBeenCalledWith(options[0]);
    });

    it("should filter options by typing", async () => {
        const user = userEvent.setup();
        render(
            <Select
                initialValue={options[0]}
                options={options}
                label="select"
                onChange={vi.fn()}
            />
        );

        const select = screen.getByRole("button");
        await user.click(select);
        expect(screen.getAllByRole("option")).toHaveLength(3);

        const combobox = screen.getByRole("combobox");
        await user.clear(combobox);
        await user.type(combobox, "first");

        expect(await screen.findAllByRole("option")).toHaveLength(2);
    });
});
