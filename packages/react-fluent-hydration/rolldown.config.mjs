import { defineConfig } from "rolldown";
import * as path from "path";
import { getSharedRolldownConfig } from "../../scripts/rolldown-shared-config.mjs";

const sharedConfig = getSharedRolldownConfig();

export default defineConfig({
  input: path.resolve(import.meta.dirname, "./src/index.jsx"),
  output: {
    dir: sharedConfig.outputDir,
    generatedCode: {
      profilerNames: false,
    },
    ...sharedConfig.output,
  },
  transform: {
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
  treeshake: {
    commonjs: true,
  },
  plugins: sharedConfig.plugins,
  experimental: sharedConfig.experimental,
});
