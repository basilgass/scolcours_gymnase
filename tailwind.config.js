/** @type {import('tailwindcss').Config} */
/* eslint @typescript-eslint/no-var-requires: 0 */
import defaultTheme from "tailwindcss/defaultTheme"
// const colors = require("tailwindcss/colors")
const toRgba = (hexCode, opacity = 50) => {
	let hex = hexCode.replace("#", "")

	if (hex.length === 3) {
		hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
	}

	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	return `rgba(${r},${g},${b},${opacity / 100})`
}

const flattenColorPalette = (obj, sep = "-") =>
	Object.assign(
		{},
		...(function _flatten(o, p = "") {
			return [].concat(
				...Object.keys(o).map((k) =>
					typeof o[k] === "object"
						? _flatten(o[k], k + sep)
						: {[p + k]: o[k]},
				),
			)
		})(obj),
	)

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
	safelist: [
		{
			pattern: /(bg|border|text)-(algebre|analyse|geometrie|statistiques|jeux|tools|arithmetique|admin|main)-(50|300|500|600)/,
			variants: ["dark", "hover", "focus"],
		},
		{
			pattern: /(bg|border|text)-(red|green|blue|amber)-(500|600)/,
		},
		{
			pattern: /col-span-([1-9])/,
			variants: ["lg", "md", "xl"],
		},
		{
			pattern: /justify-(between|around)/,
		},
		{
			pattern: /max-w-.+/,
		},
		{
			pattern: /grid-cols-([1-9]|10)/,
			variants: ["lg", "md", "xl"],
		},
		{
			pattern: /order-([1-2]|last|first)/,
			variants: ["lg", "md", "xl"],
		},
	],
	theme: {
		extend: {
			fontFamily: {
				// sans: ["Raleway", ...defaultTheme.fontFamily.sans],
				// sans: ["Exo2", ...defaultTheme.fontFamily.sans],
				// sans: ["Roboto", "Lato", "Raleway", "Exo2", ...defaultTheme.fontFamily.sans],
				sans: ["Roboto Flex", ...defaultTheme.fontFamily.sans],
			},
			zIndex: {
				"-1": "-1",
			},
			transformOrigin: {
				0: "0%",
			},
			colors: {
				main: {
					50: "#fff2e6",
					300: "#ffb366",
					500: "#D2691E",
					600: "#cc5200"
				},
				gray: colors.neutral,
				algebre: colors.blue,
				analyse: colors.amber,
				geometrie: colors.purple,
				statistiques: colors.cyan,
				jeux: colors.orange,
				tools: colors.pink,
				arithmetique: colors.lime,
				admin: colors.slate,
			},
			maxHeight: {
				"1/2": "50vh",
			},
			maxWidth: {
				"2xs": "16rem",
				"3xs": "12rem",
				"4xs": "8rem",
			},
			spacing: {
				18: "4.5rem",
			}
		},
	},

	variants: {
		opacity: ["responsive", "hover", "focus", "disabled"],
		borderWidth: ["responsive", "hover", "focus", "disabled"],
		borderColor: ["responsive", "hover", "focus", "focus-within"],
		backgroundColor: [
			"even",
			"odd",
			"hover",
			"focus",
			"responsive",
			"active",
			"dark",
		],
		scale: ["responsive", "hover", "group-hover"],
		padding: ["hover", "responsive"],
		textShadow: ["hover"],
		fontWeight: ["hover", "focus"],
		borderRadius: ["responsive", "hover"],
	},
	plugins: [],
}
