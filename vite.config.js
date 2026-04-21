import {defineConfig} from "vite"
import laravel from "laravel-vite-plugin"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"
import {resolve} from "path"
import inertia from '@inertiajs/vite'

export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						const pkg = id
							.toString()
							.split("node_modules/")[1]
							.split("/")[0]
							.toString()

						if (pkg === 'primsjs') return undefined
						return pkg
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
		inertia(),
		tailwindcss()
	],
	resolve: {
		alias: {
			"@": resolve("resources/js")
		},
	},
	test: {
		environment: "jsdom",
		projects: [
			{
				name: "default",
				include: ["./tests/ts/**/*.test.ts"]
			}
		]
	},
})
