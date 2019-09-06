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
								['@babel/env', {modules: false, targets: {browsers: 'chrome >= 68'}}],
								['@babel/react', {pragma: 'preact.h'}],
							],
							plugins: ['@babel/proposal-class-properties'],
						},
					},
				],
			},
		],
	},
};
