import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
    textField: {
        width: "100%",
        margin: "0.6em 0",
    },
});

function FormInput({ id, type, label, variant="outlined", ...rest }) {
    const classes = useStyles();
    return (
        <>
            <TextField id={id} className={classes.textField} type={type} label={label} variant={variant} {...rest} />
            <br/>
        </>
    );
}

export default FormInput;
