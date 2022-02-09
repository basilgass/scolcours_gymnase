const mix = require('laravel-mix')
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
	.vue({
		start_url: '.'
	})
	.extract()
	.postCss('resources/css/app.css', 'public/css', [
		require('postcss-import'),
		require('tailwindcss'),
		require('autoprefixer'),
	])

if (mix.inProduction()) {
	mix
		.webpackConfig(require('./webpack.production'))
		.version()
}else{
	mix.webpackConfig(require('./webpack.config'))
}

// .js([
// "resources/js/pi.js",
// "resources/js/pigeometry.js",
// "resources/js/pigraph.js",
// ], "public/js/pi.bundle.js").minify("public/js/pi.bundle.js")
