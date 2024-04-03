import { FC, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { VariantProps, cva } from "class-variance-authority";
import { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

const SelectedList: FC<{
    options: string[];
    onDelete: (option: string) => void;
}> = ({ options, onDelete }) => {
    return (
        <div className="my-4 space-x-2 space-y-2">
            {options.length > 0 &&
                options.map((sel) => (
                    <span
                        key={`${sel}-selected`}
                        className="inline-flex bg-gray-50 first:ml-2 gap-2 px-2 py-2 border border-charcoalBlack"
                    >
                        {sel}
                        <button
                            type="button"
                            onClick={() => onDelete(sel)}
                            className="-mr-1"
                        >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </span>
                ))}
        </div>
    );
};

const optionStyles = cva(
    ["text-gray-900 relative cursor-default select-none py-2 pl-10 pr-4"],
    {
        variants: {
            active: {
                true: "bg-tbrand text-white",
            },
        },
    }
);

type OptionStylesProps = VariantProps<typeof optionStyles>;

export function getOptionStyles(opts: OptionStylesProps & ClassProp): string {
    return twMerge(optionStyles(opts));
}

export interface MultiSelectProps {
    label: string;
    options: string[];
    initialValues?: string[];
    srLabelOnly?: boolean;
    allowCustomValue?: boolean;
    name?: string;
    disabled?: boolean;
    onChange?: (opts: string[]) => void;
}

export const MultiSelect: FC<MultiSelectProps> = ({
    label,
    options,
    initialValues = [],
    srLabelOnly = false,
    allowCustomValue = false,
    name,
    disabled,
    onChange,
}) => {
    const [selected, setSelected] = useState<string[]>(initialValues);
    const [query, setQuery] = useState("");

    const handleChange = (opts: string[]) => {
        setSelected(opts);
        if (onChange) onChange(opts);
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
        <Combobox
            disabled={disabled}
            name={name}
            value={selected}
            onChange={handleChange}
            multiple
        >
            <div className="relative">
                <Combobox.Label
                    className={`block font-medium leading-6 text-charcoalBlack text-md${
                        srLabelOnly ? " sr-only" : ""
                    }`}
                >
                    {label}
                </Combobox.Label>
                {selected.length > 0 && (
                    <SelectedList
                        options={selected}
                        onDelete={(opt) => {
                            const newSelection = selected.filter(
                                (_opt) => _opt !== opt
                            );
                            setSelected(newSelection);
                            if (onChange) onChange(newSelection);
                        }}
                    />
                )}
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 bg-gray-50 focus:ring-0"
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
                            >{`Create "${query}"`}</Combobox.Option>
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
                <p className="mt-2 text-sageGray">
                    Choose everything that applies.
                    {allowCustomValue ? (
                        <span className="block mt-2">
                            {`Not in the options? Type your ${label} in the input field.`}
                        </span>
                    ) : null}
                </p>
            </div>
        </Combobox>
    );
};
