import { defineConfig } from "rolldown";
import * as path from "path";
import { getSharedRolldownConfig } from "../../scripts/rolldown-shared-config.mjs";

const sharedConfig = getSharedRolldownConfig();

export default defineConfig({
  ...sharedConfig,
  input: path.resolve(import.meta.dirname, "./src/index.jsx"),
  output: {
    ...sharedConfig.output,
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
});
