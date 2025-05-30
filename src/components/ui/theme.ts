import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
	theme: {
		tokens: {
			colors: {
				brand: {
					primary: { value: "#FFB65F" },
					contrast: { value: "{colors.black}" },
					subtle: { value: "#666484" },
					bg: { value: "#13151c" },
				},
				offwhite: {
					primary: { value: "#DEEBFF" },
				},
			},
		},
		semanticTokens: {
			colors: {
				brand: {
					solid: { value: "{colors.brand.primary}" },
				},
				bg: {
					DEFAULT: { value: "#13151c" },
					panel: { value: "#13151c" },
					hover: { value: "#1F1E2E" },
				},
				fg: {
					DEFAULT: { value: "{colors.offwhite.primary}" },
					muted: { value: "#666484" },
					error: { value: "{colors.red.400}" },
				},
				border: {
					DEFAULT: { value: "#1F1E2E" },
				},
			},
		},
		breakpoints: {
			bipolarBigBoi: "1511px",
			bipolarNotSoBigBoi: "1300px",
		},
	},
	globalCss: {
		html: {
			colorPalette: "brand",
		},
	},
});

export const system = createSystem(defaultConfig, config);
