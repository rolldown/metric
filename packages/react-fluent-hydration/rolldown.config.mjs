import { defineConfig } from "rolldown";
import terser from "@rollup/plugin-terser";
import * as path from 'path'

export default defineConfig({
  input: path.resolve(import.meta.dirname, "./src/index.jsx"),
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
