module.exports = [
	{
		test: /\.(ts|tsx|js)$/,
		exclude: /node_modules/,
		// use: ["babel-loader"],
		use: ["ts-loader"],
	},
];
