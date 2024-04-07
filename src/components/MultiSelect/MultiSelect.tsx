import { FC, Fragment, useRef, useState, useCallback } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronDownIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { VariantProps, cva } from "class-variance-authority";
import { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";
import { getTextInputDescriptionStyles } from "../TextInput/TextInput.styles";
import { useDebounce } from "@/hooks/use-debounce";

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
    [
        "text-gray-900 relative cursor-default select-none py-2 pl-10 pr-4 hover:cursor-pointer",
    ],
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
    required?: boolean;
    description?: string;
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
    required,
    description,
    onChange,
}) => {
    const [selected, setSelected] = useState<string[]>(initialValues);
    const [controlledOptions, setControlledOptions] = useState(
        options.slice(0, 50)
    );
    const [query, setQuery] = useState("");
    const randomId = useRef(Math.random().toString(32));
    const comboboxButtonRef = useRef<HTMLButtonElement | null>(null);
    const lastOptionRef = useRef<HTMLLIElement | null>(null);
    const optionsRef = useRef<HTMLUListElement | null>(null);

    const handleChange = useCallback(
        (opts: string[]) => {
            setSelected(opts);
            setQuery("");
            if (onChange) onChange(opts);
        },
        [onChange, query]
    );
    const filterQuery = (value: string) => {
        const transformedValue = value.toLowerCase().trim();
        setControlledOptions(() =>
            value === ""
                ? options.slice(0, 50)
                : options
                      .filter((opt) =>
                          opt.toLowerCase().trim().includes(transformedValue)
                      )
                      .slice(0, 50)
        );
    };

    const debounce = useDebounce<typeof filterQuery, string>(filterQuery, 400);

    const handleScroll = useCallback(() => {
        // alreay render the entire list
        if (controlledOptions.length === options.length) return;
        if (!optionsRef.current) return;
        const rect = optionsRef.current.getBoundingClientRect();
        const a = rect.top; // parent container top
        const b = rect.bottom; // parent container bottom
        if (lastOptionRef.current) {
            const rect = lastOptionRef.current.getBoundingClientRect();
            const x = rect.top; // last option top corner

            if (x >= a && x <= b) {
                // if in view load more options
                setControlledOptions((opts) =>
                    options.slice(0, opts.length + 50)
                );
            }
        }
    }, [optionsRef.current, lastOptionRef.current]);

    const controlledoptions =
        query === ""
            ? options
            : options.filter((opt) => {
                  return opt
                      .toLowerCase()
                      .trim()
                      .includes(query.toLowerCase().trim());
              });

    const describedby = `multiselect-description-${randomId}`;

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
                    {`${label} (one or more)`}
                    {required ? (
                        <span className="text-red-600 ml-1">*</span>
                    ) : null}
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
                        id={randomId.current}
                        className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 bg-gray-50 focus:ring-0"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            debounce(e.target.value);
                        }}
                        onFocus={() => setQuery("")}
                        onClick={() => comboboxButtonRef.current?.click()} // Added to handle click and focus event to open the combobox
                        aria-describedby={describedby}
                        value={query}
                    />
                    <Combobox.Button
                        ref={comboboxButtonRef}
                        className="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                        <ChevronDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                {description && (
                    <p
                        className={getTextInputDescriptionStyles({
                            invalid: false,
                        })}
                        id={describedby}
                    >
                        {description}
                    </p>
                )}
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options
                        ref={optionsRef}
                        onScroll={handleScroll}
                        className="absolute border border-charcoalBlack mt-1 max-h-60 z-50 w-full overflow-auto bg-gray-50 py-1 text-base"
                    >
                        {allowCustomValue && query.length > 0 ? (
                            <Combobox.Option
                                className={getOptionStyles}
                                value={query}
                            >{`Create "${query}"`}</Combobox.Option>
                        ) : null}
                        {controlledoptions.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            controlledoptions.map((opt, i) => (
                                <Combobox.Option
                                    key={opt}
                                    className={getOptionStyles}
                                    value={opt}
                                    ref={
                                        i === controlledOptions.length - 1
                                            ? lastOptionRef
                                            : undefined
                                    }
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
                                                {opt}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
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
                    {allowCustomValue ? (
                        <span className="block mt-2">
                            Not in the options? Type your answer in the input
                            field.
                        </span>
                    ) : null}
                </p>
            </div>
        </Combobox>
    );
};
