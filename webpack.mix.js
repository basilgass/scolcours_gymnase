const mix = require('laravel-mix')
const path = require('path')
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.js('resources/js/app.js', 'public/js')
	.vue()
	// .extract(['pimath', 'pidraw', '@svgdotjs/svg.js', '@svgdotjs/svg.draggable.js'], 'bundle/pi.bundle.js')
	.extract()
	.postCss('resources/css/app.css', 'public/css', [
		require('postcss-import'),
		require('tailwindcss'),
		require('autoprefixer'),
	]).webpackConfig({
		output: {
			chunkFilename: mix.inProduction()?'js/dynamic/[name].[contenthash].js':'js/dev/[name].js',
		},
		resolve: {
			alias: {
				'@': path.resolve('resources/js'),
			},
			
		},
		// optimization: {
		// 	minimize: false
		// }
	})
	.js([
		'resources/js/pi.js',
		'resources/js/pidraw.js'
	], 'public/js/pi.bundle.js').minify('public/js/pi.bundle.js')

if (mix.inProduction()) {mix.version()}

// .js([
// "resources/js/pi.js",
// "resources/js/pigeometry.js",
// "resources/js/pigraph.js",
// ], "public/js/pi.bundle.js").minify("public/js/pi.bundle.js")
