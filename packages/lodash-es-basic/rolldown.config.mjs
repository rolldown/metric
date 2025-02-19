import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";

export default defineConfig({
  input: "./src/index.js",
  output: {
    dir: "rolldown-dist",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  profilerNames: false,
  plugins: [
    minify({
      module: true,
      // swc's minify option here
      mangle: {
        toplevel: true,
      },
      compress: {},
    })
  ],
});
