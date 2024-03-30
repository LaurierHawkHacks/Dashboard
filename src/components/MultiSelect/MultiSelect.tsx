import { FC, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";

export interface MultiSelectProps {
    label: string;
    options: string[];
    initialValues?: string[];
    srLabelOnly?: boolean;
    onChange?: (opts: string[]) => void;
}

const SelectedList: FC<{
    options: string[];
    onDelete: (option: string) => void;
}> = ({ options, onDelete }) => {
    return (
        <div className="my-4 space-x-2">
            {options.length > 0 &&
                options.map((sel) => (
                    <span
                        key={`${sel}-selected`}
                        className="inline-flex bg-gray-50 gap-2 px-2 py-2"
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

export const MultiSelect: FC<MultiSelectProps> = ({
    label,
    options,
    initialValues = [],
    srLabelOnly = false,
    onChange,
}) => {
    const [selected, setSelected] = useState<string[]>(initialValues);
    const [query, setQuery] = useState("");

    const handleChange = (opts: string[]) => {
        console.log(opts);
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
        <Combobox value={selected} onChange={handleChange} multiple>
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
                        onDelete={(opt) =>
                            setSelected((arr) =>
                                arr.filter((_opt) => _opt !== opt)
                            )
                        }
                    />
                )}
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack sm:text-sm">
                    <Combobox.Input
                        className="w-full border-none py-4 px-5 text-sm leading-5 text-gray-900 focus:ring-0 bg-gray-50"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <p className="mt-2 text-sageGray">
                    Choose everything that applies.
                </p>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full z-50 overflow-auto bg-gray-50 py-1 text-base border border-charcoalBlack focus:outline-none">
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <Combobox.Option
                                    key={opt}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? "bg-tbrand text-white"
                                                : "text-gray-900"
                                        }`
                                    }
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
            </div>
        </Combobox>
    );
};
