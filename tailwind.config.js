import forms from "@tailwindcss/forms";
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                tbrand: "#2B6469",
                "tbrand-hover": "#0FA3B1",
                "tbrand-mouse-down": "#1D7882",
                "tbrand-highlight": "#00CEDB",
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
        },
    },
    plugins: [forms],
};
