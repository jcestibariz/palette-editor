const {resolve} = require('path');

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: [['env', {modules: false, useBuiltIns: true, targets: {browsers: 'chrome >= 68'}}], 'react', 'stage-2'],
							plugins: [['transform-react-jsx', {pragma: 'preact.h'}]],
						},
					},
				],
			},
		]
	}
};
