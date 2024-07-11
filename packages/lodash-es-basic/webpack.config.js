const path = require('path')
/**@type {import("webpack").Configuration}*/
module.exports = {
  mode: "production",
  entry: {
    "main": "./src/index.js"
  },
  optimization: {
    minimize: false,
    mangleExports: false
  },
  output: {
    path: path.resolve(__dirname, "webpack-dist")
  }
}
