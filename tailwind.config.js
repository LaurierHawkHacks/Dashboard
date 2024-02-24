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
        },
    },
    plugins: [],
};
