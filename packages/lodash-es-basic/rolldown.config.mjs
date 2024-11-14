import { defineConfig } from "rolldown";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  input: "./src/index.js",
  output: {
    dir: "rolldown-dist",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [
    terser({
      maxWorkers: 1,
      sourceMap: false
    }),
  ],
});

