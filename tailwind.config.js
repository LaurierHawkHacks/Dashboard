import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    important: true,
    theme: {
        extend: {
            fontFamily: {
                sans: ["Raleway", ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                raleway: {
                    "2.5xl": ["1.6875rem", "1.2"],
                    "3.5xl": ["2rem", "1.2"],
                    "4.5xl": ["2.6875rem", "1.2"],
                    "5.5xl": ["3.375rem", "1"],
                    "6.5xl": ["4.125rem", "1"],
                    "7.5xl": ["5.25rem", "1"],
                    "8.5xl": ["6.875rem", "1"],
                },
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
                deepPurple: "#F57EC5",
                deepGold: "#F8D579",
                mutedYellow: "#FFE976",
                stonePurple: "#D49DFF",
                tbrand: "#32848C",
                workshops: "#3160D9",
                mandatories: "#23BCCA",
                activities: "#AB8FF9",
                sponsorRelated: "#F07584",
                food: "#F0A975",
                searchbar: "#FFEEE4",
                "tbrand-hover": "#0FA3B1",
                "tbrand-mouse-down": "#1D7882",
                "tbrand-highlight": "#00CEDB",
                "btn-gradient-start": "#2B6469",
                "btn-gradient-end": "#00CEDB",
                "btn-gradient-start-dg": "#FE8E8E",
                "btn-gradient-end-dg": "#D94E4E",
                "btn-gradient-start-disabled": "#686868",
                "btn-gradient-end-disabled": "#9A9A9A",
            },
            translate: {
                0.75: "0.1875rem", // value in between of 0.5 and 1 (0.125rem + 0.25) / 2
            },
            transitionProperty: {
                notification: "opacity, transform, max-height",
            },
            transitionTimingFunction: {
                notification:
                    "cubic-bezier(.39,.44,0,1.21), cubic-bezier(.39,.44,0,1.21), ease-in",
            },
            backdropBrightness: {
                25: "0.25",
            },
            backgroundImage: {
                "radial-gradient-peach":
                    "radial-gradient(116.17% 116.17% at 50% 1.3%, #F8DFD1 0%, #FFFFFF 100%)",

                "btn-gradient":
                    "linear-gradient(182.75deg, #2B6469 -10.16%, #00CEDB 202.3%)",

                "btn-gradient-dg":
                    "linear-gradient(0deg, #FE8E8E 0%, #D94E4E 80%)",

                "btn-gradient-disabled":
                    "linear-gradient(0deg, #525151 0%, #9A9A9A 80%)",
            },
            boxShadow: {
                basic: "rgba(0, 0, 0, 0.1) 0px 3px 8px;",
            },
        },
    },
    plugins: [forms],
};
