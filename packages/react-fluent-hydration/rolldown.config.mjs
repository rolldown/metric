import { defineConfig } from 'rolldown'
import * as path from 'path'
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  input: path.resolve(__dirname, './src/index.jsx'),
  resolve: {

    // This needs to be explicitly set for now because oxc resolver doesn't
    // assume default exports conditions. Rolldown will ship with a default that
    // aligns with Vite in the future.
    conditionNames: ['import'],
  },
  plugins: [
    {
      transform(code, id) {
        const res = code.replace(/process\.env\.NODE_ENV/g, JSON.stringify("production"));
        return res;
      }
    }
  ],
  output: {
    dir: "rolldown-dist"
  }
})
