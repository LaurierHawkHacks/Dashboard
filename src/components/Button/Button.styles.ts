import { cva, type VariantProps } from "class-variance-authority";
import type { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
    [
        "px-5 py-4 text-sm font-medium transition relative rounded-sm",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tbrand",
        "disabled:cursor-not-allowed disabled:after:hidden disabled:bg-btn-gradient-disabled disabled:text-white disabled:hover:bg-gray-400",
    ],
    {
        variants: {
            intent: {
                primary:
                    "bg-btn-gradient text-white hover:bg-[#3f9098] active:bg-[#214b4f]",
                secondary:
                    "bg-white text-tbrand border border-gray-400 hover:bg-[#ebebeb] disabled:hover:bg-white active:bg-[#d9d9d9]",
                danger: "bg-btn-gradient-dg text-white hover:bg-white active:bg-[#d9d9d9]",
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
