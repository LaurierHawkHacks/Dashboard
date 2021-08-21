import React from 'react';
import Styled from 'styled-components';
import { FormButton} from '../components/atoms';

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

const LandingPage =({handleLogout})=>{
    return(
        <Background>
                <h2>Welcome Hawk!</h2>
                <FormButton type="submit" onClick={handleLogout} label="Logout">Logout</FormButton>
            
        </Background>
    )
}

export default LandingPage;