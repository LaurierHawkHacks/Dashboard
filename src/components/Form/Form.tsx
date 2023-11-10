export const Form: React.FC<any> = ({ children, handleFormSubmit }) => {
    return <form onSubmit={handleFormSubmit}>{children}</form>;
};

