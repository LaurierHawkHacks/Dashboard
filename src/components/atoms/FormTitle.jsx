import React from "react";
import Typography from '@material-ui/core/Typography';

function FormTitle({ label, variant="h5", ...rest }) {
    return (
        <Typography variant={variant} gutterBottom {...rest}>
            {label}
        </Typography>
    );
}

export default FormTitle;
