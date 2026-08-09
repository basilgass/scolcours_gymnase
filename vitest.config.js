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
		coverage: {
			// Provider natif V8 (aligné sur la version de Vitest, cf. @vitest/coverage-v8).
			provider: "v8",
			// text : résumé CLI ; html : rapport navigable dans storage/coverage-ts.
			reporter: ["text", "html"],
			reportsDirectory: "storage/coverage-ts",
			// Périmètre F0/F1 : la logique TS (checkers, composables, helpers).
			// F3 : les composants .vue entrent dans la mesure (nouvelle baseline,
			// le dénominateur s'élargit -> chute mécanique du % attendue).
			include: ["resources/js/**/*.ts", "resources/js/**/*.vue"],
			// all : compter les fichiers jamais importés par un test (0 %) dans le
			// dénominateur -> la baseline révèle les trous, pas seulement le testé.
			all: true,
			exclude: ["resources/js/**/*.d.ts"],
		},
	},
})
