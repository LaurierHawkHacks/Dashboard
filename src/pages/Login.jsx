import React from "react";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/styles/makeStyles";
import { BrandingIcon, FormButton, FormInput, FormLink, FormTitle, FormText, PageBackground } from "@atoms";
import { BackgroundIllustration } from "@assets";

const useStyles = makeStyles({
    card: {
        padding: "2em",
        minWidth: "20vw",
    },
});

// see https://react-bootstrap.github.io/components/forms/
const LoginPage = (props) => {
    const { email, setEmail, password, setPassword, handleLogin, handleSignUp, hasAccount, setHasAccount, emailError, passwordError } = props;
    const classes = useStyles();
    return (
        <PageBackground src={BackgroundIllustration}>
            <Card className={classes.card}>
                <form className="loginForm">
                    <BrandingIcon />
                    <FormTitle label="Hawk Hacks Portal" />
                    <FormInput
                        id="loginEmail"
                        type="text"
                        label="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={emailError ? true : false}
                        helperText={emailError}
                        required
                    />
                    <FormInput
                        id="loginPassword"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={passwordError ? true : false}
                        helperText={passwordError}
                        required
                    />
                    <div className="btnContainer">
                        <FormButton
                            variant="contained"
                            color="primary"
                            label={hasAccount ? "Log In" : "Sign Up"}
                            onClick={hasAccount ? handleLogin : handleSignUp}
                        />
                        <FormText>
                            {hasAccount ? "Don't have an account? " : "Already have an account? "}
                            <FormLink
                                variant="primary"
                                label={hasAccount? "Sign Up here!" : "Sign In here!"}
                                onClick={() => setHasAccount(!hasAccount)}
                            />
                        </FormText>
                    </div>
                </form>
            </Card>
        </PageBackground>
    );
}

export default LoginPage;