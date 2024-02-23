/* eslint @typescript-eslint/no-var-requires: 0 */


// const defaultTheme = require("tailwindcss/defaultTheme")
// const colors = require("tailwindcss/colors")
import defaultTheme from "tailwindcss/defaultTheme"


const colors = require("tailwindcss/colors")

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
						: { [p + k]: o[k] },
				),
			)
		})(obj),
	)

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
			pattern: /bg-(red|green|blue|amber)-(500|600)/,
		},
		{
			pattern: /border-(red|green|blue|amber)-(500|600)/,
		},
		{
			pattern: /text-(red|green|blue|amber)-(500|600)/,
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
			pattern: /order-([1-2])/,
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
				gray: colors.neutral,
				lime: colors.lime,
				cyan: colors.cyan,
				amber: colors.amber,
				orange: colors.orange,
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
			},
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
		],
		padding: ["hover", "responsive"],
		textShadow: ["hover"],
		fontWeight: ["hover", "focus"],
		borderRadius: ["responsive", "hover"],
	},
	plugins: [
		function ({ addUtilities, theme }) {
			const utilities = {
				".bg-stripes": {
					backgroundImage:
						"linear-gradient(45deg, var(--stripes-color) 12.50%, transparent 12.50%, transparent 50%, var(--stripes-color) 50%, var(--stripes-color) 62.50%, transparent 62.50%, transparent 100%)",
					backgroundSize: "5.66px 5.66px",
				}
			}

			const addColor = (name, color) =>
				(utilities[`.bg-stripes-${name}`] = {
					"--stripes-color": color,
				})

			const colors = flattenColorPalette(theme("backgroundColor"))
			for (let name in colors) {
				try {
					const [r, g, b, a] = toRgba(colors[name])
					if (a !== undefined) {
						addColor(name, colors[name])
					} else {
						addColor(name, `rgba(${r}, ${g}, ${b}, 0.4)`)
					}
				} catch (_) {
					addColor(name, colors[name])
				}
			}

			addUtilities(utilities)
		},

		require("@tailwindcss/typography"),
		require("@tailwindcss/container-queries"),
		require("tailwind-scrollbar")({ nocompatible: true }),
		// require('@formkit/themes/tailwindcss'),
	],
}
