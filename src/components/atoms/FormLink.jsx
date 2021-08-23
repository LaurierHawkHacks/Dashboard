import React from "react";

function FormLink({ variant, onClick, label, ...rest }) {
    const className = variant ? "link link-".concat(variant) : "link";
    return (
        <span className={className} onClick={onClick} {...rest}>
            {label}
        </span>
    );
}

export default FormLink;
