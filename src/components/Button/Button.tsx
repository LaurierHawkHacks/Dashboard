import { getButtonStyles } from "./Button.styles";
import type { ButtonProps } from "./Button.type";

export const Button: React.FC<ButtonProps> = ({
    children,
    intent,
    className,
    ...props
}) => {
    return (
        <button className={getButtonStyles({ intent, className })} {...props}>
            {children}
        </button>
    );
};
