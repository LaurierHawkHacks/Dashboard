import { FC, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";

export interface Option {
    value: string;
    label: string;
}

export interface MultiSelectProps {
    label: string;
    options: Option[];
    initialValues?: Option[];
    onChange?: (opts: Option[]) => void;
}

const SelectedList: FC<{
    options: Option[];
    onDelete: (option: Option) => void;
}> = ({ options, onDelete }) => {
    return (
        <div className="my-4 space-x-2">
            {options.length > 0 &&
                options.map((sel) => (
                    <span
                        key={`${sel.label}-selected`}
                        className="inline-flex bg-gray-50 gap-2 px-2 py-2"
                    >
                        {sel.label}
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
    onChange,
}) => {
    const [selected, setSelected] = useState<Option[]>(initialValues);
    const [query, setQuery] = useState("");

    const handleChange = (opts: Option[]) => {
        console.log(opts);
        setSelected(opts);
        if (onChange) onChange(opts);
    };

    const filteredOptions =
        query === ""
            ? options
            : options.filter((opt) => {
                  return opt.label
                      .toLowerCase()
                      .trim()
                      .includes(query.toLowerCase().trim());
              });

    return (
        <div className="">
            <Combobox value={selected} onChange={handleChange} multiple>
                <div className="relative mt-1">
                    <Combobox.Label>{label}</Combobox.Label>
                    {selected.length > 0 && (
                        <SelectedList
                            options={selected}
                            onDelete={(opt) =>
                                setSelected((arr) =>
                                    arr.filter(
                                        (_opt) => _opt.label !== opt.label
                                    )
                                )
                            }
                        />
                    )}
                    <div className="relative w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-4 px-5 text-sm leading-5 text-gray-900 focus:ring-0"
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
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <Combobox.Option
                                        key={opt.label}
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
                                                <span>{opt.label}</span>
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
        </div>
    );
};
