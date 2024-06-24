const path = require("path");
/**@type {import("webpack").Configuration}*/
module.exports = {
	mode: "production",
	entry: {
		main: "./src/index.jsx",
	},
	optimization: {
		minimize: false,
		mangleExports: false,
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					// Use `.swcrc` to configure swc
					loader: "swc-loader",
					options: {
						// This makes swc-loader invoke swc synchronously.
						sync: true,
						jsc: {
							parser: {
                jsx: true
							},
						},
					},
				},
			},
		],
	},
	output: {
		path: path.resolve(__dirname, "webpack-dist"),
	},
};
