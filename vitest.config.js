// vitest.config.ts
import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./resources/js"),
		},
	},
	test: {
		environment: "jsdom",
		include: ["tests/ts/**/*.test.ts"],
	},
})
