import { defineConfig } from "rolldown";
import esbuild from "esbuild";

export default defineConfig({
  input: "./src/index.js",
  resolve: {
    // This needs to be explicitly set for now because oxc resolver doesn't
    // assume default exports conditions. Rolldown will ship with a default that
    // aligns with Vite in the future.
    conditionNames: ["import"],
  },
  output: {
    dir: "rolldown-dist",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [
    {
      // NOTE: use esbuild's minify/syntax lowering feature for now
      name: "esbuild-minify",
      async renderChunk(code) {
        const result = await esbuild.transform(code, {
          minify: true,
          target: ["chrome87", "firefox78", "safari14", "edge88"],
          format: "esm",
          sourcemap: false,
        });
        return { code: result.code, map: result.map };
      },
    },
  ],
});
