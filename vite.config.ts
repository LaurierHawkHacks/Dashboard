/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
        include: ["./src/**/*.test.{ts,tsx}"],
        clearMocks: true,
    },
    define: {
        APP_VERSION: JSON.stringify("2.4.0"),
    },
});
