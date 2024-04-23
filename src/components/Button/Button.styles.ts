import { cva, type VariantProps } from "class-variance-authority";
import type { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
    [
        "px-5 py-4 text-sm font-regular transition relative rounded-sm",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tbrand",
        "disabled:cursor-not-allowed disabled:after:hidden disabled:bg-gray-400 disabled:text-white disabled:hover:bg-gray-400",
    ],
    {
        variants: {
            intent: {
                primary:
                    "bg-tbrand text-white hover:bg-[#3f9098] active:bg-[#214b4f]",
                secondary:
                    "bg-white text-tbrand border border-gray-400 hover:bg-[#ebebeb] disabled:hover:bg-white active:bg-[#d9d9d9]",
                danger: "bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white disabled:border-none",
            },
        },
        defaultVariants: {
            intent: "primary",
        },
    }
);

export type ButtonStylesProps = VariantProps<typeof buttonStyles>;

export function getButtonStyles(opts: ButtonStylesProps & ClassProp): string {
    return twMerge(buttonStyles(opts));
}
