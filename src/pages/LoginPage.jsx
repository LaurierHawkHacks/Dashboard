import React from 'react';
import Styled from 'styled-components';
import MuiCard from "@material-ui/core/Card";
import { FormButton, FormInput, FormLink, FormTitle, FormText } from '../components/atoms';

const Background = Styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0; left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(200, 240, 255);
`;

const Card = Styled(MuiCard)`
    padding: 2em;
    width: 20vw;
`;

// see https://react-bootstrap.github.io/components/forms/
const LoginPage = (props) => {
    const { email, setEmail, password, setPassword, handleLogin, handleSignUp, hasAccount, setHasAccount, emailError, passwordError } = props;
    return (
        <Background>
            <Card>
            <form className="loginForm" noValidate autoComplete="off" >
                <FormTitle label="Hawk Hacks Portal" />
                <FormInput
                    controlId="loginEmail"
                    type="text"
                    label="Email Address"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    error={emailError ? true : false}
                    helperText={emailError}
                    required
                />
                <FormInput
                    controlId="loginPassword"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
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
        </Background>
    );
}

export default LoginPage;