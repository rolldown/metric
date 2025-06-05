import * as fs from "fs";
import { execSync } from "child_process";
export function persistEntries(entries, filename) {
  for (let entry of entries) {
    fs.writeFileSync(filename, JSON.stringify(entry), { flag: "a" });
    fs.writeFileSync(filename, "\n", { flag: "a" });
  }
}

export function getVersionMap() {
  const res = execSync(
    "pnpm list 'rolldown' 'rolldown-vite' 'esbuild' '@rspack/cli' 'parcel' --json",
    {},
  );

  const json = JSON.parse(res.toString());

  const deps = json[0].devDependencies;

  let versionMap = Object.entries(deps).reduce((pre, cur) => {
    let [name, info] = cur;
    if (name === "@rspack/cli") {
      name = "rspack"; // normalize rspack name
    }
    pre[name] = info.version;
    return pre;
  }, {});
  return versionMap;
}
