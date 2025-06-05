import { defineConfig } from "vite";

const isDev = process.env.NODE_ENV === "development";
export default defineConfig({
  experimental: {
    enableNativePlugin: isDev ? 'resolver' : true
  },
  base: '/metric',
  build: {
    outDir: "docs",
  }
})
