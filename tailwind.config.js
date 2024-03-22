import defaultTheme from "tailwindcss/defaultTheme";
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: { 
                sans: ["Raleway", ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                "raleway": {
                    "2.5xl": ["1.6875rem", "1.2"],
                    "3.5xl": ["2rem", "1.2"],
                    "4.5xl": ["2.6875rem", "1.2"],
                    "5.5xl": ["3.375rem", "1"],
                    "6.5xl": ["4.125rem", "1"],
                    "7.5xl": ["5.25rem", "1"],
                    "8.5xl": ["6.875rem", "1"],
                }
            },
            colors: {
                charcoalBlack: "#333333",
                peachPuff: "#FDDDB7",
                eggShell: "#F1E7DF",
                dustStorm: "#EBCACC",
                brightUbe: "#CBAAF4",
                paleViolet: "#BAA3FA",
                blueGreen: "#0FA3B1",
                cadetBlue: "#0C6975",
                deepMarine: "#2B6469",
                slateGray: "#31495C",
                copper: "#DE846E",
                khakiYellow: "#F0E698",
                dimGray: "#4A4F50",
                sageGray: "#577893",
                peachWhite: "#FFEEE4",
                tbrand: "#2B6469",
                "tbrand-hover": "#0FA3B1",
                "tbrand-mouse-down": "#1D7882",
                "tbrand-highlight": "#00CEDB",
            },
            translate: {
                0.75: "0.1875rem", // value in between of 0.5 and 1 (0.125rem + 0.25) / 2
            },
        },
    },
    plugins: [],
};
