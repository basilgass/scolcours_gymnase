import {defineConfig} from "vite"
import laravel from "laravel-vite-plugin"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						return id
							.toString()
							.split("node_modules/")[1]
							.split("/")[0]
							.toString()
					}
				},
			},
		},
	},
	plugins: [
		laravel({
			input: "resources/js/app.ts",
			refresh: true,
		}),
		vue({
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false,
				},
			},
		}),
		tailwindcss()
	],
	resolve: {
		alias: {
			"@/*": ["./resources/js/*"],
			// "@": "./resources/js",
		},
	},
	test: {
		environment: "jsdom",
	},
})
