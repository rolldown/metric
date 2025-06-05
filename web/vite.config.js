import { defineConfig } from "vite";

const isDev = process.env.NODE_ENV === "development";
export default defineConfig({
  experimental: {
    enableNativePlugin: isDev ? 'resolver' : true
  },
  build: {
    outDir: "docs"
  }
})
