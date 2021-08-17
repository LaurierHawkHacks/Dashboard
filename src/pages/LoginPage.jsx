import React from 'react';
import Styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
            <Form>
                <h3>Sign In</h3>
                <Form.Group controlId="loginEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" />
                </Form.Group>
                <Form.Group controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Sign In
                </Button>
                <Form.Group controlId="loginForgotPassword">
                    <a>Forgot password?</a>
                </Form.Group>
            </Form>
        </Background>
    );
}

export default LoginPage;