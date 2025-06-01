import * as child from "node:child_process";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@providers": path.resolve(__dirname, "./src/providers"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@data": path.resolve(__dirname, "./src/data"),
			"@mocks/providers": path.resolve(__dirname, "./src/providers/__mocks__"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./setupTests.ts",
		include: ["./src/**/*.test.{ts,tsx}"],
		clearMocks: true,
	},
	define: {
		__GIT_COMMIT_HASH__: JSON.stringify(
			child
				.execSync(
					`git rev-parse --short ${process.env.GIT_COMMIT_HASH ?? "HEAD"}`,
				)
				.toString()
				.trim(),
		),
	},
});
