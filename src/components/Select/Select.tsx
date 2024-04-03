import { FC, Fragment, useState } from "react";
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
    onChange?: (opt: string) => void;
}

export const Select: FC<SelectProps> = ({
    label,
    options,
    initialValue,
    srLabelOnly = false,
    allowCustomValue = false,
    name,
    onChange,
}) => {
    const [selected, setSelected] = useState<string>(initialValue);
    const [query, setQuery] = useState("");

    const handleChange = (opt: string) => {
        setSelected(opt);
        if (onChange) onChange(opt);
    };

    const filteredOptions =
        query === ""
            ? options
            : options.filter((opt) => {
                  return opt
                      .toLowerCase()
                      .trim()
                      .includes(query.toLowerCase().trim());
              });

    return (
        <Combobox name={name} value={selected} onChange={handleChange}>
            <div className="relative">
                <Combobox.Label
                    className={`block font-medium leading-6 text-charcoalBlack text-md${
                        srLabelOnly ? " sr-only" : ""
                    }`}
                >
                    {label}
                </Combobox.Label>
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-gray-50 focus:ring-0"
                        displayValue={(opt: string) => opt}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
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
                        {allowCustomValue && query.length > 0 ? (
                            <Combobox.Option
                                className={getOptionStyles}
                                value={query}
                            >{`Self-described as "${query}"`}</Combobox.Option>
                        ) : null}
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <Combobox.Option
                                    key={opt}
                                    className={getOptionStyles}
                                    value={opt}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span>{opt}</span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                                        active
                                                            ? "text-white"
                                                            : "text-green-600"
                                                    }`}
                                                >
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
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
