// const defaultTheme = require("tailwindcss/defaultTheme")
// const colors = require("tailwindcss/colors")
import defaultTheme from "tailwindcss/defaultTheme"
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
		"./storage/framework/views/*.php",
		"./resources/views/**/*.blade.php",
		"./resources/js/**/*.vue",
		"./resources/css/**/*.css",
		"./resources/js/*.js",
		"./resources/js/*.ts",
	],
	safelist: [
		{
			pattern: /bg-(red|green|blue|amber)-(500|600)/
		},
		{
			pattern: /text-(red|green|blue|amber)-(500|600)/
		},
		{
			pattern: /col-span-([1-9])/,
			variants: ["lg", "md", "xl"]
		},
		{
			pattern: /justify-(between|around)/
		},
		{
			pattern: /max-w-.+/
		},
		{
			pattern: /grid-cols-([1-9]|10)/,
			variants: ["lg", "md", "xl"]
		},
		{
			pattern: /order-([1-2])/,
			variants: ["lg", "md", "xl"]
		}
	],
	theme: {
		extend: {
			fontFamily: {
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
		require('@tailwindcss/typography'),
		require('@tailwindcss/container-queries'),
		require('tailwind-scrollbar')({nocompatible: true})
	],
}
