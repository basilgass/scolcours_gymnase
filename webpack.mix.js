const mix = require("laravel-mix")
const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
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
mix.js("resources/js/app.js", "public/js")
	.vue({
		options: {
			compilerOptions: {
				isCustomElement: (tag) => ["code-input"].includes(tag)
			}
		}
	})
	.extract()
	.postCss("resources/css/app.css", "public/css", [
		require("postcss-import"),
		require("tailwindcss"),
		require("autoprefixer")
	])
	.webpackConfig({
		output: {
			chunkFilename: mix.inProduction() ? "js/dynamic/[name].[contenthash].js" : "js/dev/[name].js",
		},
		plugins: [new NodePolyfillPlugin()],
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
		resolve: {
			// fallback: {
			// 	http : require.resolve("stream-http"),
			// 	https : require.resolve("https-browserify"),
			// 	url  : require.resolve("url"),
			// 	process: require.resolve("process/browser"),
			// 	zlib: require.resolve("browserify-zlib"),
			// 	stream: require.resolve("stream-browserify"),
			// 	util: require.resolve("util"),
			// 	buffer: require.resolve("buffer"),
			// 	asset: require.resolve("assert"),
			// },
			alias: {
				"@": path.resolve("resources/js"),
			},
		},
	})
	// optimization: {minimize: false}
	.sourceMaps(true)
	.disableNotifications()
// .js([
// 	"resources/js/pi.js",
// 	"resources/js/pidraw.js"
// ], "public/js/pi.bundle.js").minify("public/js/pi.bundle.js")

if (mix.inProduction()) {
	mix.version()
}
// else{
// 	mix.browserSync("http://127.0.0.1:8000/")
// }
