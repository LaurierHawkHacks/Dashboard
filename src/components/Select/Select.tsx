import { FC, Fragment, useState, useRef, useCallback, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

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

const ListboxOptions = ({ options, query }) => {
    const filteredOptions = useMemo(
        () => (query === "" ? options : options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))).slice(0, 50),
        [options, query]
    );

    return (
        <List
            height={Math.min(35 * filteredOptions.length, 300)} 
            width={'100%'}
            itemCount={filteredOptions.length}
            itemSize={35}
            outerElementType={CustomScrollbarsVirtualList} 
        >
            {({ index, style }) => (
                <Combobox.Option
                    key={filteredOptions[index]}
                    className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-blue-500 text-white" : "text-gray-900"}`
                    }
                    value={filteredOptions[index]}
                    style={style}
                >
                    {({ selected, active }) => (
                        <>
                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {filteredOptions[index]}
                            </span>
                            {selected && (
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"}`}>
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            )}
                        </>
                    )}
                </Combobox.Option>
            )}
        </List>
    );
};

const CustomScrollbarsVirtualList = React.forwardRef(({ style, ...props }, ref) => (
    <div
        ref={ref}
        style={{
            ...style,
            overflowX: 'hidden',
        }}
        {...props}
    />
));

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
    const comboboxButtonRef = useRef<HTMLButtonElement | null>(null);

    const handleChange = useCallback((opt: string) => {
        setSelected(opt);
        if (onChange) onChange(opt);
    }, [onChange]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);

    return (
        <Combobox
            as="div"
            value={selected}
            onChange={handleChange}
            disabled={disabled}
            name={name}
        >
            <div className="relative">
                <Combobox.Label className={`block text-sm font-medium ${srLabelOnly ? "sr-only" : ""}`}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Combobox.Label>
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-gray-50 focus:ring-0"
                        displayValue={(option: string) => option}
                        onChange={handleInputChange}
                        onFocus={() => setQuery("")}
                        onClick={() => comboboxButtonRef.current?.click()}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2" ref={comboboxButtonRef}>
                        <ChevronUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute mt-1 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.length === 0 && query !== "" ? (
                            <div className="relative py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            <ListboxOptions options={options} query={query} />
                        )}
                    </Combobox.Options>
                </Transition>
                {allowCustomValue && (
                    <p className="mt-2 text-sageGray">
                        {`Not in the options? Type your ${label} in the input field.`}
                    </p>
                )}
            </div>
        </Combobox>
    );
};