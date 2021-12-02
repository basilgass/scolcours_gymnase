const path = require('path')
module.exports = {
	output: {
		chunkFilename: 'js/dynamic/[name].[contenthash].js'
	},
	resolve: {
		alias: {
			'@': path.resolve('resources/js'),
		},
	},
}