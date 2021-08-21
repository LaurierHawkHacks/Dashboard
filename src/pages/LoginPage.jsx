import React from 'react';
import Styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import { FormButton, FormInput, FormLink, FormTitle } from '../components/atoms';

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

// see https://react-bootstrap.github.io/components/forms/
const LoginPage = (props)=> {

    const {email, setEmail, password, setPassword, handleLogin, handleSignUp, hasAccount, setHasAccount, emailError, passwordError} = props;
    return (
        <Background>
            <Form className="loginForm">
                <FormTitle label="Hawk Hack Portal" />
                <FormInput controlId="loginEmail" label="Email Address" type="text" value={email} onChange={e=>setEmail(e.target.value)}/>
                <p>{emailError}</p>
                <FormInput controlId="loginPassword" type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                <p>{passwordError}</p>
                <div className="btnContainer">
                    {hasAccount ? (
                        <div>
                        <FormButton variant="main" type="click" onClick={handleLogin} label="Log In" />
                        <p>Don't have an account? <a title="Sign up" href="#"><span onClick={()=> setHasAccount(!hasAccount)}>Sign up</span></a></p>
                        </div>
                    ):( 
                        <div>
                        
                        <FormButton variant="main" type="Click"  onClick={handleSignUp} label="Sign Up" />
                        <p>Have an account? <a title="Sign in" href="#"><span  onClick={()=> setHasAccount(!hasAccount)}>Sign In</span></a></p>
                        </div>
                    )}
                </div>
                
                <FormLink controlId="loginForgotPassword" variant="main" href={"/"} label="Forgot password?" />
            </Form>
        </Background>
    );
}

export default LoginPage;