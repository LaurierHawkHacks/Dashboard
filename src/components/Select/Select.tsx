import { FC, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export interface Option {
    value: string;
    label: string;
}

export interface SelectProps {
    label: string;
    options: Option[];
    initialValue: Option;
    onChange?: (opt: Option) => void;
}

export const Select: FC<SelectProps> = ({
    label,
    options,
    initialValue,
    onChange,
}) => {
    const [selected, setSelected] = useState<Option>(initialValue);
    const [query, setQuery] = useState("");

    const handleChange = (opt: Option) => {
        setSelected(opt);
        if (onChange) onChange(opt);
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
        <Combobox value={selected} onChange={handleChange}>
            <div className="relative">
                <Combobox.Label className="block font-medium leading-6 text-charcoalBlack text-md">
                    {label}
                </Combobox.Label>
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-white text-left border border-charcoalBlack focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(opt: Option) => opt?.label ?? ""}
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
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg border border-charcoalBlack focus:outline-none sm:text-sm">
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
    );
};
