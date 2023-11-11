type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export const Form: React.FC<FormProps> = ({ children, ...props }) => {
    return <form {...props}>{children}</form>;
};
