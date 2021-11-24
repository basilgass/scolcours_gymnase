const path = require("path")
module.exports = {
	output: { chunkFilename: "js/app/[name].js?id=[chunkhash]" },
	resolve: {
		alias: {
			"@": path.resolve("resources/js"),
		},
	},
}
