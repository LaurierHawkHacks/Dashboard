/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/"),
            "@assets": path.resolve(__dirname, "./src/assets/"),
            "@components": path.resolve(__dirname, "./src/components/"),
            "@pages": path.resolve(__dirname, "./src/pages/"),
            "@services": path.resolve(__dirname, "./src/services/"),
            "@utils": path.resolve(__dirname, "./src/utils/"),
            "@providers": path.resolve(__dirname, "./src/providers/"),
            "@mocks/providers": path.resolve(
                __dirname,
                "./src/providers/__mocks__/"
            ),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
        include: ["./src/**/*.test.{ts,tsx}"],
        clearMocks: true,
    },
});
