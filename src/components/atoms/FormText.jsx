import React from "react";
import { makeStyles } from "@material-ui/styles";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    text: {
        textAlign: "center",
        marginTop: "0.8em",
    },
});

function FormText({ children, ...rest }) {
    const classes = useStyles();
    return (
        <Typography className={classes.text} {...rest}>
            {children}
        </Typography>
    );
}

export default FormText;
