import { defineConfig } from "vite";
import { viteMinify } from "rollup-plugin-swc3";

export default defineConfig({
  build: {
    outDir: "vite-dist",
    rollupOptions: {
      output: {
        minify: false,
      },
      treeshake: {
        commonjs: true
      },
      profilerNames: false
    },
  },

  plugins: [
    viteMinify({
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
