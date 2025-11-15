import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";
import * as path from "path";

export default defineConfig({
  input: path.resolve(import.meta.dirname, "./src/index.jsx"),
  output: {
    dir: "rolldown-dist",
    generatedCode: {
      profilerNames: false,
    },
  },
  transform: {
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
  treeshake: {
    commonjs: true,
  },
  plugins: [
    minify({
      module: true,
      // swc's minify option here
      mangle: {
        toplevel: true,
      },
      compress: {},
    }),
  ],
});
