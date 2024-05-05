import { getButtonStyles } from "./Button.styles";
import type { ButtonProps } from "./Button.type";

export const Button: React.FC<ButtonProps> = ({
    children,
    intent,
    className,
    ...props
}) => {
    const buttonClass = getButtonStyles({ intent, className });

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
};
