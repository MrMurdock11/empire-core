const path = require("path");

module.exports = {
	entry: "./src/index",
	experiments: {
		outputModule: true,
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "index.js",
		module: true,
		library: {
			type: "commonjs",
		},
	},
	devtool: "source-map",
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
	module: {
		rules: require("./webpack.rules"),
	},
	plugins: require("./webpack.plugins"),
};
