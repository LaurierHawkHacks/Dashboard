import { cva, type VariantProps } from "class-variance-authority";
import type { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

const textInputStyles = cva(
    [
        "block w-full py-2 px-3 bg-gray-50 text-gray-900 placeholder:text-sageGray", // base
        "focus:ring-2 focus:ring-inset", // focus styles
    ],
    {
        variants: {
            invalid: {
                true: "text-red-500 ring-red-500 ring-2 placeholder:text-red-300 focus:ring-red-500",
            },
        },
        defaultVariants: {
            invalid: false,
        },
    }
);

export type TextInputStylesProps = VariantProps<typeof textInputStyles>;

export function getTextInputStyles(
    opts: TextInputStylesProps & ClassProp
): string {
    return twMerge(textInputStyles(opts));
}

export const getTextInputLabelStyles = cva(
    "block font-medium leading-5 text-charcoalBlack text-md",
    {
        variants: {
            srLabel: {
                true: "sr-only",
            },
        },
        defaultVariants: {
            srLabel: false,
        },
    }
);

const textInputDescriptionStyles = cva("mt-2 text-sm text-[#32848C]", {
    variants: {
        invalid: {
            true: "text-red-500",
        },
    },
    defaultVariants: {
        invalid: false,
    },
});

export function getTextInputDescriptionStyles(
    opts: VariantProps<typeof textInputStyles>
) {
    return twMerge(textInputDescriptionStyles(opts));
}
