const defaultTheme = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")

module.exports = {
	mode: "jit",
	content: [
		"./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
		"./storage/framework/views/*.php",
		"./resources/views/**/*.blade.php",
		"./resources/js/**/*.vue",
		"./resources/css/**/*.css",
		"./resources/js/*.js",
	],
	safelist: [
		{
			pattern: /bg-(red|green|blue|amber)-(500|600)/
		},
		{
			pattern: /text-(red|green|blue|amber)-(500|600)/
		}
	],
	theme: {
		extend: {
			fontFamily: {
				// sans: ["Quicksand", ...defaultTheme.fontFamily.sans],
				sans: ["Raleway", ...defaultTheme.fontFamily.sans],
			},
			zIndex: {
				"-1": "-1"
			},
			transformOrigin: {
				"0": "0%",
			},
			colors: {
				"gray": colors.neutral,
				"lime": colors.lime,
				"cyan": colors.cyan,
				"amber": colors.amber,
				"orange": colors.orange
			},
			maxHeight: {
				"1/2": "50vh",
			}
		},
	},

	variants: {
		opacity: ["responsive", "hover", "focus", "disabled"],
		borderWidth: ["responsive", "hover", "focus", "disabled"],
		borderColor: ["responsive", "hover", "focus", "focus-within"],
		backgroundColor: ["even", "odd", "hover", "focus", "responsive", "active"],
		padding: ["hover", "responsive"],
		textShadow: ["hover"],
		fontWeight: ["hover", "focus"],
		borderRadius: ["responsive", "hover"]
	},
	plugins: [
		// require('@tailwindcss/forms'),
		require("@tailwindcss/typography"),
		require("@tailwindcss/line-clamp"),
	],
}
