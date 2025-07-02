import { defineConfig } from "@rspack/cli";
import * as path from 'path'

export default defineConfig({
  mode: "production",
  entry: {
    main: "./src/index.jsx",
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              }
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  output: {
    path: path.resolve(import.meta.dirname, "rspack-dist"),
  },
});
