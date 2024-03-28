import { FC, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const optionStyles = cva(
    ["relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"],
    {
        variants: {
            active: {
                true: "bg-tbrand text-white",
            },
        },
    }
);

export interface Option {
    value: string;
    label: string;
}

export interface SelectProps {
    label: string;
    options: Option[];
    value: Option;
    onChange: (opt: Option) => void;
}

export const Select: FC<SelectProps> = ({
    label,
    value,
    options,
    onChange,
}) => {
    return (
        <Listbox value={value} onChange={onChange}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                        {label}
                    </Listbox.Label>
                    <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-tbrand sm:text-sm sm:leading-6">
                            <span className="block truncate">
                                {value.label}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((opt) => (
                                    <Listbox.Option
                                        key={opt.value}
                                        className={({ active }) =>
                                            twMerge(optionStyles({ active }))
                                        }
                                        value={opt}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className="block truncate">
                                                    {opt.label}
                                                </span>

                                                {selected ? (
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
};
