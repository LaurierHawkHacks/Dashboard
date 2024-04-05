import { cva, type VariantProps } from "class-variance-authority";
import type { ClassProp } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";


const buttonStyles = cva(
    [
        "px-5 py-4 text-sm font-regular transition relative rounded-sm",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tbrand",
        "disabled:cursor-not-allowed disabled:after:hidden",
    ],
    {
        variants: {
            intent: {
                primary:
                    "bg-gradient-to-b from-[#256062] to-[#00959a] text-white hover:bg-[#3f9098] disabled:hover:bg-tbrand active:bg-[#214b4f] dark:bg-[#1f4245]",
                secondary:
                    "bg-white text-tbrand border border-gray-400 hover:bg-[#ebebeb] disabled:hover:bg-white active:bg-[#d9d9d9]",
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
