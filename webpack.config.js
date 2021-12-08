const path = require('path')
module.exports = {
	output: {
		chunkFilename: 'js/dev/[name].js',
	},
	resolve: {
		alias: {
			'@': path.resolve('resources/js'),
		},
	},
}