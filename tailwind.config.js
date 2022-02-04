const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
	mode: 'jit',
	purge: [
		'./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
		'./storage/framework/views/*.php',
		'./resources/views/**/*.blade.php',
		'./resources/js/**/*.vue',
		'./resources/js/*.js',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
			},
			zIndex: {
				'-1': '-1'
			},
			transformOrigin: {
				'0': '0%',
			},
			colors: {
				'gray': colors.neutral,
				'lime': colors.lime,
				'cyan': colors.cyan,
				'amber': colors.amber,
				'orange': colors.orange
			},
		},
	},

	variants: {
		opacity: ['responsive', 'hover', 'focus', 'disabled'],
		borderWidth: ['responsive', 'hover', 'focus', 'disabled'],
		borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
		backgroundColor: ['even', 'odd', 'hover', 'focus', 'responsive', 'active'],
		padding: ['hover', 'responsive'],
		textShadow: ['hover'],
		fontWeight: ['hover', 'focus'],
		borderRadius: ['responsive', 'hover']
	},

	plugins: [
		// require('@tailwindcss/forms'),
		// require('@tailwindcss/typography'),
	],
}
