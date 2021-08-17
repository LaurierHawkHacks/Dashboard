import React from 'react';
import Button from 'react-bootstrap/Button';

function FormButton({ variant, type, label, onClick, ...rest }) {
    return (
        <Button variant={variant} type={type} onClick={onClick} {...rest}>
            {label}
        </Button>
    );
}

export default FormButton;
