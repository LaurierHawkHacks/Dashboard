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
function LoginPage() {
    return (
        <Background>
            <Form className="loginForm">
                <FormTitle label="Sign In" />
                <FormInput controlId="loginEmail" type="email" label="Email Address" />
                <FormInput controlId="loginPassword" type="password" label="Password" />
                <FormButton variant="main" type="submit" onClick={(e) => e.preventDefault()} label="Sign In" />
                <FormLink controlId="loginForgotPassword" variant="main" href={"/"} label="Forgot password?" />
            </Form>
        </Background>
    );
}

export default LoginPage;