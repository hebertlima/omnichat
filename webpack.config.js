const path = require('path')
module.exports = {
	entry: path.resolve(__dirname, 'backend/src/main.js'),
	output: {
		path: path.resolve(__dirname, 'backend/public'),
		filename: 'omnichat.js'
	},
	mode: 'production',
	node: false,
}