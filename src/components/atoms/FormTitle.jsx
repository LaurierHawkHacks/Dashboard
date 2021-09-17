import React from "react";
import Typography from '@material-ui/core/Typography';

function FormTitle({ label, children, variant="h5", ...rest }) {
    return (
        <Typography variant={variant} gutterBottom {...rest}>
            {label}
            {children}
        </Typography>
    );
}

export default FormTitle;
