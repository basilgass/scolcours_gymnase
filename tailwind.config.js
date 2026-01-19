import defaultTheme from "tailwindcss/defaultTheme"

export default {
	darkMode: 'selector',
	content: [
		"./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
		"./storage/framework/views/*.php",
		"./resources/views/**/*.blade.php",
		"./resources/js/**/*.vue",
		"./resources/css/**/*.css",
		"./resources/js/*.js",
		"./resources/js/*.ts",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Roboto Flex", ...defaultTheme.fontFamily.sans],
			}
		},
	},
	plugins: [],
}
