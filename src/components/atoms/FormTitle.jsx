import React from "react";
import Styled from "styled-components";
import Typography from '@material-ui/core/Typography';

function FormTitle({ label, variant="h5", ...rest }) {
    return (
        <Typography variant={variant} gutterBottom {...rest}>
            {label}
        </Typography>
    );
}

export default FormTitle;
