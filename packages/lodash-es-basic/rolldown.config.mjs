import { defineConfig } from "rolldown";
import { getSharedRolldownConfig } from "../../scripts/rolldown-shared-config.mjs";

const sharedConfig = getSharedRolldownConfig();

export default defineConfig({
  input: "./src/index.js",
  output: {
    dir: sharedConfig.outputDir,
    ...sharedConfig.output,
  },
  transform: {
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
  profilerNames: false,
  plugins: sharedConfig.plugins,
  experimental: sharedConfig.experimental,
});
