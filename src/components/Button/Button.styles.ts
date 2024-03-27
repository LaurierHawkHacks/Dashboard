import { cva, type VariantProps } from "class-variance-authority";
import type { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
    [
        "px-5 py-4 text-sm font-regular transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tbrand",
        "disabled:cursor-not-allowed disabled:after:hidden",
    ],
    {
        variants: {
            intent: {
                primary:
                    "bg-tbrand text-white hover:bg-[#3f9098] disabled:hover:bg-tbrand active:bg-[#214b4f]",
                secondary:
                    "bg-white text-tbrand hover:bg-[#ebebeb] disabled:hover:bg-white active:bg-[#d9d9d9]",
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
