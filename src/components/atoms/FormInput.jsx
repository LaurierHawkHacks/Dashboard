import React from 'react';
import Form from 'react-bootstrap/Form';

function FormInput({ controlId, type, label, placeholder, ...rest }) {
    return (
        <Form.Group controlId={controlId} {...rest}>
            <Form.Label>{label}</Form.Label>
            <Form.Control type={type} placeholder={placeholder} />
        </Form.Group>
    );
}

export default FormInput;
