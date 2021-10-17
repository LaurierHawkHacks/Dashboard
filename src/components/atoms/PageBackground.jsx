import React from "react";
import Styled from "styled-components";
import { makeStyles } from "@material-ui/styles";
import { BackgroundIllustration } from "@assets";

const Background = Styled.div`
    min-width: 100vw;
    min-height: 100vh;
    position: fixed;
    top: 0; left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to top, #C5E8F4, #FDE0DF);
`;

const useStyles = makeStyles({

});

function PageBackground({ src, children, ...rest }) {
    const classes = useStyles();
    return (
        <Background {...rest}>
            {children}
        </Background>
    );
}

export default PageBackground;