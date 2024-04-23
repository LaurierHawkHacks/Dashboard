import {
    type TextInputStylesProps,
    getTextInputLabelStyles,
    getTextInputStyles,
    getTextInputDescriptionStyles,
} from "./TextInput.styles";
import React, { useState } from 'react';

export interface TextInputProps
    extends TextInputStylesProps,
        React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * Label text of the input. For accessibility reasons, all inputs should have a label.
     */
    label: string;

    /**
     * Make input label screen-reader only. Default false.
     */
    srLabel?: boolean;

    /**
     * Force the usage of id to match label to input.
     * This avoids dynamically generating a new id in runtime.
     */
    id: string;

    /**
     * Description of the input field.
     */
    description?: string;

    /**
     * Function to validate the input value.
     */
    validate?: (value: string) => boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    className,
    invalid,
    description,
    srLabel = false,
    required,
    validate,
    ...inputProps
}) => {
    const describedby = `text-input-description-${inputProps.id}`;
    const [error, setError] = useState<string | null>(null);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (validate && !validate(event.target.value)) {
            setError("Invalid URL format.");
        } else {
            setError(null);
        }
    };

    return (
        <div>
            <label
                htmlFor={inputProps.id}
                className={getTextInputLabelStyles({ srLabel })}
            >
                {label}
                {required ? <span className="text-red-600 ml-1">*</span> : null}
            </label>
            <div className="mt-2">
                <input
                    {...inputProps}
                    aria-describedby={[
                        inputProps["aria-describedby"] ?? "",
                        describedby,
                    ].join(" ")}
                    className={getTextInputStyles({ invalid, className })}
                    onBlur={handleBlur}
                />
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            {description && (
                <p
                    className={getTextInputDescriptionStyles({ invalid })}
                    id={describedby}
                >
                    {description}
                </p>
            )}
        </div>
    );
};
