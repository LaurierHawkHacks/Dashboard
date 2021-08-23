import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    button: {
        width: "100%",
        margin: "0.4em 0",
    },
});

function FormButton({ variant, color, type, label, onClick, ...rest }) {
    const classes = useStyles();
    return (
        <Button className={classes.button} variant={variant} color={color} type={type} onClick={onClick} {...rest}>
            {label}
        </Button>
    );
}

export default FormButton;
