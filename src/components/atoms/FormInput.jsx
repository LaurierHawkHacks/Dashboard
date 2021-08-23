import React from "react";
import Styled from "styled-components";
import MuiTextField from "@material-ui/core/TextField";

const InputField = Styled(MuiTextField)`
    width: 100%;
    margin: 2em 0;
`;

function FormInput({ controlId, type, label, variant="outlined", ...rest }) {
    return (
        <>
            <InputField  style={{margin:"0.6em 0"}} id={controlId} type={type} label={label} variant={variant} {...rest} />
            <br/>
        </>
    );
}

export default FormInput;
