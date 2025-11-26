// load using import
import { glob } from "glob";
import * as fs from "fs";
import * as path from "path";
import { build } from "rolldown";
import { minify } from "rollup-plugin-swc3";
import { getVersionMap, persistEntries } from "./utils.mjs";

const __dirname = import.meta.dirname;
const apps = fs.readdirSync(path.resolve(__dirname, "../packages"));
const excludeApps = ["10000"];

// Define rolldown build configurations
// 1. oxc minifier only
// 2. swc minifier (plugin)
// 3. strictExecutionOrder + oxc minifier
// 4. strictExecutionOrder + ondemandWrapping + oxc minifier
const rolldownConfigs = [
  {
    name: "rolldown-oxc-minify",
    getConfig: (baseConfig) => ({
      ...baseConfig,
      output: {
        ...baseConfig.output,
        minify: true,
      },
      plugins: [],
    }),
  },
  {
    name: "rolldown-swc-minify",
    getConfig: (baseConfig) => ({
      ...baseConfig,
      output: {
        ...baseConfig.output,
        minify: false,
      },
      plugins: [
        minify({
          module: true,
          mangle: {
            toplevel: true,
          },
          compress: {},
        }),
      ],
    }),
  },
  {
    name: "rolldown-seo-oxc-minify",
    getConfig: (baseConfig) => ({
      ...baseConfig,
      output: {
        ...baseConfig.output,
        minify: true,
      },
      experimental: {
        strictExecutionOrder: true,
      },
      plugins: [],
    }),
  },
  {
    name: "rolldown-seo-odw-oxc-minify",
    getConfig: (baseConfig) => ({
      ...baseConfig,
      output: {
        ...baseConfig.output,
        minify: true,
      },
      experimental: {
        strictExecutionOrder: true,
        onDemandWrapping: true,
      },
      plugins: [],
    }),
  },
];

// Run rolldown builds for each app with different configurations
async function runRolldownBuilds() {
  for (const app of apps) {
    if (excludeApps.includes(app)) {
      continue;
    }

    const appDir = path.resolve(__dirname, "../packages", app);

    // Determine input file based on existence
    let inputFile;
    if (fs.existsSync(path.join(appDir, "src/index.jsx"))) {
      inputFile = path.join(appDir, "src/index.jsx");
    } else if (fs.existsSync(path.join(appDir, "src/index.js"))) {
      inputFile = path.join(appDir, "src/index.js");
    } else {
      console.warn(`No input file found for ${app}, skipping rolldown builds`);
      continue;
    }

    // Base config common to all rolldown variants
    const baseConfig = {
      input: inputFile,
      output: {
        dir: "", // Will be set per config
      },
      transform: {
        define: {
          "process.env.NODE_ENV": JSON.stringify("production"),
        },
      },
    };

    for (const config of rolldownConfigs) {
      const outputDir = path.join(appDir, config.name);
      const rolldownConfig = config.getConfig({
        ...baseConfig,
        output: {
          ...baseConfig.output,
          dir: outputDir,
        },
      });

      try {
        await build(rolldownConfig);
        console.log(`Built ${app} with ${config.name}`);
      } catch (error) {
        console.error(`Failed to build ${app} with ${config.name}:`, error);
      }
    }
  }
}

// Run the rolldown builds
await runRolldownBuilds();

let recordMap = {};
const dists = [
  "parcel-dist",
  "esbuild-dist",
  "rolldown-oxc-minify",
  "rolldown-swc-minify",
  "rolldown-seo-oxc-minify",
  "rolldown-seo-odw-oxc-minify",
  "rspack-dist",
  "vite-dist",
];

for (let i = 0; i < apps.length; i++) {
  let app = apps[i];
  if (excludeApps.includes(app)) {
    continue;
  }
  let appRecord = {};
  for (let dist of dists) {
    // Extract bundler name - handle both old format (bundler-dist) and new format (rolldown-*)
    let bundlerName;
    if (dist.startsWith("rolldown-")) {
      bundlerName = dist;
    } else {
      [bundlerName] = dist.split("-");
    }
    let totalSize = 0;
    const jsfiles = await glob(`packages/${app}/${dist}/**/*.{js,mjs}`, {
      ignore: "**/node_modules/**",
    });
    for (let f of jsfiles) {
      totalSize += fs.statSync(f).size;
    }
    appRecord[bundlerName] = totalSize;
  }
  recordMap[app] = appRecord;
}

const entries = toEntries(recordMap, "production build size");
persistEntries(entries, path.resolve(__dirname, "../metric.json"));
function toEntries(recordMap, metric) {
  let entries = [];
  let versionMap = getVersionMap();
  Object.entries(recordMap).forEach(([app, records]) => {
    entries.push({
      case: app,
      metric,
      timestamp: Date.now(),
      commit: versionMap,
      unit: "byte",
      records,
    });
  });
  return entries;
}
