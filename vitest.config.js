// vitest.config.ts
import {defineConfig} from "vitest/config"
import vue from "@vitejs/plugin-vue"
import path from "path"

export default defineConfig({
	// @vitejs/plugin-vue : nécessaire pour monter des SFC .vue dans les tests
	// (ex. filet de caractérisation KeyboardDisplay via @vue/test-utils).
	plugins: [vue()],
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
