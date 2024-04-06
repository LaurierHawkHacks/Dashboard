import { FC, Fragment, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FixedSizeList as List } from 'react-window';

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
    const comboboxButtonRef = useRef<HTMLButtonElement | null>(null);
    const [listRef, setListRef] = useState<List | null>(null);

    useEffect(() => {
        if (onChange) onChange(selected);
    }, [selected, onChange]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowDown" && inputRef.current === document.activeElement) {
                setQuery('');
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const filteredOptions = useMemo(() => query === ""
        ? options
        : options.filter((opt) => opt.toLowerCase().includes(query.toLowerCase())), [options, query]);

    useEffect(() => {
        // Automatically scroll to the selected item when the list opens
        const selectedIndex = filteredOptions.findIndex(option => option === selected);
        if (listRef && selectedIndex >= 0) {
            listRef.scrollToItem(selectedIndex, "smart");
        }
    }, [filteredOptions, selected, listRef]);

    const handleChange = (opt: string) => {
        setSelected(opt);
    };

    const LIST_HEIGHT = 300;
    const ITEM_SIZE = 35;

    const Option = ({ index, style }) => (
        <Combobox.Option
            key={index}
            className={({ active }) =>
                `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? "bg-blue-500 text-white" : "text-gray-900"}`
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
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                    )}
                </>
            )}
        </Combobox.Option>
    );

    return (
        <Combobox
            as="div"
            value={selected}
            onChange={handleChange}
            disabled={disabled}
            name={name}
            onInputValueChange={({ inputValue }) => setQuery(inputValue || "")}
        >
            <div className="relative">
                <Combobox.Label className={`block text-sm font-medium ${srLabelOnly ? " sr-only" : ""}`}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Combobox.Label>
                <div className="relative w-full mt-2 cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-gray-50 focus:ring-0"
                        displayValue={(option: string) => option}
                        onChange={(event) => setQuery(event.target.value)}
                        onFocus={() => setQuery('')}
                        ref={inputRef}
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
                    <Combobox.Options className="absolute mt-1 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            <List
                                height={LIST_HEIGHT}
                                itemCount={filteredOptions.length}
                                itemSize={ITEM_SIZE}
                                width={'100%'}
                                ref={setListRef}
                            >
                                {Option}
                            </List>
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
