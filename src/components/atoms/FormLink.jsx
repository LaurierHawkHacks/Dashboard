import React from "react";
import Styled from "styled-components";

const Link = Styled.span``;

function FormLink({ variant, onClick, label, ...rest }) {
    const className = variant ? "link link-".concat(variant) : "link";
    return (
        <Link className={className} onClick={onClick} {...rest}>
            {label}
        </Link>
    );
}

export default FormLink;
