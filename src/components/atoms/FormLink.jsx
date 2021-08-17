import React from 'react';
import Form from 'react-bootstrap/Form';

function FormLink({ controlId, variant, href, target="", label, ...rest }) {
    const className = variant ? "link link-".concat(variant) : "link";
    return (
        <Form.Group controlId={controlId} {...rest}>
            <a href={href} className={className} target={target}>{label}</a>
        </Form.Group>
    );
}

export default FormLink;
