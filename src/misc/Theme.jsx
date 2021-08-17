import React from 'react';
import { ThemeProvider } from "styled-components";

const theme = {
    colors: {
        black: "#30292F",
        white: "#FCFCFC",
        main: "#0A6972",
        dark: "#2F4858",
        light: "#0FA3B1"
    }
};

const style = <style type="text/css">{`
    .btn-main {
        background-color: ${theme.colors.light};
        color: ${theme.colors.white};
    }
        .btn-main:hover {
            background-color: ${theme.colors.main};
            color: ${theme.colors.white};
        }
        
    .link-main {
        color: ${theme.colors.main};
    }
        .link-main:hover {
            color: ${theme.colors.dark};
        }
`}</style>;

function Theme({ children }) {
    return (
        <>
            {style}
            <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        </>
    );
}

export default Theme;