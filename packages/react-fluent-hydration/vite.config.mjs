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
  experimental: {
    enableNativePlugin: true
  }
});
