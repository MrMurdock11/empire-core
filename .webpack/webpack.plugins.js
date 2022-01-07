const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
	new CleanWebpackPlugin(),
	new CopyPlugin({
		patterns: ["package.json"],
	}),
];
