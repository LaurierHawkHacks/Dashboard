import React from "react";
import Styled from "styled-components";
import MuiButton from "@material-ui/core/Button";

const Button = Styled(MuiButton)`
    width: 100%;
`;

function FormButton({ variant, color, type, label, onClick, ...rest }) {
    return (
        <Button style={{margin:"0.4em 0"}} variant={variant} color={color} type={type} onClick={onClick} {...rest}>
            {label}
        </Button>
    );
}

export default FormButton;
