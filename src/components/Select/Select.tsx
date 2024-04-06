import { FC, Fragment, useState, useRef, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { getOptionStyles } from "../MultiSelect/MultiSelect";

export interface SelectProps {
    label: string;
    options: string[];
    initialValue: string;
    name?: string;
    srLabelOnly?: boolean;
    allowCustomValue?: boolean;
    disabled?: boolean;
    required?: boolean;
    onChange?: (opt: string) => void;
}

export const Select: FC<SelectProps> = ({
    label,
    options,
    initialValue,
    srLabelOnly = false,
    allowCustomValue = false,
    disabled,
    name,
    required,
    onChange,
}) => {
    const [selected, setSelected] = useState<string>(initialValue);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const comboboxButtonRef = useRef<HTMLButtonElement | null>(null); // Added ref for Combobox.Button

    const handleChange = (opt: string) => {
        setSelected(opt);
        if (onChange) onChange(selected);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === "ArrowDown" &&
                inputRef.current === document.activeElement
            ) {
                setQuery("");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const filteredOptions =
        query === ""
            ? options
            : options.filter((opt) => {
                  return opt.toLowerCase().includes(query.toLowerCase());
              });

    return (
        <Combobox
            as="div"
            value={selected}
            onChange={handleChange}
            disabled={disabled}
            name={name}
        >
            <div className="relative">
                <Combobox.Label
                    className={`block text-sm font-medium ${
                        srLabelOnly ? " sr-only" : ""
                    }`}
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Combobox.Label>
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-gray-50 focus:ring-0"
                        displayValue={(option: string) => option}
                        onChange={(event) => setQuery(event.target.value)}
                        onFocus={() => setQuery("")}
                        ref={inputRef}
                        onClick={() => comboboxButtonRef.current?.click()} // Added to handle click and focus event to open the combobox
                    />
                    <Combobox.Button
                        className="absolute inset-y-0 right-0 flex items-center pr-2"
                        ref={comboboxButtonRef}
                    >
                        <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute border border-charcoalBlack mt-1 max-h-60 z-50 w-full overflow-auto bg-gray-50 py-1 text-base">
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <Combobox.Option
                                    key={option}
                                    className={getOptionStyles}
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {option}
                                            </span>
                                            {selected && (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active
                                                            ? "text-white"
                                                            : "text-teal-600"
                                                    }`}
                                                >
                                                    <CheckIcon
                                                        className="w-5 h-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
                {allowCustomValue ? (
                    <p className="mt-2 text-sageGray">
                        {`Not in the options? Type your ${label} in the input field.`}
                    </p>
                ) : null}
            </div>
        </Combobox>
    );
};
