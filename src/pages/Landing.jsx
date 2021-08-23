import React from "react";
import Styled from "styled-components";
import { FormButton, FormTitle } from "@atoms";

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

const LandingPage = ({ handleLogout }) => {
    return(
        <Background>
                <FormTitle variant="h4">Welcome Hawk!</FormTitle>
                <FormButton type="submit" onClick={handleLogout} label="Logout">Logout</FormButton>
        </Background>
    )
}

export default LandingPage;