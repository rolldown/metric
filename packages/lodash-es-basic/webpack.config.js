const path = require("path");
/**@type {import("webpack").Configuration}*/
module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "webpack-dist"),
  },
};
