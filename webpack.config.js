module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: [
								['@babel/env', {modules: false, targets: {browsers: 'chrome >= 88'}}],
								['@babel/react', {runtime: 'automatic', importSource: 'preact', useSpread: true}],
							],
							plugins: ['@babel/proposal-class-properties'],
						},
					},
				],
			},
		],
	},
};
