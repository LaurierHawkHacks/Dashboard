/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/"),
            "@assets": path.resolve(__dirname, "src/assets/"),
            "@components": path.resolve(__dirname, "src/components/"),
            "@services": path.resolve(__dirname, "src/services/"),
            "@utils": path.resolve(__dirname, "src/utils/"),
            "@providers": path.resolve(__dirname, "src/providers/"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
        include: ["./src/**/*.test.{ts,tsx}"],
    },
});
