import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { FormButton, FormTitle } from "@atoms";

const useStyles = makeStyles(theme => ({
    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
    },
    col: {
        minWidth: "max-content",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
    },
    barText: {
        padding: "0.5em",
    },
    barTitle: {
        textAlign: "center",
    },
    module: {
        borderColor: theme.palette.primary.light,
        borderWidth: "1px",
        borderStyle: "solid",
    },
}));

const LandingPage = ({ handleLogout }) => {
    const classes = useStyles();
    return(
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={3}>
                    <Typography className={classes.barText} variant="h5">
                        Hi, [first name]!
                    </Typography>    
                </Grid>
                <Grid item xs={12} sm={4} md={6}>
                    <Typography className={clsx(classes.barTitle, classes.barText)} variant="h5">
                        Application Status
                    </Typography> 
                </Grid>
                <Grid item xs={0} sm={4} md={3} />
            </Grid>
            <Container className={classes.module}>

            </Container>
            <Container className={classes.row}>
                <FormTitle variant="h4" label="Welcome Hawk!" />
                <FormButton type="submit" onClick={handleLogout} label="Logout">Logout</FormButton>
            </Container>
        </Box>
    )
}

export default LandingPage;