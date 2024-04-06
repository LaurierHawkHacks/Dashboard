import { FC, useEffect, useRef, useState, Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Combobox, Transition } from "@headlessui/react";
import { getOptionStyles } from "../MultiSelect/MultiSelect";
import { countryCodes } from "@/data/countryPhoneCodes";
import {
    getTextInputLabelStyles,
    getTextInputStyles,
} from "../TextInput/TextInput.styles";

export interface PhoneInputProps {
    onChange: (phone: string) => void; // concat the country code + phone number
    required?: boolean;
}

export const PhoneInput: FC<PhoneInputProps> = ({ onChange, required }) => {
    const [randomId] = useState(Math.random().toString(32));
    const [country, setCountry] = useState("");
    const [query, setQuery] = useState("");
    const [phone, setPhone] = useState("");
    const countryCodeInputRef = useRef<HTMLInputElement | null>(null);
    const countryCodeBtnRef = useRef<HTMLButtonElement | null>(null);

    const filteredCountries =
        query === ""
            ? countryCodes
            : countryCodes.filter((opt) =>
                  opt.toLowerCase().trim().includes(query.toLowerCase().trim())
              );

    useEffect(() => {
        const code = country.replace(/\D/g, ""); // remove all non digit
        if (onChange) onChange(`+${code}${phone}`);
    }, [country, phone, onChange]);

    return (
        <div className="grid grid-cols-6 space-y-2">
            <label
                className={getTextInputLabelStyles({
                    className: "col-span-full",
                })}
                htmlFor={`phone-${randomId}`}
            >
                Phone Number
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="col-span-1">
                <label className="sr-only" htmlFor={`country-code-${randomId}`}>
                    Country Code
                </label>
                <Combobox onChange={setCountry} value={country}>
                    <div className="relative">
                        <div className="relative w-full cursor-default overflow-hidden bg-gray-50 text-left border border-charcoalBlack">
                            <Combobox.Input
                                ref={countryCodeInputRef}
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-gray-50 focus:ring-0"
                                displayValue={(opt: string) =>
                                    (opt && "+" + opt.replace(/\D/g, "")) || ""
                                }
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                id={`country-code-${randomId}`}
                                onFocus={() => {
                                    setQuery("");
                                    setCountry("");
                                }}
                                onClick={() =>
                                    countryCodeBtnRef.current?.click()
                                }
                                placeholder="+1"
                            />
                            <Combobox.Button
                                ref={countryCodeBtnRef}
                                className="absolute inset-y-0 right-0 flex items-center pr-2"
                            >
                                <ChevronDownIcon
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
                                {filteredCountries.map((opt) => (
                                    <Combobox.Option
                                        key={opt}
                                        className={({ active }) =>
                                            getOptionStyles({
                                                active,
                                                className: "py-2 px-1",
                                            })
                                        }
                                        value={opt}
                                    >
                                        {opt}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>
            <div className="col-span-5 ml-2">
                <input
                    id={`phone-${randomId}`}
                    className={getTextInputStyles({
                        className: "py-2 leading-5",
                    })}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="999-999-9999"
                />
            </div>
        </div>
    );
};
