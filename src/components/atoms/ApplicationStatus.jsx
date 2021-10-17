import React from 'react';
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { MdTaskAlt as StepIconDone } from "react-icons/md";
import { Media } from 'react-breakpoints';

const size = "1.6em";
const size2 = "2.4em";
let gradient = "";

const useStyles = makeStyles(theme => {
    gradient = `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`;
    return {
        module: {
            borderColor: theme.palette.primary.light,
            borderWidth: "1px",
            borderStyle: "solid",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        moduleTitle: {
            textAlign: "center",
        },
        moduleTitleStep: {
            marginLeft: "0.2em",
        },
        container: {
            [theme.breakpoints.down('sm')]: {
                padding: "2.5em 1em 4em 1em",
            },
            [theme.breakpoints.up('sm')]: {
                padding: "2.5em 2em 4em 2em",
            },
            [theme.breakpoints.up('md')]: {
                padding: "2.5em 5em 4em 5em",
            }
        },
        stepIcon: {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "100%",
            width: size2,
            height: size2,
        },
        stepIconIncomplete: {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.main,
            borderRadius: "100%",
            borderWidth: "0.3em",
            borderStyle: "solid",
            padding: "0.1em",
            width: size,
            height: size,
            textAlign: "center",
            fontWeight: "bold",
        },
        stepContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "max-content",
            marginTop: "1em",
            marginBottom: "-0.36em",
        },
        spacer: {
            height: "1.5em",
        },
    };
});

const ApplicationStatus = ({ theme, step }) => {
    const classes = useStyles();
    const messages = ["Create Account","Verify Email","Complete Application","Complete Confirmation","Join our Discord Server!"];
    const steps = [];
    const percent = (step === messages.length-1) ? 100 : Math.round(((step + 0.25) / (messages.length-1)) * 100);
    const nextStep = (step === messages.length-1) ? "You are all done!" : messages[step+1];
    for (let i in messages) {
        steps.push(
            <Step transition="scale">
                { ({ accomplished, index }) => accomplished
                    ?   <div className={classes.stepContainer}>
                            <StepIconDone
                                className={classes.stepIcon}
                                style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                            />
                            <Media>
                                {({ breakpoints, currentBreakpoint }) =>
                                    breakpoints[currentBreakpoint] >= breakpoints.tabletLandscape
                                    ? <Typography>{messages[i]}</Typography>
                                    : <div className={classes.spacer}/> }
                            </Media>
                        </div>
                    :   <div className={classes.stepContainer}>
                            <Typography className={classes.stepIconIncomplete}>{index+1}</Typography>
                            <Media>
                                {({ breakpoints, currentBreakpoint }) =>
                                    breakpoints[currentBreakpoint] >= breakpoints.tabletLandscape
                                    ? <Typography>{messages[i]}</Typography>
                                    : <div className={classes.spacer}/> }
                            </Media>
                        </div>
                }
            </Step>
        );
    }
    return (
        <Container className={classes.module}>
            <Typography className={classes.moduleTitle} variant="h5">
                Next step: 
                <span className={classes.moduleTitleStep}>
                    {nextStep}
                </span>
            </Typography>
            <Container className={classes.container}>
                <ProgressBar
                    percent={percent}
                    filledBackground={gradient}
                >
                    {steps}
                </ProgressBar>
            </Container>
        </Container>
    );
}

  export default ApplicationStatus;