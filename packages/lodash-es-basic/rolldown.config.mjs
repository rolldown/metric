import { defineConfig } from "rolldown";
import { getSharedRolldownConfig } from "../../scripts/rolldown-shared-config.mjs";

const sharedConfig = getSharedRolldownConfig();

export default defineConfig({
  ...sharedConfig,
  input: "./src/index.js",
  transform: {
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
  profilerNames: false,
});
