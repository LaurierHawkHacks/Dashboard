import React from "react";
import Styled from "styled-components";

const Background = Styled.div`
    min-width: 100vw;
    min-height: 100vh;
    position: fixed;
    top: 0; left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(200, 240, 255);
`;

function PageBackground({ src, children, ...rest }) {
    return (
        <Background style={{ backgroundImage: src }} {...rest}>
            {children}
        </Background>
    );
}

export default PageBackground;