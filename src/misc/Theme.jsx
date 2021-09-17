import React from 'react';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const fontFamilyBody = `"Nunito", "Nunito Sans", "Roboto", "Open Sans", "Helvetica", "Arial", sans-serif`;
const fontFamilyHeaders = `"Nunito Sans", "Nunito", "Roboto", "Open Sans", "Helvetica", "Arial", sans-serif`;
const headersObj = { fontFamily: fontFamilyHeaders }

const theme = createTheme({
    palette: {
        primary: {
            light: "#5dd5e3",
            main: "#0fa3b1",
            dark: "#0a6972",
            contrastText: "#fcfcfc",
        },
        secondary: {
            light: "#0fa3b1",
            main: "#0a6972",
            dark: "#2f4858",
            contrastText: "#fcfcfc",
        },
    },
    typography: {
        fontFamily: fontFamilyBody,
        h1: headersObj,
        h2: headersObj,
        h3: headersObj,
        h4: headersObj,
        h5: headersObj,
        h6: headersObj,
    },
});

const style = <style type="text/css">{`
    .link {
        cursor: pointer;
        color: ${theme.palette.primary.main};
        text-decoration: none;
    }
        .link:hover {
            color: ${theme.palette.primary.dark};
            text-decoration: underline;
        }

    .link-primary {
        color: ${theme.palette.primary.main};
    }
        .link-primary:hover {
            color: ${theme.palette.primary.dark};
        }

    .spin-hover-animation {
        width: auto;
        height: 3.4em;
        transition: 150s ease;
    }
        .spin-hover-animation:hover {
            transition: 350s linear;
            transform: rotate(36000deg);
            cursor: pointer;
        }

    .MuiButton-root {
        font-family: ${fontFamilyHeaders};
        font-weight: bold;
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