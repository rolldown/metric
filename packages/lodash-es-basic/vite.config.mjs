import { defineConfig } from "vite";
import { minify } from "rollup-plugin-swc3";

export default defineConfig({
  build: {
    outDir: "vite-dist",
    rollupOptions: {
      output: {
        minify: false,
      },
    },
    lib: {
      entry: "src/index.js",
      formats: ["es"],
    },
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
