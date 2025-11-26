// load using import
import { glob } from "glob";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { getVersionMap, persistEntries } from "./utils.mjs";

const __dirname = import.meta.dirname;
const apps = fs.readdirSync(path.resolve(__dirname, "../packages"));
const excludeApps = ["10000"];

let recordMap = {};
let gzipRecordMap = {};
const dists = [
  "parcel-dist",
  "esbuild-dist",
  "rolldown-oxc-dist",
  "rolldown-swc-dist",
  "rolldown-strictExecutionOrder-dist",
  "rolldown-onDemandWrapping-dist",
  "rspack-dist",
  "vite-dist",
];

for (let i = 0; i < apps.length; i++) {
  let app = apps[i];
  if (excludeApps.includes(app)) {
    continue;
  }
  let appRecord = {};
  let gzipAppRecord = {};
  for (let dist of dists) {
    // Remove the -dist suffix to get the bundler name
    let name = dist.replace(/-dist$/, "");
    let totalSize = 0;
    let totalGzipSize = 0;
    const jsfiles = await glob(`packages/${app}/${dist}/**/*.{js,mjs}`, {
      ignore: "**/node_modules/**",
    });
    for (let f of jsfiles) {
      const content = fs.readFileSync(f);
      totalSize += content.length;
      totalGzipSize += zlib.gzipSync(content).length;
    }
    appRecord[name] = totalSize;
    gzipAppRecord[name] = totalGzipSize;
  }
  recordMap[app] = appRecord;
  gzipRecordMap[app] = gzipAppRecord;
}

const entries = toEntries(recordMap, "production build size");
const gzipEntries = toEntries(gzipRecordMap, "production build size (gzip)");
persistEntries([...entries, ...gzipEntries], path.resolve(__dirname, "../metric.json"));
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
