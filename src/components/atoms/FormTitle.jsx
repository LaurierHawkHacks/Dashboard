import React from 'react';

function FormTitle({ label, ...rest }) {
    return (
        <h3 {...rest}>
            {label}
        </h3>
    );
}

export default FormTitle;
