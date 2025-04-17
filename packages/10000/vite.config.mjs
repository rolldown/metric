import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  esbuild: false,
});
